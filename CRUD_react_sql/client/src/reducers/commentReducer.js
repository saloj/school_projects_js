import _ from 'lodash';
import { FETCH_ALL_COMMENTS, CREATE_COMMENT } from '../actions/types';

export const commentReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALL_COMMENTS:
      return { ...state, ..._.mapKeys(action.payload, 'id') };
    case CREATE_COMMENT:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
