/// 更新頁籤 title
/// v1 新增 jsdoc
/// v0 

import { useEffect, useRef } from 'react'

/**
 * @template T
 * @param {string} title 標題
 * @param [restoreOnUnmount=false] 是否回朔上一個標題
 * @returns [T, function(T | function(T): T): void]
 */
export const useTitle = (title, restoreOnUnmount = false) => {
	const prevTitleRef = useRef(document.title)
	document.title = title
	useEffect(() => {
		if (restoreOnUnmount) {
			return () => {
				document.title = prevTitleRef.current
			}
		}
	}, [])
}
