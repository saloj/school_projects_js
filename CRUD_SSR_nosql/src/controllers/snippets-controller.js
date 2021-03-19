/**
 * Module for the SnippetsController.
 */

import { Snippet } from '../models/snippet.js'
import { User } from '../models/user.js'

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Returns a list of all the snippets currently in the DB.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async index (req, res, next) {
    try {
      // fetch all snippets and present the desired data, sorted by date of creation
      const viewData = {
        snippets: (await Snippet.find({}))
          .sort((a, b) => b.date - a.date)
          .map(snippet => ({
            id: snippet._id,
            title: snippet.title,
            content: snippet.content,
            date: snippet.date.toISOString().slice(0, 19).replace('T', ' '),
            author: snippet.author
          })),
        user: req.session.user,
        signedIn: req.session.signedIn
      }

      res.render('snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML file for displaying a snippet.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async show (req, res, next) {
    try {
      const { user, signedIn } = req.session
      const snippet = (await Snippet.findById(req.params.id)).toJSON()

      const viewData = {
        // cast to JSON object instead of mongoose object in order allow hbs prototype access
        snippet,
        user,
        signedIn,
        preAuth: snippet.author === user // surface check to help determine which buttons to display in the view
      }

      res.render('snippets/showsnippet', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for editing a snippet.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async edit (req, res, next) {
    try {
      const viewData = {
        // cast to JSON object instead of mongoose object in order allow hbs prototype access
        snippet: (await Snippet.findById(req.params.id)).toJSON(),
        user: req.session.user,
        signedIn: req.session.signedIn
      }

      // user should receive a 404 if not signed in
      await User.isSignedIn(viewData.user, viewData.signedIn)

      // only the author of the snippet is authorized to edit it
      await User.authorize(viewData.user, viewData.snippet)

      res.render('snippets/editsnippet', { viewData })
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        next(error)
      } else {
        req.session.flash = { type: 'negative', text: error.message }
        res.redirect('.')
      }
    }
  }

  /**
   * Updates a selected snippet if authorized.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - next middleware.
   */
  async update (req, res, next) {
    try {
      const { title, content } = req.body
      const { user, signedIn } = req.session

      // user should receive a 404 if not signed in
      await User.isSignedIn(user, signedIn)

      // only the author of the snippet is authorized to update it
      const snippet = await Snippet.findById(req.params.id)
      await User.authorize(user, snippet)

      const updatedSnippet = await Snippet.updateOne({ _id: req.params.id }, {
        title,
        content
      })

      if (updatedSnippet.nModified === 1) {
        req.session.flash = { type: 'success', text: 'Snippet updated successfully!' }
      } else {
        req.session.flash = { type: 'negative', text: 'No changes made to the snippet. Please try again.' }
      }

      res.redirect('.')
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        next(error)
      } else {
        req.session.flash = { type: 'negative', text: error.message }
        res.redirect('./')
      }
    }
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - next middleware.
   */
  async new (req, res, next) {
    try {
      const viewData = {
        user: req.session.user,
        signedIn: req.session.signedIn
      }

      // user should receive a 404 if not signed in
      await User.isSignedIn(viewData.user, viewData.signedIn)

      res.render('snippets/newsnippet', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new snippet if authenticated.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async create (req, res, next) {
    const { title, content } = req.body
    const { user, signedIn } = req.session

    // user should receive a 404 if not signed in
    await User.isSignedIn(user, signedIn)

    try {
      const snippet = new Snippet({
        title,
        content,
        date: new Date(),
        author: user
      })

      await snippet.save()

      req.session.flash = { type: 'success', text: 'New snippet created!' }
      res.redirect('./')
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        next(error)
      } else {
        req.session.flash = { type: 'negative', text: error.message }
        res.redirect('./new')
      }
    }
  }

  /**
   * Returns a HTML form for removing a snippet.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async remove (req, res, next) {
    try {
      const { user, signedIn } = req.session

      const viewData = {
        // cast to JSON object instead of mongoose object in order allow hbs prototype access
        snippet: (await Snippet.findById(req.params.id)).toJSON(),
        user,
        signedIn
      }

      // user should receive a 404 if not signed in
      await User.isSignedIn(user, signedIn)

      // only the author of the snippet is authorized to remove it
      await User.authorize(viewData.user, viewData.snippet)

      res.render('snippets/removesnippet', { viewData })
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        next(error)
      } else {
        req.session.flash = { type: 'negative', text: error.message }
        res.redirect('.')
      }
    }
  }

  /**
   * Deletes a selected snippet if authorized.
   *
   * @param {object} req - request object.
   * @param {object} res - response object.
   * @param {Function} next - next middleware.
   */
  async delete (req, res, next) {
    try {
      const { user, signedIn } = req.session

      // user should receive a 404 if not signed in
      await User.isSignedIn(user, signedIn)

      // only the author of the snippet is authorized to delete it
      const snippet = await Snippet.findById(req.params.id)
      await User.authorize(user, snippet)

      await Snippet.deleteOne({ _id: req.params.id })
      req.session.flash = { type: 'success', text: 'Snippet was deleted successfully!' }

      res.redirect(process.env.BASE_URL)
    } catch (error) {
      if (error.status === 404 || error.status === 403) {
        next(error)
      } else {
        req.session.flash = { type: 'negative', text: error.message }
        res.redirect(process.env.BASE_URL)
      }
    }
  }
}
