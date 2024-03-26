export const Spinner = ({ color = '#000', size = 32 }) => {
	return (
		<div className="sp sp-wave" style={{ width: size, height: size }}>
			<i className="sp-wave__before" style={{ borderColor: color }} />
			<i className="sp-wave__after" style={{ borderColor: color }} />
		</div>
	)
}
