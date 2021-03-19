/**
 * Snippets routes.
 */

import express from 'express'
import { SnippetsController } from '../controllers/snippets-controller.js'

export const router = express.Router()

const controller = new SnippetsController()

router.get('/', controller.index)
router.get('/new', controller.new)
router.get('/:id', controller.show)
router.post('/create', controller.create)

router.get('/:id/edit', controller.edit)
router.post('/:id/update', controller.update)

router.get('/:id/remove', controller.remove)
router.post('/:id/delete', controller.delete)
