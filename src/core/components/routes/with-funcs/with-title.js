import { useTitle } from '@jsl-react/hooks'

export const withTitle = title => () => {
	useTitle(title)
}
