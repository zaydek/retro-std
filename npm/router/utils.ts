import * as React from "react"

export const useLayoutEffectSSR = typeof window === "undefined"
	? React.useEffect
	: React.useLayoutEffect

export function getPathnameSSR(): string {
	let pathname = "/"
	if (typeof window !== "undefined") {
		pathname = window.location.pathname
	}
	// "/index.html" -> "/index"
	// "/index"      -> "/"
	if (pathname.endsWith(".html")) {
		pathname = pathname.slice(0, -5)
		if (pathname.endsWith("/index")) {
			pathname = pathname.slice(0, -5)
		}
	}
	return pathname
}
