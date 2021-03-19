import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchPost, editPost } from '../../actions';
import PostForm from './PostForm';

const PostEdit = (props) => {
  useEffect(() => {
    props.fetchPost(props.match.params.id);
  }, []);

  if (!props.post) {
    return (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">Loading...</div>
      </div>
    );
  }

  const onSubmit = (formValues) => {
    props.editPost(props.match.params.id, formValues);
  };

  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm
        initialValues={_.pick(props.post, 'title', 'content')}
        onSubmit={onSubmit}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    post: state.posts[ownProps.match.params.id]
  };
};

export default connect(mapStateToProps, { fetchPost, editPost })(PostEdit);
