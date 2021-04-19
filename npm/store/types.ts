import STORE_KEY from "./STORE_KEY"

export interface Store<T> {
	type: typeof STORE_KEY
	subscriptions: Set<React.Dispatch<T>>
	initialState: T
	cachedState: T
}

export type Methods<State> = Record<string, (...args: any[]) => State | void>
export type Reducer<State> = (state: State) => Methods<State>
