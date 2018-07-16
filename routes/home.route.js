import express from 'express'
const router = express.Router()

/**
 * This function comment is parsed by doctrine
 * @route GET /
 * @group foo - Operations about user
 * @returns {object} 200 - A default message
 * @returns {Error}  default - Unexpected error
 */
router.route('/')
	.get(async (req, res) => {
    await res.send(200, {
      "message": "Dodo lives here"
    })
  })

export default router
