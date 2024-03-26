import { Link } from 'react-router-dom'

export const Header = () => {
	return (
		<header className="bg-white px-4 py-2 flex items-center justify-between shadow-md">
			<div className="font-bold text-xl">logo</div>
			<div className="flex items-center">
				<Link className="mr-4" to={'/'}>
					首頁
				</Link>
				<Link to={'/news'}>最新消息</Link>
			</div>
		</header>
	)
}
