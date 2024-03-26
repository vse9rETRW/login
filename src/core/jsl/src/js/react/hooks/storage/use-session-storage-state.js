/// 自動存到 sessionStorage 的 useState
/// v2 改成export const
/// v1 useState改成useSafeState
/// v0 

import { Dispatch } from 'react'
import { getStorageItem, useUpdateStorage } from './util'
import { useSafeState } from '../use-safe-state'

/**
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, Dispatch<T>]}
 */
export const useSessionStorageState = (key, initialValue) => {
	const [state, setState] = useSafeState(
		getStorageItem(key, initialValue, sessionStorage),
	)
	useUpdateStorage(key, state, sessionStorage)
	return [state, setState]
}
