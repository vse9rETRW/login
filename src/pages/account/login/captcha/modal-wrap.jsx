import ReactDOM from 'react-dom'

export const ModalWrap = ({ visible, setVisible, children }) => {
	return visible
		? ReactDOM.createPortal(
				<div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center select-none">
					<div
						className="bg-black opacity-70 fixed left-0 top-0 w-full h-full"
						onClick={() => setVisible(false)}
					/>
					{children}
				</div>,
				document.getElementById('modal-root'),
		  )
		: null
}
