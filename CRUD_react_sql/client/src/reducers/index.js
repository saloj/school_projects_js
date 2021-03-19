import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';

import { postReducer } from './postReducer';
import { authReducer } from './authReducer';
import { commentReducer } from './commentReducer';

export default combineReducers({
  posts: postReducer,
  auth: authReducer,
  comments: commentReducer,
  form: formReducer
});
