import * as React from "react"
import * as store from "../store"
import * as t from "./types"

import {
	getPathnameSSR,
	useLayoutEffectSSR,
} from "./utils"

export const routerStore = store.createStore<t.RouterState>({
	href: getPathnameSSR(),
	type: "PUSH",
})

export function Link({ href, scrollTo, children, ...props }: t.LinkProps) {
	const setRouter = store.useStoreSetState(routerStore)

	function handleClick(e: React.MouseEvent) {
		e.preventDefault()
		setRouter({ type: "PUSH", href, scrollTo })
	}

	const scoped = href.startsWith("/")
	return (
		<a href={href} target={scoped ? undefined : "_blank"} rel={scoped ? undefined : "noreferrer noopener"}
			onClick={scoped ? handleClick : undefined} {...props}>
			{children}
		</a>
	)
}

export function Redirect({ href, scrollTo }: t.RedirectProps) {
	const [, setState] = store.useStore(routerStore)
	useLayoutEffectSSR(() => {
		setState({
			type: "REPLACE",
			href,
			scrollTo,
		})
	}, [href, scrollTo, setState])
	return null
}

export function Route({ children }: t.RouteProps) {
	return <>{children}</>
}

export function Router({ children }: t.RouterProps) {
	const [router, setRouter] = store.useStore(routerStore)

	React.useEffect(() => {
		function handlePopState() {
			setRouter({
				type: "REPLACE",
				href: getPathnameSSR(),
			})
		}
		window.addEventListener("popstate", handlePopState)
		return () => window.removeEventListener("popstate", handlePopState)
	}, [])

	let onceRef = React.useRef(false)
	React.useEffect(() => {
		if (!onceRef.current) {
			onceRef.current = true
			return
		}
		let { href: href, scrollTo } = router
		scrollTo ??= 0
		if (href === getPathnameSSR()) {
			if (router.type === "REPLACE") {
				window.history.pushState({}, "", href)
			} else if (router.type === "PUSH") {
				window.history.replaceState({}, "", href)
			}
		}
		if (scrollTo !== "no-op") {
			const x = !Array.isArray(scrollTo) ? 0 : scrollTo[0]
			const y = !Array.isArray(scrollTo) ? scrollTo : scrollTo[1]
			window.scrollTo(x, y)
		}
	}, [router])

	// Cache routes so rerenders are O(1)
	const cachedRoutes = React.useMemo(() => {
		type RouteMap = Record<string, React.ReactElement<typeof Route>>

		// Maps hrefs to components
		const routeMap: RouteMap = {}
		for (const child of [children].flat()) {
			if (!React.isValidElement(child)) {
				continue
			}
			if (child?.type === Route && !!(child?.props?.href)) {
				routeMap[child.props.href] = child
			}
		}
		return routeMap
	}, [children])

	return <>{cachedRoutes[router.href] || cachedRoutes["/404"]}</>
}
