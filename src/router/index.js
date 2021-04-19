// Change to `import * as store from "@zaydek/retro-std/store"`
import * as store from "../../npm/store"

// Change to `import * as router from "@zaydek/retro-std/router"`
import * as router from "../../npm/router"
const { Link, Route, Router } = router

function Nav() {
	const hrefs = [
		"/foo",
		"/bar",
		"/baz",
		"/404",
		"/oops",
		"/redirect",
	]
	return (
		<ul>
			<>
				{hrefs.map(href => (
					<Link key={href} href={href}>
						<li>{href}</li>
					</Link>
				))}
			</>
		</ul>
	)
}

const useLayoutEffectSSR = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function Redirect({ href, scrollTo }) {
	const [, setState] = store.useStore(router.routerStore)
	useLayoutEffectSSR(() => {
		setState({
			type: "REPLACE",
			href,
			scrollTo,
		})
	}, [href, scrollTo, setState])
	return null
}

export default function App() {
	return (
		<>
			<Nav />
			<Router>
				<Route href="/">
					<div>
						Hello, world!{" "}
						<code>`/`</code>
					</div>
				</Route>
				<Route href="/foo">
					<div>
						Hello, world!{" "}
						<code>`/foo`</code>
					</div>
				</Route>
				<Route href="/bar">
					<div>
						Hello, world!{" "}
						<code>`/bar`</code>
					</div>
				</Route>
				<Route href="/baz">
					<div>
						Hello, world!{" "}
						<code>`/baz`</code>
					</div>
				</Route>
				<Route href="/404">
					<div>
						Hello, world!{" "}
						<code>`/404`</code>
					</div>
				</Route>
				<Route href="/redirect">
					<Redirect href="/foo" />
				</Route>
			</Router>
		</>
	)
}
