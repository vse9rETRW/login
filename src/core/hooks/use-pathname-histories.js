import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createProvider } from '@jsl-react/lib'

const service = () => {
	const location = useLocation()
	const [pathnameHistories, setPathnameHistories] = useState([])
	const previousPathname = useMemo(
		() => pathnameHistories[pathnameHistories.length - 2],
		[pathnameHistories],
	)

	useEffect(() => {
		setPathnameHistories(e => {
			if (e.length >= 10) {
				return [...e.slice(1, 10), location.pathname]
			}
			return [...e, location.pathname]
		})
	}, [location])

	return {
		pathnameHistories,
		previousPathname,
	}
}

export const {
	Provider: PathnameHistoriesProvider,
	inject: usePathnameHistories,
} = createProvider(service)
