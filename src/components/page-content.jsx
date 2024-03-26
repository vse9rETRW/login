import { createClassName } from '@jsl'

export const PageContent = ({ className, children, style = {} }) => {
	return (
		<main
			className={createClassName(
				{
					'p-4 bg-white shadow-md rounded-md m-4': true,
				},
				[className],
			)}
			style={style}
		>
			{children}
		</main>
	)
}
