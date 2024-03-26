import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocalStorageState } from '@jsl-react/hooks'
import { createProvider } from '@jsl-react/lib'
import { createEnum } from '@jsl'
import { useMitt } from '@/core/hooks/use-mitt'
import { AUTHORIZATION_FAILED } from '@/core/mitt-type'

export const EAuthCode = createEnum({
	validating: [0, '驗證中'],
	authSuccess: [1, '身分驗證成功'],
	authError: [2, '身分驗證失敗(喔天哪，你這個傢伙可真壞耶！)'],
	notLogin: [3, '尚未登入'],
	hasAuth: [4, '已取得身分資訊'],
})

export const { Provider: AuthProvider, inject: useAuth } =
	createProvider(service)

function service() {
	const history = useHistory()
	const [auth, setAuth] = useState(false) // Object | null
	const [token, setToken] = useLocalStorageState('login_token', null)
	const { on } = useMitt()

	const clearAuthState = useCallback(() => {
		setAuth(null)
		setToken(null)
	}, [])

	const logout = useCallback(() => {
		clearAuthState()
		history.replace('/login')
	}, [])

	on(AUTHORIZATION_FAILED, () => {
		logout()
	})

	return {
		auth,
		setAuth,
		token,
		setToken,
		clearAuthState,
		logout,
	}
}
