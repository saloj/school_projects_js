import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchAllComments } from '../../actions';
import _ from 'lodash';

const CommentList = (props) => {
  useEffect(() => {
    props.fetchAllComments(props.postId);
  }, []);

  const renderComments = () => {
    if (!props.comments) {
      return;
    }
    return props.comments.map((comment) => {
      if (comment.post_id == props.postId) {
        return (
          <div key={comment.id} className="comment">
            <div className="content" style={{ textAlign: 'left' }}>
              <a className="author">{comment.email}</a>
              <div className="metadata">
                <div className="date">
                  {comment.created_date.slice(0, 19).replace('T', ' ')}
                </div>
              </div>
              <div
                className="text"
                style={{ textAlign: 'left', wordWrap: 'break-word' }}
              >
                {comment.content}
              </div>
            </div>
          </div>
        );
      } else {
        return;
      }
    });
  };

  return (
    <div>
      <div className="ui comments" style={{ marginTop: '4em' }}>
        {renderComments()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  let commentArray = Object.values(state.comments);

  let sortedArray = [];
  sortedArray = _.chain(commentArray).orderBy('created_date', 'desc').value();

  return {
    comments: sortedArray,
    currentUserId: state.auth.userId
  };
};

export default connect(mapStateToProps, { fetchAllComments })(CommentList);
