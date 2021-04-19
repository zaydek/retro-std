import STORE_KEY from "./STORE_KEY"

export interface Store<Type> {
	type: typeof STORE_KEY
	subscriptions: Set<React.Dispatch<Type>>
	initialState: Type
	cachedState: Type
}

export type Methods<State> = Record<string, (...args: any[]) => State | void>
export type Reducer<State> = (state: State) => Methods<State>
