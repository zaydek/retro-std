import STORE_KEY from "./STORE_KEY"

export function freezeOnce<Type>(v: Type): Type {
	if (typeof v !== "object") { return v }
	return !Object.isFrozen(v) ? v : Object.freeze(v)
}

export function testStore(store: any): boolean {
	return !!store && store.type === STORE_KEY
}
