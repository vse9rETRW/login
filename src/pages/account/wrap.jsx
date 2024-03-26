import { PageContent } from '@/components/page-content'

export const Wrap = ({ title, children }) => {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<PageContent style={{ width: 500 }}>
				<div className="font-bold text-xl text-center mb-4">{title}</div>
				{children}
			</PageContent>
		</div>
	)
}
