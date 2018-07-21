import express from 'express'
const router = express.Router()

/**
 * This function comment is parsed by doctrine
 * @route GET /
 * @group foo - Operations about user
 * @returns {string} A default message
 * @security JWT
 */
router.route('/')
	.get(async (req, res) => {
		if(!res.id) {
			await res.send({
				'message': 'Unauthorized access',
				status: false
			})
		} else {
			await res.send({
				message: 'Dodo lives here',
				status: true
			})
		}
	})

export default router
