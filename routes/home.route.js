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
			await res.status(401).send({
				"message": "Unauthorized access"
			})
		} else {
			await res.status(200).send({
	      "message": "Dodo lives here"
	    })
		}
  })

export default router
