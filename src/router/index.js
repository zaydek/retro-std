// Change to `import { Link, Route, Router } from "@zaydek/retro-std"`
import { Link, Route, Router } from "../../npm/router"

function Nav() {
	const paths = ["/foo", "/bar", "/404", "/oops"]
	return (
		<ul>
			<>
				{paths.map(path => (
					<Link key={path} path={path}>
						<li>{path}</li>
					</Link>
				))}
			</>
		</ul>
	)
}

export default function App() {
	return (
		<>
			<Nav />
			<Router>
				<Route path="/">
					<div>
						Hello, world!{" "}
						<code>`/`</code>
					</div>
				</Route>
				<Route path="/foo">
					<div>
						Hello, world!{" "}
						<code>`/foo`</code>
					</div>
				</Route>
				<Route path="/bar">
					<div>
						Hello, world!{" "}
						<code>`/bar`</code>
					</div>
				</Route>
				<Route path="/404">
					<div>
						Hello, world!{" "}
						<code>`/404`</code>
					</div>
				</Route>
			</Router>
		</>
	)
}

// {/* <Route path="/todos">
// 	<TodoApp />
// 	<TodoApp />
// 	<TodoApp />
// </Route> */}
