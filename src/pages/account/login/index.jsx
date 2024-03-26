import { Wrap } from '@/pages/account/wrap'
import { Input } from '@/components/form/input'
import { Button } from '@/components/button'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from '@/components/form/lib/validator'
import { SliderCaptcha } from '@/pages/account/login/captcha/slider'
import { useHttp } from '@/core/hooks/http/use-http'
import { createMessage } from '@/lib/create-message'
import { useRef, useState } from 'react'
import { useAuth } from '@/core/hooks/use-auth'
import { EValidateMode } from '@/enums/validate-mode'
import { createClassName } from '@jsl'
import { useLocalStorageState } from '@jsl-react/hooks'
import { PatternCaptcha } from '@/pages/account/login/captcha/pattern'
import { ClickNumCaptcha } from '@/pages/account/login/captcha/click-num'

const ValidateItem = ({ className, mode, currentMode, onClick, children }) => {
	return (
		<div
			className={createClassName({
				'border border-1 border-gray-200 px-4 py-2 cursor-pointer': true,
				'bg-primary border-primary text-white': mode === currentMode,
				'hover:text-primary': mode !== currentMode,
				[className]: className != null,
			})}
			onClick={() => onClick(mode)}
		>
			{children}
		</div>
	)
}

export default () => {
	const history = useHistory()
	const { http } = useHttp()
	const setAuth = useAuth(e => e.setAuth)
	const setToken = useAuth(e => e.setToken)
	const [validateMode, setValidateMode] = useLocalStorageState(
		'login_validate-mode',
		EValidateMode.SLIDER,
	)
	const [authVisible, setAuthVisible] = useState(false)
	const cacheForm = useRef({})
	const form = useForm({
		username: '',
		password: '',
	})

	const login = async () => {
		const res = await http.post('/login', cacheForm.current)
		if (res.data.success) {
			setAuth(true)
			setToken(res.data.token)
			createMessage('登入成功')
			history.push('/')
		}
		return res
	}

	const onSubmit = async () => {
		const { data } = await form.submit()
		cacheForm.current = data
		setAuthVisible(true)
	}

	return (
		<Wrap title={'登入'}>
			<Input
				className="mb-4"
				ref={form.refs.username.ref}
				labelWidth={80}
				label={'帳號'}
				defaultValue={import.meta.env.VITE_USERNAME}
			/>
			<Input
				className="mb-4"
				ref={form.refs.password.ref}
				togglePassword
				labelWidth={80}
				label={'密碼'}
				defaultValue={import.meta.env.VITE_PASSWORD}
			/>
			<div className="flex items-center justify-center">
				<ValidateItem
					className="rounded-l-md"
					mode={EValidateMode.SLIDER}
					currentMode={validateMode}
					onClick={setValidateMode}
				>
					滑塊
				</ValidateItem>
				<ValidateItem
					className="border-l-0 border-r-0"
					mode={EValidateMode.CLICK_NUM}
					currentMode={validateMode}
					onClick={setValidateMode}
				>
					數字點擊
				</ValidateItem>
				<ValidateItem
					className="rounded-r-md"
					mode={EValidateMode.PATTERN}
					currentMode={validateMode}
					onClick={setValidateMode}
				>
					圖形
				</ValidateItem>
			</div>
			<div className="text-center mt-4">
				<div className="text-center mb-4">
					<Link className="text-primary text-sm" to={'/register'}>
						註冊
					</Link>
				</div>
				<Button onClick={onSubmit}>登入</Button>
			</div>
			{validateMode === EValidateMode.SLIDER ? (
				<SliderCaptcha
					visible={authVisible}
					onLogin={login}
					onChangeVisible={setAuthVisible}
				/>
			) : null}
			{validateMode === EValidateMode.PATTERN ? (
				<PatternCaptcha
					visible={authVisible}
					onLogin={login}
					onChangeVisible={setAuthVisible}
				/>
			) : null}
			{validateMode === EValidateMode.CLICK_NUM ? (
				<ClickNumCaptcha
					visible={authVisible}
					onLogin={login}
					onChangeVisible={setAuthVisible}
				/>
			) : null}
		</Wrap>
	)
}
