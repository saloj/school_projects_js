import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';

const Header = (props) => {
  const renderCreate = () => {
    if (props.isSignedIn) {
      return (
        <Link to="/posts/new" className="ui button primary">
          Create Post
        </Link>
      );
    }
  };

  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        babbel
      </Link>
      <div className="right menu">
        {renderCreate()}
        <GoogleAuth />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(mapStateToProps)(Header);
