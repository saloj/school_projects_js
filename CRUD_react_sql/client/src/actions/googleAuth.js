import login from '../apis/login';
import { GET_GOOGLE_AUTH, GOOGLE_SIGN_IN, GOOGLE_SIGN_OUT } from './types';

export const getGoogleAuth = () => async (dispatch) => {
  const { REACT_APP_GOOGLE } = process.env;

  window.gapi.load('client: auth2', () => {
    window.gapi.client
      .init({
        clientId: `${REACT_APP_GOOGLE}`,
        scope: 'email'
      })
      .then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        dispatch({ type: GET_GOOGLE_AUTH, payload: authInstance });

        dispatch(changeAuth(authInstance.isSignedIn.get()));
        authInstance.isSignedIn.listen(() => dispatch(changeAuth));
      });
  });
};

const changeAuth = (isSignedIn) => async (dispatch, getState) => {
  if (isSignedIn) {
    const { googleAuthInstance } = getState().auth;
    const token = await googleAuthInstance.currentUser.get().getAuthResponse()
      .id_token;

    const googleUserId = await dispatch(verifyToken(token));

    dispatch({ type: GOOGLE_SIGN_IN, payload: googleUserId });
  } else {
    dispatch({ type: GOOGLE_SIGN_OUT });
  }
};

const verifyToken = (token) => async () => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  };

  const data = await login.post('/google', {}, config);

  return data.request.response;
};

export const trySignInGoogle = () => async (dispatch, getState) => {
  const { googleAuthInstance } = getState().auth;
  await googleAuthInstance.signIn();

  dispatch(changeAuth(googleAuthInstance.isSignedIn.get()));
};

export const trySignOutGoogle = () => async (dispatch, getState) => {
  const { googleAuthInstance } = getState().auth;
  await googleAuthInstance.signOut();

  dispatch(changeAuth(googleAuthInstance.isSignedIn.get()));
};
