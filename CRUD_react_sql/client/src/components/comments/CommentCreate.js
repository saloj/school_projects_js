import React from 'react';
import { connect } from 'react-redux';
import { createComment } from '../../actions';
import CommentForm from './CommentForm';

const CommentCreate = (props) => {
  const onSubmit = (formValues) => {
    props.createComment(formValues, props.postId);
  };

  const renderAdmin = () => {
    console.log(props);
    if (props.isSignedIn) {
      return <CommentForm onSubmit={onSubmit} />;
    } else {
      return <div></div>;
    }
  };

  return <div>{renderAdmin()}</div>;
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn
  };
};

export default connect(mapStateToProps, { createComment })(CommentCreate);
