import * as store from "../store"

export const routerStore = store.createStore<RouterState>({
	href: getPathnameSSR(),
	type: "PUSH",
})
