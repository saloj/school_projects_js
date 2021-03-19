import React from 'react';
import { Field, reduxForm } from 'redux-form';

const renderTextArea = ({ input, label, meta }) => {
  const className = `field ${meta.error && meta.touched ? 'error' : ''}`;

  return (
    <div className={className}>
      <label>{label}</label>
      <textarea {...input} autoComplete="off" style={{ resize: 'none' }} />
      {renderError(meta)}
    </div>
  );
};

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return (
      <div className="ui error message">
        <div className="header">{error}</div>
      </div>
    );
  }
};

const validate = (formValues) => {
  const errors = {};

  // makes sure content is not purely blank space
  if (!formValues.content || /^ *$/.test(formValues.content)) {
    errors.content = 'Content is required';
  }

  return errors;
};

const CommentForm = (props) => {
  const onSubmit = (formValues) => {
    props.onSubmit(formValues);
  };

  return (
    // handleSubmit is a function on redux-form, provides preventDefault etc. by default
    <form className="ui reply form" onSubmit={props.handleSubmit(onSubmit)}>
      <Field name="content" component={renderTextArea} />
      <button className="ui button primary">Add Comment</button>
    </form>
  );
};

export default reduxForm({
  form: 'commentForm',
  validate
})(CommentForm);
