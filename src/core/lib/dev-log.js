window.$devLog = (...args) => {
	if (import.meta.env.MODE === 'development') {
		const log = console[args[0]]
		if (log) {
			log(...args.slice(1))
		} else {
			console.log(...args)
		}
	}
}
