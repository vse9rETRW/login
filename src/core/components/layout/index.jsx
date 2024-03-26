import { Header } from '@/core/components/layout/header'

export const Layout = ({ children }) => {
	return (
		<div className="bg-gray-200 min-w-full min-h-screen flex flex-col">
			<Header />
			<div className="flex-1">{children}</div>
		</div>
	)
}
