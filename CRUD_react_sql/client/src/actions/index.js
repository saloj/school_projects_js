import posts from '../apis/posts';
import comments from '../apis/comments';
import createBrowserHistory from '../history';
import {
  CREATE_POST,
  DELETE_POST,
  FETCH_ALL_POSTS,
  FETCH_POST,
  EDIT_POST,
  FETCH_ALL_COMMENTS,
  CREATE_COMMENT
} from './types';

export const fetchAllComments = (postId) => async (dispatch) => {
  const response = await comments.get(`/${postId}`);

  dispatch({ type: FETCH_ALL_COMMENTS, payload: response.data });
};

export const createComment = (formValues, postId) => async (
  dispatch,
  getState
) => {
  const { userId } = getState().auth;

  const response = await comments.post('/', { ...formValues, userId, postId });

  dispatch({ type: CREATE_COMMENT, payload: response.data });
  createBrowserHistory.go();
};

export const fetchAllPosts = () => async (dispatch) => {
  const response = await posts.get('/');

  dispatch({ type: FETCH_ALL_POSTS, payload: response.data });
};

export const fetchPost = (id) => async (dispatch) => {
  const response = await posts.get(`/${id}`);

  dispatch({ type: FETCH_POST, payload: response.data });
};

export const createPost = (formValues) => async (dispatch, getState) => {
  const { userId } = getState().auth;

  // in case the user logs out at "create post"
  if (!userId) {
    createBrowserHistory.push('/');
    return;
  }

  const response = await posts.post('/', { ...formValues, userId });

  dispatch({ type: CREATE_POST, payload: response.data });
  createBrowserHistory.push('/');
};

export const editPost = (id, formValues) => async (dispatch) => {
  const response = await posts.patch(`/${id}`, formValues);

  dispatch({ type: EDIT_POST, payload: response.data });
  createBrowserHistory.push('/');
};

export const deletePost = (id) => async (dispatch) => {
  await posts.delete(`/${id}`);

  dispatch({ type: DELETE_POST, payload: id });
  createBrowserHistory.push('/');
};
