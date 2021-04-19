import * as React from "react"
import * as t from "./types"

import STORE_KEY from "./STORE_KEY"
import { freezeOnce, testStore } from "./utils"

// This implementation is inspired by:
//
// - https://github.com/mucsi96/react-create-shared-state
// - https://github.com/pelotom/use-methods

function errBadCreateStore(caller: string): string {
	return `${caller}: Bad store. ` +
		"Use `createStore(initialState, initializer)` to create a store and then " +
		"use `const [state, setState] = useStore(store)`."
}

function errBadUseStoreReducer(caller: string): string {
	return `${caller}: Bad reducer. ` +
		"Use `const reducer = state => ({ /* ... */ })` to create a reducer and then " +
		"use `const [state, fns] = useStoreReducer(store, reducer)`."
}

export function createStore<State>(initialState: State, initializer?: (initialState: State) => State): t.Store<State> {
	const subscriptions = new Set<React.Dispatch<State>>()
	let current = null
	if (typeof initializer === "function") {
		current = freezeOnce(initializer(initialState))
	} else {
		current = freezeOnce(initialState)
	}
	return { type: STORE_KEY, subscriptions, initialState: current, cachedState: current }
}

function useStoreImpl<State>(caller: string, store: t.Store<State>, reducer?: t.Reducer<State>):
	[State, React.Dispatch<State> | t.Methods<State>] {

	// Run checks once
	React.useMemo(() => {
		if (testStore(store) === false) {
			throw new Error(errBadCreateStore(caller))
		}
		if (!!reducer && typeof reducer !== "function") {
			throw new Error(errBadUseStoreReducer(caller))
		}
	}, [])


	const [state, setState] = React.useState(store.cachedState)
	const frozen = freezeOnce(state)

	// Manages subscriptions when a component mounts / unmounts
	React.useEffect(() => {
		store.subscriptions.add(setState)
		return () => void store.subscriptions.delete(setState)
	}, [])

	const setStore = React.useCallback(updater => {
		const nextFrozen = freezeOnce(typeof updater === "function" ? updater(store.cachedState) : updater)
		store.cachedState = nextFrozen
		setState(nextFrozen)
		for (const setter of store.subscriptions) {
			// Dedupe the current setter
			if (setter !== setState) {
				setter(nextFrozen)
			}
		}
	}, [])

	// Compute reducer keys once
	const reducerKeys = React.useMemo(() => {
		if (!(!!reducer)) {
			return null
		}
		return Object.keys(reducer(frozen))
	}, [])


	// Does not use React.useMemo because state changes on every pass
	let fns = null
	if (!!reducer && !!reducerKeys) {
		// TODO: Prefer to use useReducer but React errors: Warning: Cannot update a
		// component (`xxx`) while rendering a different component (`xxx`).
		fns = reducerKeys.reduce<t.Methods<State>>((accum, type) => {
			accum[type] = (...args) => {
				const next = reducer(frozen)[type]!(...args)
				setStore(next)
				return next
			}
			return accum
		}, {})
	}

	// useStore
	if (!(!!fns)) {
		return [frozen, setStore]
	}
	// useStoreReducer
	return [frozen, fns]
}

export function useStore<State>(store: t.Store<State>): [State, React.Dispatch<State>] {
	return useStoreImpl("useStore", store) as [State, React.Dispatch<State>]
}
export function useStoreValue<State>(store: t.Store<State>): State {
	return useStore(store)[0]
}
export function useStoreSetState<State>(store: t.Store<State>): React.Dispatch<State> {
	return useStore(store)[1]
}
export function useStoreReducer<State, Reducer extends t.Reducer<State>>(store: t.Store<State>, reducer: Reducer): [State, ReturnType<Reducer>] {
	return useStoreImpl("useStoreReducer", store, reducer) as [State, ReturnType<typeof reducer>]
}
