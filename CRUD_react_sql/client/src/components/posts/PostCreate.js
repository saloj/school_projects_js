import React from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../actions';
import PostForm from './PostForm';

const PostCreate = (props) => {
  const onSubmit = (formValues) => {
    props.createPost(formValues);
  };

  return (
    <div>
      <h1>Create Post</h1>
      <PostForm onSubmit={onSubmit} />
    </div>
  );
};

export default connect(null, { createPost })(PostCreate);
