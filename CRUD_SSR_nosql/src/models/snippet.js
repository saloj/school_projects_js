import mongoose from 'mongoose'

// mongoose model Snippet
const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [1, 'is shorter than the minimum length of 1.'],
    required: true
  },
  content: {
    type: String,
    minlength: [1, 'is shorter than the minimum length of 1.'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    required: true
  }
})

snippetSchema.set('toJSON', {
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
  }
})

export const Snippet = mongoose.model('Snippet', snippetSchema)
