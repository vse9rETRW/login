import { Suspense } from 'react'

export const withSuspenseRoute =
	(RouteComponent, Fallback, ...withFuncs) =>
	() => {
		withFuncs.forEach(e => e())
		return (
			<Suspense fallback={<Fallback />}>
				<RouteComponent />
			</Suspense>
		)
	}
