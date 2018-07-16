const ignoreFavicon = (req, res, next) => {
	if(req.originalUrl === '/favicon.ico') {
		res.status(204).json({nope: true})
	} else {
		return next()
	}
}

const ignoreRobots = (req, res, next) => {
	if(req.url === '/robots.txt') {
		res.type('text/plain')
		res.send('User-agent: *\nDisallow: /')
	} else {
		return next()
	}
}

export default {
	ignoreFavicon,
	ignoreRobots
}
