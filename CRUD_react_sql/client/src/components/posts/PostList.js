import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAllPosts } from '../../actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const wordLimit = 120;

const PostList = (props) => {
  useEffect(() => {
    props.fetchAllPosts();
  }, []);

  const renderDelete = (post) => {
    if (post.user_id === props.currentUserId) {
      return (
        <Link to={`/posts/delete/${post.id}`} style={{ marginLeft: '1em' }}>
          <i className="right floated red trash alternate outline icon"></i>
        </Link>
      );
    }
  };

  const renderPosts = () => {
    return props.posts.map((post) => {
      if (post.id === props.mostRecentPost.id) {
        return;
      } else {
        return (
          <div key={post.id} className="ui card">
            <div className="content" style={{ textAlign: 'center' }}>
              {renderDelete(post)}
              <Link
                to={`/posts/${post.id}`}
                style={{ fontSize: '1.3em', color: 'black' }}
              >
                {post.title}
              </Link>
              <div
                className="description"
                style={{ marginTop: '1em', wordWrap: 'break-word' }}
              >
                {post.content.length <= wordLimit
                  ? post.content
                  : post.content.substring(0, wordLimit) + '...'}
              </div>
            </div>
          </div>
        );
      }
    });
  };

  const renderMostRecentPost = () => {
    if (!props.mostRecentPost) {
      return;
    }
    return (
      <div className="ui fluid card">
        <div className="content" style={{ textAlign: 'center' }}>
          {renderDelete(props.mostRecentPost)}
          <Link
            to={`/posts/${props.mostRecentPost.id}`}
            style={{ fontSize: '1.5em', color: 'black' }}
            className=""
          >
            {props.mostRecentPost.title}
          </Link>
          <div
            className="description"
            style={{ marginTop: '1em', wordWrap: 'break-word' }}
          >
            {props.mostRecentPost.content.length <= wordLimit
              ? props.mostRecentPost.content
              : props.mostRecentPost.content.substring(0, wordLimit) + '...'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Bulletin Board</h2>
      {renderMostRecentPost()}
      <div className="ui three stackable cards" style={{ marginTop: '1em' }}>
        {renderPosts()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  let postArray = Object.values(state.posts);

  return {
    posts: [...postArray],
    mostRecentPost: _.chain(postArray).sortBy('date').last().value(),
    currentUserId: state.auth.userId
  };
};

export default connect(mapStateToProps, { fetchAllPosts })(PostList);
