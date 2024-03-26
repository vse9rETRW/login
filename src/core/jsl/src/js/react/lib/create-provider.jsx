/// 提供者&供給者
/// v1 [broken] 移除inject傳入字串的使用方式
/// v0 

import { createContext, useContextSelector } from 'use-context-selector'

/**
 * @template T, S
 * @param {function(): S} providerService
 * @return {{inject: (function(callback: function(state: S): T): T), Provider: function({children: *}): *}}
 */
export const createProvider = providerService => {
	const context = createContext(null)
	const Provider = ({ children }) => (
		<context.Provider value={providerService()}>{children}</context.Provider>
	)
	const inject = (getter = () => undefined) =>
		useContextSelector(context, getter)

	return {
		Provider,
		inject,
	}
}
