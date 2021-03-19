const postsRouter = require('express').Router();
const db = require('../db');

// GET: All posts
postsRouter.get('/', async (request, response) => {
  let posts = [];
  posts = await findAllPosts();

  response.json(posts);
});

// GET: By id
postsRouter.get('/:id', async (request, response) => {
  let post = await findPostById(request.params.id);
  let count = await numberOfPostsByUser(post.user_id);
  let postToReturn = { ...post, ...count };

  if (post) {
    response.json(postToReturn);
  } else {
    response.status(404).end();
  }
});

// POST
postsRouter.post('/', async (request, response) => {
  const { title, content, userId } = request.body;

  if (!userId) {
    return response.status(401).json({ error: 'invalid user error' });
  }

  const post = {
    user_id: userId,
    title,
    content,
    created_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  const savedPostId = await insertPost(post);
  const storedPost = await findPostById(savedPostId);

  response.json(storedPost);
});

// PATCH
postsRouter.patch('/:id', async (request, response) => {
  const { title, content } = request.body;

  const updatedPost = await updatePost(title, content, request.params.id);

  response.json(updatedPost);
});

// DELETE
postsRouter.delete('/:id', async (request, response) => {
  const post = await findPostById(request.params.id);

  if (!post) {
    response.status(404).end();
  } else {
    await deletePost(request.params.id);
  }

  response.status(204).end();
});

const findAllPosts = () => {
  return new Promise((resolve, reject) => {
    let findPosts_sql = 'SELECT * FROM post_view';

    db.conn.query(findPosts_sql, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const findPostById = (id) => {
  return new Promise((resolve, reject) => {
    let findPostById_sql = 'SELECT * FROM post_view WHERE id = ?';

    db.conn.query(findPostById_sql, id, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
    });
  });
};

const numberOfPostsByUser = (id) => {
  return new Promise((resolve, reject) => {
    let findCount_sql =
      'SELECT DISTINCT COUNT(id) AS postCount FROM post_view WHERE user_id = ?';

    db.conn.query(findCount_sql, id, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
    });
  });
};

const insertPost = (post) => {
  return new Promise((resolve, reject) => {
    let savePost_sql = 'INSERT INTO posts SET ?';

    db.conn.query(savePost_sql, post, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result.insertId);
      }
    });
  });
};

const updatePost = (title, content, id) => {
  return new Promise((resolve, reject) => {
    let savePost_sql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';

    db.conn.query(savePost_sql, [title, content, id], (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result[0]);
      }
    });
  });
};

const deletePost = (id) => {
  return new Promise((resolve, reject) => {
    let deletePost_sql = 'DELETE FROM posts WHERE id = ?';

    db.conn.query(deletePost_sql, id, (err, result) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(result[0]);
      }
    });
  });
};

module.exports = postsRouter;
