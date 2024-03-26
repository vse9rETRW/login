import { createElement, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import { createClassName } from '@jsl'

const Message = ({ type, message, direction, el }) => {
	const isRemoveRef = useRef(false)

	const onDestroy = () => {
		if (!isRemoveRef.current) {
			el.remove()
			isRemoveRef.current = true
		}
	}

	useEffect(() => {
		if (direction > 0) {
			setTimeout(onDestroy, direction)
		}
	}, [])

	return (
		<>
			<div
				className={createClassName({
					'bg-success text-white rounded-full text-xs px-2 py-1 mr-2': true,
					'bg-danger': type === 'danger',
				})}
			>
				{type}
			</div>
			<div className="text-sm mr-2">{message}</div>
			<div className="text-xs cursor-pointer ml-auto" onClick={onDestroy}>
				Close
			</div>
		</>
	)
}

/**
 * @param {'success' | 'danger'} type
 * @param {string} message
 * @param {number} direction 0 為永久
 */
export const createMessage = (
	message = '',
	type = 'success',
	direction = 3000,
) => {
	const container = document.getElementById('message-container')
	const el = document.createElement('div')
	el.className =
		'bg-white color-black mt-4 rounded-full p-2 flex items-center w-full shadow-lg animate-fade-side-in-quick'
	const msg = createElement(Message, { message, type, direction, el })
	render(msg, el)
	container.append(el)
}
