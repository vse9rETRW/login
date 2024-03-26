import { createClassName } from '@jsl'

export const Button = ({
	className,
	children,
	loading = false,
	style = {},
	onClick: onPropClick,
}) => {
	const onClick = ev => {
		if (loading) return
		onPropClick?.(ev)
	}
	return (
		<button
			className={createClassName({
				'rounded-md text-white px-4 py-2': true,
				'bg-primary': !loading,
				'bg-gray-400': loading,
				[className]: className != null,
			})}
			style={style}
			onClick={onClick}
		>
			{loading ? '稍等' : children}
		</button>
	)
}
