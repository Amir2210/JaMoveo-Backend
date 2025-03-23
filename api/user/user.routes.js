import express from 'express'
import { getUser, getUsers } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)

export const userRoutes = router
