import { lazy } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { NoLayoutFallback } from '@/core/components/fallback/no-layout-fallback'
import { Layout } from '@/core/components/layout'
import { LayoutFallback } from '@/core/components/fallback/layout-fallback'
import { withTitle } from '@/core/components/routes/with-funcs/with-title'
import { RouteWrapper } from '@/core/components/routes/route-wrapper'
import { withSuspenseRoute } from '@/core/components/routes/with-suspense-route'
import { withSuspensePrivateRoute } from '@/core/components/routes/with-suspense-private-route'
import { PathnameHistoriesProvider } from '@/core/hooks/use-pathname-histories'

export const Routes = () => {
	return (
		<PathnameHistoriesProvider>
			<Switch>
				<Route
					path={'/login'}
					exact
					component={withSuspenseRoute(
						lazy(() => import('@/pages/account/login')),
						NoLayoutFallback,
						withTitle('登入'),
					)}
				/>

				<Route
					path={'/register'}
					exact
					component={withSuspenseRoute(
						lazy(() => import('@/pages/account/register')),
						NoLayoutFallback,
						withTitle('註冊'),
					)}
				/>

				{/* LayoutRoute START */}
				<RouteWrapper
					path={'/'}
					exact
					component={withSuspensePrivateRoute(
						lazy(() => import('@/pages/home')),
						LayoutFallback,
						withTitle('首頁'),
					)}
					layout={Layout}
				/>

				<RouteWrapper
					path={'/news'}
					exact
					component={withSuspensePrivateRoute(
						lazy(() => import('@/pages/news')),
						LayoutFallback,
						withTitle('最新消息'),
					)}
					layout={Layout}
				/>
				{/* LayoutRoute END */}

				<Route
					component={withSuspenseRoute(
						lazy(() => import('@/core/components/not-found')),
						NoLayoutFallback,
						withTitle('找不到頁面'),
					)}
				/>
			</Switch>
		</PathnameHistoriesProvider>
	)
}
