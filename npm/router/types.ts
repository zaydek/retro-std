import * as React from "react"

export type ScrollTo = number | [number, number] | "no-op"

export interface RouterState {
	type: "REPLACE" | "PUSH"
	href: string
	scrollTo?: ScrollTo
}

export interface LinkProps {
	href: string
	scrollTo: ScrollTo
	children: React.ReactNode
}

export interface RedirectProps {
	href: string
	scrollTo: ScrollTo
}

export interface RouteProps {
	children: React.ReactNode
}

export interface RouterProps {
	children: React.ReactNode
}
