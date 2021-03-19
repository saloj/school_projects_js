import React from 'react';
import { Field, reduxForm } from 'redux-form';
import createBrowserHistory from '../../history';

const renderInput = ({ input, label, meta }) => {
  // meta gets passed in by redux-form to the component listed in the Field prop
  const className = `field ${meta.error && meta.touched ? 'error' : ''}`;

  return (
    <div className={className}>
      <label>{label}</label>
      <input {...input} autoComplete="off" />
      {renderError(meta)}
    </div>
  );
};

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
  if (!formValues.title || /^ *$/.test(formValues.title)) {
    errors.title = 'Title is required';
  }
  if (!formValues.content || /^ *$/.test(formValues.content)) {
    errors.content = 'Content is required';
  }

  return errors;
};

const PostForm = (props) => {
  const onSubmit = (formValues) => {
    props.onSubmit(formValues);
  };

  return (
    // handleSubmit is a function on redux-form, provides preventDefault etc. by default
    <form className="ui form error" onSubmit={props.handleSubmit(onSubmit)}>
      <Field name="title" component={renderInput} label="Enter Title" />
      <Field name="content" component={renderTextArea} label="babbel!" />
      <button className="ui button primary">Submit</button>
      <button
        className="ui button negative"
        onClick={() => createBrowserHistory.goBack()}
      >
        Cancel
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'postForm',
  validate
})(PostForm);
