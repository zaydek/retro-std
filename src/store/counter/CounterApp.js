// Change to `import * as store from "@zaydek/retro-std"`
import * as store from "../../npm/store"

// Create a count store
const count = store.createStore(0)

function Counter() {
	// Get the count store
	const [state, setState] = store.useStore(count)

	return (
		<>
			<h1>{state}</h1>
			{/* Set the counter store */}
			<button onClick={e => setState(state - 1)}>-</button>
			<button onClick={e => setState(state + 1)}>+</button>
		</>
	)
}

export default function App() {
	const [state] = store.useStore(count)

	return (
		<>
			<div style={{ position: "fixed", bottom: 0, right: 0 }}>
				<pre style={{ width: 480 }}>{JSON.stringify({ state }, null, 2)}</pre>
			</div>
			{[...Array(10).keys()].map(k => (
				<Counter key={k} />
			))}
		</>
	)
}
