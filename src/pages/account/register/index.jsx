import { Wrap } from '@/pages/account/wrap'
import { Input } from '@/components/form/input'
import { useMemo, useState } from 'react'
import { useForm } from '@/components/form/lib/validator'
import { Button } from '@/components/button'
import { Link, useHistory } from 'react-router-dom'
import { useHttp } from '@/core/hooks/http/use-http'
import { createMessage } from '@/lib/create-message'

export default () => {
	const history = useHistory()
	const { http } = useHttp()
	const form = useForm({
		username: '',
		password: '',
		password2: '',
	})
	const [loading, setLoading] = useState(false)
	const commonPasswordRules = useMemo(
		() => [
			{ require: true, min: 4, max: 8 },
			{
				validator(v) {
					return /^[A-z]\d+[A-z]$/.test(v)
				},
				message: '密碼格式錯誤',
			},
		],
		[],
	)
	const onSubmit = async () => {
		setLoading(true)
		const { pass, data } = await form.submit()
		if (!pass) {
			setLoading(false)
			return
		}
		const res = await http.post('/register', data)
		setLoading(false)
		if (res.data.success) {
			createMessage('註冊成功')
			history.push('/login')
		}
	}

	return (
		<Wrap title={'註冊'}>
			<Input
				className="mb-4"
				ref={form.refs.username.ref}
				labelWidth={80}
				label={'帳號'}
				placeholder={'必須是信箱'}
				rules={[{ required: true }, { type: 'email' }]}
			/>
			<Input
				className="mb-4"
				ref={form.refs.password.ref}
				togglePassword
				labelWidth={80}
				label={'密碼'}
				placeholder={'4-8字元；首尾必須是英文；中間必須是數字'}
				rules={[...commonPasswordRules]}
			/>
			<Input
				ref={form.refs.password2.ref}
				togglePassword
				labelWidth={80}
				label={'確認密碼'}
				placeholder={'4-8字元；首尾必須是英文；中間必須是數字'}
				rules={[
					...commonPasswordRules,
					{
						validator(v) {
							return v === form.refs.password.ref.current?.value
						},
						message: '必須與密碼相同',
					},
				]}
			/>
			<div className="text-center mt-4">
				<div className="text-center mb-4">
					<Link className="text-primary text-sm" to={'/login'}>
						返回登入
					</Link>
				</div>
				<Button loading={loading} onClick={onSubmit}>
					註冊
				</Button>
			</div>
		</Wrap>
	)
}
