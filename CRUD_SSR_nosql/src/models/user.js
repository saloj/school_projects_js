import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

// mongoose model User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true, // ensures that we don't store duplicate users based on casing (from mongoose-unique-validator)
    required: true,
    minlength: [3, 'is shorter than the minimum length of 3.'],
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'is shorter than the minimum length of 10.']
  },
  date: {
    type: Date,
    required: true
  }
})

userSchema.plugin(uniqueValidator, { message: 'already exists.' })

// salt and hash the password before saving to DB
userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS))
})

/**
 * Authenticates the User. Compares given username and password to what's stored in the DB, hashed.
 *
 * @param {string} username - given username.
 * @param {string} password - given password.
 * @returns {boolean} - User if match found.
 */
userSchema.statics.authenticate = async function (username, password) {
  // regex in order to search case insensitive
  const user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') })

  const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    throw new Error('Invalid username or password.')
  }

  return user
}

/**
 * Authorizes the User. Compares given credentials to that of the snippet.
 *
 * @param {string} username - given username.
 * @param {Snippet} snippet - snippet to check authorization against.
 * @returns {boolean} - User if match found.
 */
userSchema.statics.authorize = async function (username, snippet) {
  if (!(username === snippet.author)) {
    const err = new Error('You are not authorized for this action.')
    err.status = 403
    throw err
  }

  return true
}

/**
 * Verifies that the user is signed in.
 *
 * @param {string} user - given username.
 * @param {boolean} signedIn - if currently signed in or not.
 * @returns {boolean} - if signed in.
 */
userSchema.statics.isSignedIn = async function (user, signedIn) {
  // user should receive a 404 if not signed in
  if (!(user && signedIn)) {
    const err = new Error()
    err.status = 404
    throw err
  }

  return true
}

userSchema.set('toJSON', {
  /**
   * Transforms the document properties from un-parsable to String if returned as JSON.
   * Changes the key "_id" to simply "id" when fetched.
   *
   * @param {object} document - document from DB.
   * @param {object} returnedObject - object returned as JSON.
   */
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    // don't reveal password hash
    delete returnedObject.password
  }
})

export const User = mongoose.model('User', userSchema)
