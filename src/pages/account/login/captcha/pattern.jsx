import { useVisible } from '@/hooks/use-visible'
import { ModalWrap } from '@/pages/account/login/captcha/modal-wrap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createMessage } from '@/lib/create-message'
import { useInitialRef } from '@jsl-react/hooks'
import { Spinner } from '@/components/spinner'

const SIZE = 3
const BOARD_SIZE = 360
const CUBE_SIZE = BOARD_SIZE / (SIZE - 1)
const SVG_DEVIATION = 8

const Lines = ({ list = [], strokeWidth = 1, name = '' }) => {
	return list.length ? (
		<svg
			className="absolute -left-2 -top-2"
			width={BOARD_SIZE + SVG_DEVIATION * 2}
			height={BOARD_SIZE + SVG_DEVIATION * 2}
		>
			{list.slice(0, list.length - 1).map(([x, y], i) => {
				const x1 = x * CUBE_SIZE
				const y1 = y * CUBE_SIZE
				const x2 = list[i + 1][0] * CUBE_SIZE
				const y2 = list[i + 1][1] * CUBE_SIZE
				return (
					<g key={`${name}-x${x}y${y}`}>
						<line
							x1={x1 + SVG_DEVIATION}
							y1={y1 + SVG_DEVIATION}
							x2={x2 + SVG_DEVIATION}
							y2={y2 + SVG_DEVIATION}
							style={{
								stroke: `white`,
								strokeWidth,
							}}
						/>
						<text
							x={x2 / 2 + x1 / 2 + SVG_DEVIATION / 2}
							y={y2 / 2 + y1 / 2 + SVG_DEVIATION + SVG_DEVIATION / 2}
							fill="white"
						>
							{i + 1}
						</text>
					</g>
				)
			})}
		</svg>
	) : null
}

export const PatternCaptcha = ({
	visible: propVisible,
	onChangeVisible,
	onLogin,
}) => {
	const lockDotsRef = useRef({})
	const [loading, setLoading] = useState(false)
	const [isDraw, setIsDraw] = useState(false)
	const [drawStyle, setDrawStyle] = useState({
		left: 0,
		top: 0,
		height: 8,
		transform: `rotate(0rad)`,
	})
	const [visible, setVisible] = useVisible(propVisible, onChangeVisible)
	const dots = useInitialRef(() => Array(SIZE).fill(Array(SIZE).fill(null)))
	const [questions, setQuestions] = useState([])
	const [answers, setAnswers] = useState([])

	// TODO 之後再新增 range 參數，雖然用ㄅ到嘻嘻
	const getValidLocals = useCallback(([x, y]) => {
		if (x > SIZE || y > SIZE) return []

		const validLocals = []
		// 左右
		if (x + 1 < SIZE) validLocals.push([x + 1, y])
		if (x - 1 > -1) validLocals.push([x - 1, y])

		// 上下
		if (y + 1 < SIZE) validLocals.push([x, y + 1])
		if (y - 1 > -1) validLocals.push([x, y - 1])

		// 斜
		const ty = y - 1
		const by = y + 1
		const lx = x - 1
		const rx = x + 1
		if (ty >= 0) {
			if (lx >= 0) validLocals.push([lx, ty])
			if (rx < SIZE) validLocals.push([rx, ty])
		}
		if (by < SIZE) {
			if (lx >= 0) validLocals.push([lx, by])
			if (rx < SIZE) validLocals.push([rx, by])
		}

		return validLocals
	}, [])

	const getLockKey = (x, y) => `x${x}y${y}`

	const init = useCallback(() => {
		const _questions = []
		let pos = [
			Math.floor(Math.random() * SIZE),
			Math.floor(Math.random() * SIZE),
		]
		while (true) {
			const validLocals = getValidLocals(pos)
			if (validLocals.length === 0) break

			const filterValidLocals = validLocals.filter(
				([vx, vy]) => !_questions.some(([qx, qy]) => qx === vx && qy === vy),
			)
			const next =
				filterValidLocals[Math.floor(Math.random() * filterValidLocals.length)]
			if (next == null) break

			_questions.push(next)
			pos = next
		}
		lockDotsRef.current = {}
		setAnswers([])
		setQuestions(_questions)
	}, [setAnswers, setQuestions])

	const onDrawStart = useCallback(
		(ev, pos) => {
			const left = ev.clientX
			const top = ev.clientY
			lockDotsRef.current[getLockKey(...pos)] = 1
			setIsDraw(true)
			setAnswers([pos])
			setDrawStyle({ left, top, height: 0, transform: `rotate(0rad)` })
		},
		[setIsDraw, setDrawStyle, setAnswers],
	)

	const onMouseEnterDot = useCallback(
		(ev, pos) => {
			if (isDraw) {
				const lockKey = getLockKey(...pos)
				if (lockDotsRef.current[lockKey] != null) return
				lockDotsRef.current[lockKey] = 1
				const { target } = ev
				const { x, y } = target.getBoundingClientRect()
				setAnswers(e => [...e, pos])
				setDrawStyle(e => ({ ...e, left: x + 10, top: y + 10 }))
			}
		},
		[isDraw, setAnswers],
	)

	const onDrawing = useCallback(
		({ clientX, clientY }) => {
			if (isDraw) {
				setDrawStyle(({ left, top }) => ({
					left,
					top,
					height: Math.sqrt(
						Math.pow(clientX - left, 2) + Math.pow(clientY - top, 2),
					),
					transform: `rotate(${-Math.atan2(clientX - left, clientY - top)}rad)`,
				}))
			}
		},
		[isDraw, setDrawStyle],
	)

	const onDrawEnd = useCallback(async () => {
		if (isDraw) {
			setIsDraw(false)
			const failed = questions.some(([qx, qy], i) => {
				if (answers[i] == null) return true

				const [ax, ay] = answers[i]
				return qx !== ax || ay !== qy
			})
			if (!failed) {
				setLoading(true)
				const res = await onLogin?.()
				setLoading(false)
				if (res && res.data.success) return
			} else {
				createMessage('驗證失敗，請照正確順序拖曳', 'danger')
			}
			init()
		}
	}, [isDraw, setIsDraw, questions, answers, onLogin])

	useEffect(() => {
		if (visible) {
			init()
		}
	}, [visible])

	useEffect(() => {
		window.addEventListener('mousemove', onDrawing)
		window.addEventListener('mouseup', onDrawEnd)
		return () => {
			window.removeEventListener('mousemove', onDrawing)
			window.removeEventListener('mouseup', onDrawEnd)
		}
	}, [onDrawing, onDrawEnd])

	return (
		<ModalWrap visible={visible} setVisible={setVisible}>
			{loading ? (
				<Spinner color={'#faad14'} size={64} />
			) : (
				<div className="relative text-center">
					<div style={{ width: BOARD_SIZE, height: BOARD_SIZE }}>
						{dots.current.map((_, x) =>
							dots.current[x].map((_, y) => (
								<div
									key={`x${x}y${y}`}
									className="w-5 h-5 absolute bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
									style={{
										left: x * CUBE_SIZE,
										top: y * CUBE_SIZE,
										zIndex: 1,
									}}
									onMouseDown={ev => onDrawStart(ev, [x, y])}
									onMouseEnter={ev => onMouseEnterDot(ev, [x, y])}
								/>
							)),
						)}
						<Lines name="questions" list={questions} strokeWidth={1} />
						<Lines name="answers" list={answers} strokeWidth={8} />
					</div>
					{isDraw ? (
						<div
							className="fixed w-2 bg-white"
							style={{
								left: drawStyle.left,
								top: drawStyle.top,
								height: drawStyle.height,
								transform: drawStyle.transform,
								transformOrigin: 'center top',
							}}
						/>
					) : null}
					<div className="text-white mt-12">請照順序滑動解鎖</div>
				</div>
			)}
		</ModalWrap>
	)
}
