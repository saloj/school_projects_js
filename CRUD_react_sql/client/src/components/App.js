import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from '../history';
import Header from '../components/Header';
import PostList from '../components/posts/PostList';
import PostCreate from '../components/posts/PostCreate';
import PostDelete from '../components/posts/PostDelete';
import PostShow from '../components/posts/PostShow';
import PostEdit from '../components/posts/PostEdit';

const App = () => {
  return (
    <div className="ui container">
      <Router history={createBrowserHistory}>
        <div>
          <Header />
          <Switch>
            <Route path="/" exact component={PostList} />
            <Route path="/posts/new" exact component={PostCreate} />
            <Route path="/posts/edit/:id" exact component={PostEdit} />
            <Route path="/posts/delete/:id" exact component={PostDelete} />
            <Route path="/posts/:id" exact component={PostShow} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
