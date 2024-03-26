import { useEffect, useRef, useState } from 'react'

export const useVisible = (visible, onChangeVisible) => {
	const [_visible, set_visible] = useState(visible)
	const lockRef = useRef(1)

	const updateVisible = vs => {
		const v = typeof vs === 'function' ? vs(_visible) : vs
		if (visible === undefined) {
			lockRef.current++
			set_visible(v)
			onChangeVisible?.(v)
			return
		}
		if (onChangeVisible) {
			onChangeVisible?.(v)
		}
	}

	useEffect(() => {
		if (lockRef.current > 0) return lockRef.current--

		set_visible(visible)
	}, [visible])

	return [_visible, updateVisible]
}
