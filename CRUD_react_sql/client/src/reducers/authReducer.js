import {
  GET_GOOGLE_AUTH,
  GOOGLE_SIGN_IN,
  GOOGLE_SIGN_OUT
} from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: null,
  googleAuthInstance: null,
  userId: null
};

export const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_GOOGLE_AUTH:
      return { ...state, googleAuthInstance: action.payload };
    case GOOGLE_SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload
      };
    case GOOGLE_SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
        userId: null
      };
    default:
      return state;
  }
};
