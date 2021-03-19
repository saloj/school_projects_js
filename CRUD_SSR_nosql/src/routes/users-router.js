/**
 * User routes.
 */

import express from 'express'
import { UsersController } from '../controllers/users-controller.js'

export const router = express.Router()

const controller = new UsersController()

router.get('/login', controller.login)
router.post('/auth', controller.authenticate)

router.post('/logout', controller.logout)

router.get('/new', controller.new)
router.post('/register', controller.register)
