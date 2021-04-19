import useTodos from "./useTodos"

function TodoApp() {
	const inputRef = React.useRef(null)
	const [state, fns] = useTodos()

	return (
		<>
			<form onSubmit={e => {
				e.preventDefault()
				fns.addTodo()
				inputRef.current.focus()
			}}>
				<h1>{state.text || "(Empty)"}</h1>
				<div style={{ display: "flex", flexDirection: "row" }}>
					<input
						ref={inputRef}
						type="text"
						value={state.text}
						onChange={e => fns.setTodoText(e.target.value)}
					/>
					<button type="submit">Add todo</button>
				</div>
			</form>
			{state.todos.map(todo => (
				<React.Fragment key={todo.id}>
					<div style={{ display: "flex", flexDirection: "row" }}>
						<input
							type="checkbox"
							checked={todo.done}
							onChange={e => fns.setTodoDoneByID(todo.id, e.target.checked)}
						/>
						<input
							type="text"
							value={todo.text}
							onChange={e => fns.setTodoTextByID(todo.id, e.target.value)}
						/>
						<button onClick={e => fns.removeTodoByID(todo.id)}>-</button>
					</div>
				</React.Fragment>
			))}
		</>
	)
}

export default function App() {
	const [state] = useTodos()

	return (
		<>
			<div style={{ position: "fixed", bottom: 0, right: 0 }}>
				<pre style={{ width: 480 }}>{JSON.stringify({ state }, null, 2)}</pre>
			</div>
			{[...Array(10).keys()].map(k => (
				<TodoApp key={k} />
			))}
		</>
	)
}
