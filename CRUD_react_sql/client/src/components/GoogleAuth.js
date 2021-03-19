import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getGoogleAuth,
  trySignInGoogle,
  trySignOutGoogle
} from '../actions/googleAuth';

const GoogleAuth = (props) => {
  useEffect(() => {
    props.getGoogleAuth();
  }, []);

  const renderAuthButton = () => {
    if (props.isSignedIn === null) {
      return (
        <button className="ui loading google button">
          <i className="google icon" />
          Loading...
        </button>
      );
    } else if (props.isSignedIn) {
      return (
        <button
          className="ui red google button"
          onClick={() => props.trySignOutGoogle()}
        >
          <i className="google icon" />
          Sign out
        </button>
      );
    } else {
      return (
        <button
          onClick={() => props.trySignInGoogle()}
          className="ui green google button"
        >
          <i className="google icon" />
          Sign in with Google
        </button>
      );
    }
  };

  return <div>{renderAuthButton()}</div>;
};

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, {
  getGoogleAuth,
  trySignInGoogle,
  trySignOutGoogle
})(GoogleAuth);
