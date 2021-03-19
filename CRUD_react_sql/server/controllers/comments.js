const commentsRouter = require('express').Router();
const db = require('../db');

// GET: By post id
commentsRouter.get('/:id', async (request, response) => {
  let comments = [];
  comments = await findCommentById(request.params.id);

  response.json(comments);
});

// POST
commentsRouter.post('/', async (request, response) => {
  const { content, userId, postId } = request.body;

  if (!userId) {
    return response.status(401).json({ error: 'invalid user error' });
  }

  const comment = {
    user_id: userId,
    post_id: postId,
    content,
    created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  const savedCommentId = await insertComment(comment);
  const storedComment = await findCommentById(savedCommentId);

  response.json(storedComment);
});

// DELETE
commentsRouter.delete('/:id', async (request, response) => {
  const comment = await findCommentById(request.params.id);

  if (!comment) {
    response.status(404).end();
  } else {
    await deleteComment(request.params.id);
  }

  response.status(204).end();
});

const findAllComments = () => {
  return new Promise((resolve, reject) => {
    let findComments_sql = 'SELECT * FROM comments';

    db.conn.query(findComments_sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const findCommentById = (id) => {
  return new Promise((resolve, reject) => {
    let findCommentById_sql = 'SELECT * FROM comment_view WHERE post_id = ?';

    db.conn.query(findCommentById_sql, id, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const insertComment = (comment) => {
  return new Promise((resolve, reject) => {
    let saveComment_sql = 'INSERT INTO comments SET ?';

    db.conn.query(saveComment_sql, comment, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result.insertId);
      }
    });
  });
};

const deleteComment = (id) => {
  return new Promise((resolve, reject) => {
    let deleteComment_sql = 'DELETE FROM comments WHERE id = ?';

    db.conn.query(deleteComment_sql, id, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result[0]);
      }
    });
  });
};

module.exports = commentsRouter;
