// all routes for the application
import express from 'express'
import createError from 'http-errors'
import { router as snippetsRouter } from './snippets-router.js'
import { router as usersRouter } from './users-router.js'

export const router = express.Router()

router.use('/', snippetsRouter)
router.use('/users', usersRouter)

// catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
