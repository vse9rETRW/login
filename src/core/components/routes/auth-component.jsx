import { Redirect } from 'react-router-dom'
import { useValidateAuth } from '@/core/hooks/use-validate-auth'
import { EAuthCode } from '@/core/hooks/use-auth'
import { PageContent } from '@/components/page-content'

export const AuthComponent = ({ component: RouteComponent }) => {
	const code = useValidateAuth()

	return code === EAuthCode.validating ? (
		<PageContent className="flex items-center">
			取得使用者資料(身分驗證中)...
		</PageContent>
	) : code === EAuthCode.authError || code === EAuthCode.notLogin ? (
		<Redirect to={'/login'} />
	) : (
		<RouteComponent />
	)
}
