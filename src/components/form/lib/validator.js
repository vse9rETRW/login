import '../typedof'
import { useInitialRef } from '@jsl-react/hooks'
import { createRef, useMemo } from 'react'

/**
 * 提供的基本驗證規則
 * @param {Rule[]} rules
 * @param {*} value 傳入的驗證 value
 * @return {{message: string | null, success: boolean}} 驗證結果及訊息
 */
export const commonValidatorRule = async (rules = [], value) => {
	for (let i = 0; i < rules.length; i++) {
		const { type, required, min, max, message, validator } = rules[i]
		if (required === true) {
			if (typeof value === 'string') {
				if (value === '') {
					return {
						success: false,
						message: message || '必填',
					}
				}
			} else {
				if (value == null) {
					return {
						success: false,
						message: message || '必填',
					}
				}
			}
		}
		if (min != null) {
			if (typeof value === 'string' || Array.isArray(value)) {
				if (value.length < min) {
					return {
						success: false,
						message: message || `長度必須大於${min}`,
					}
				}
			} else if (typeof value === 'number') {
				if (value < min) {
					return {
						success: false,
						message: message || `長度必須大於${min}`,
					}
				}
			}
		}
		if (max != null) {
			if (typeof value === 'string' || Array.isArray(value)) {
				if (value.length > max) {
					return {
						success: false,
						message: message || `長度必須小於${max}`,
					}
				}
			} else if (typeof value === 'number') {
				if (value > max) {
					return {
						success: false,
						message: message || `長度必須小於${max}`,
					}
				}
			}
		}
		if (type === 'email') {
			if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)) {
				return {
					success: false,
					message: message || `必須是email格式`,
				}
			}
		}
		if (validator != null) {
			const result = await validator(value)
			let validateResultMessage, success
			if (typeof result === 'boolean') {
				success = result
			} else if (typeof result === 'object') {
				validateResultMessage = result.message
				success = result.success
			}
			if (!success) {
				return {
					success: false,
					message: validateResultMessage || message || `驗證失敗`,
				}
			}
		}
	}
	return { message: null, success: true }
}

/**
 * 表單驗證糖鉤子
 * @param {Object.<string, *>} obj
 * @return {{submit: function(): Promise<{data: Object.<string, *>, pass: boolean}>, refs: Object<string, { ref: React.MutableRefObject<*>, defaultValue: * }>}}
 */
export const useForm = obj => {
	const refs = useInitialRef(() =>
		Object.keys(obj).reduce(
			(p, k) => ({
				...p,
				[k]: {
					ref: createRef(),
					defaultValue: obj[k],
				},
			}),
			{},
		),
	)

	const submit = async () => {
		const keys = Object.keys(refs.current)
		const state = keys.reduce(
			(p, k) => ((p[k] = refs.current[k].ref.current.value), p),
			{},
		)
		const validates = keys.map(k => refs.current[k].ref.current.validate?.())
		const result = await Promise.all(validates)
		return {
			pass: !result.some(e => !e.success),
			data: state,
		}
	}

	return {
		refs: refs.current,
		submit,
	}
}
