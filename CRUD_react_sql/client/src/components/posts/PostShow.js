import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchPost } from '../../actions';
import { Link } from 'react-router-dom';
import CommentList from '../comments/CommentList';
import CommentCreate from '../comments/CommentCreate';

const PostShow = (props) => {
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

  const { title, content } = props.post;

  let formattedContent = content.split('\n').map((i) => {
    return <p key={`${props.post.id++ + props.post.user_id}`}>{i}</p>;
  });

  const renderAdmin = () => {
    if (props.isSignedIn && props.post.user_id === props.currentUserId) {
      return (
        <div style={{ textAlign: 'right' }}>
          <Link
            to={`/posts/edit/${props.match.params.id}`}
            className="ui button primary"
          >
            Edit Post
          </Link>
          <Link
            to={`/posts/delete/${props.match.params.id}`}
            className="ui button negative"
          >
            Delete Post
          </Link>
        </div>
      );
    }
  };

  return (
    <div style={{ textAlign: 'center', wordWrap: 'break-word' }}>
      <h1>{title}</h1>
      <p>
        <i>By {props.post.email}</i>
        <br />
        Total posts: {props.post.postCount}
      </p>
      <div style={{ marginTop: '4em' }}>{formattedContent}</div>
      <CommentList postId={props.match.params.id} />
      <CommentCreate postId={props.match.params.id} />
      {renderAdmin()}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    post: state.posts[ownProps.match.params.id],
    isSignedIn: state.auth.isSignedIn,
    currentUserId: state.auth.userId
  };
};

export default connect(mapStateToProps, { fetchPost })(PostShow);
