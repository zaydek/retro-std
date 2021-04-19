// Change to `import * as store from "@zaydek/retro-std"`
import * as store from "../../npm/store"

interface Todo {
	id: string
	done: boolean
	text: string
}

interface TodoApp {
	text: string
	todos: Todo[]
}

function hash(): string {
	return Math.random().toString(36).slice(2, 6)
}

export const todoStore = store.createStore<TodoApp>({
	text: "Hello, world!",
	todos: []
})

const reducer = (state: TodoApp) => ({
	setTodoText(text: string): TodoApp {
		return { ...state, text }
	},
	addTodo(): TodoApp {
		if (state.text === "") {
			return state
		}
		const id = hash()
		const todos = [
			{ id, done: false, text: state.text },
			...state.todos,
		]
		return { ...state, text: "", todos }
	},
	setTodoDoneByID(id: string, done: boolean): TodoApp {
		const x = state.todos.findIndex(todo => todo.id === id)
		if (x === -1) {
			return state
		}
		const todos = [
			...state.todos.slice(0, x),
			{ ...state.todos[x]!, done },
			...state.todos.slice(x + 1),
		]
		return { ...state, todos }
	},
	setTodoTextByID(id: string, text: string): TodoApp {
		const x = state.todos.findIndex(todo => todo.id === id)
		if (x === -1) {
			return state
		}
		const todos = [
			...state.todos.slice(0, x),
			{ ...state.todos[x]!, text },
			...state.todos.slice(x + 1),
		]
		return { ...state, todos }
	},
	removeTodoByID(id: string): TodoApp {
		const x = state.todos.findIndex(todo => todo.id === id)
		if (x === -1) {
			return state
		}
		const todos = state.todos.filter(todo => todo.id !== id)
		return { ...state, todos }
	},
})

export default function useTodos(): [TodoApp, ReturnType<typeof reducer>] {
	return store.useStoreReducer(todoStore, reducer)
}
