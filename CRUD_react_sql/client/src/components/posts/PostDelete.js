import React, { useEffect } from 'react';
import Modal from '../Modal';
import { connect } from 'react-redux';
import { fetchPost, deletePost } from '../../actions';
import createBrowserHistory from '../../history';

const PostDelete = (props) => {
  useEffect(() => {
    props.fetchPost(props.match.params.id);
  }, []);

  const onDelete = () => {
    props.deletePost(props.match.params.id);
  };

  const actions = (
    <>
      <button onClick={onDelete} className="ui button negative">
        Delete
      </button>
      <button
        onClick={() => createBrowserHistory.goBack()}
        className="ui button"
      >
        Cancel
      </button>
    </>
  );

  const renderContent = () => {
    if (!props.post) {
      return 'Are you sure you want to delete this post?';
    }

    return `Are you sure you want to delete the post with title: "${props.post.title}"`;
  };

  return (
    <Modal
      title="Delete Post"
      content={renderContent()}
      actions={actions}
      onDismiss={() => createBrowserHistory.goBack()}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    post: state.posts[ownProps.match.params.id]
  };
};

export default connect(mapStateToProps, { fetchPost, deletePost })(PostDelete);
