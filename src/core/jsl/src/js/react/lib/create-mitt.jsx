/// 創建 mitt() 鉤子
/// v0 

import { useCallback, useEffect } from 'react'
import mitt from 'mitt'

export { createMitt }

const createMitt = () => {
	const emitter = mitt()
	const useMitt = () => {
		/**
		 * mitt().emit
		 * @param type string
		 * @param ctx *
		 */
		const emit = (type, ctx) => emitter.emit(type, ctx)

		/**
		 * 會自動釋放的 mitt().on
		 * @type {function(string, function(*): void): void}
		 */
		const on = useCallback((type, cb) => {
			useEffect(() => {
				emitter.on(type, cb)
				return () => {
					emitter.off(type, cb)
				}
			}, [])
		}, [])

		return {
			emit,
			on,
		}
	}

	return {
		useMitt,
	}
}
