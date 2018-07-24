export const error = (res, message) => {
	return res.send({
		status: false,
		message: message
	})
}
