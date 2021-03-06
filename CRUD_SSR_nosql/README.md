# Assignment - CRUD Snippets
## Task description for the app is shown below (the criteria I had to fulfill during the assignment)

In this assignment, you will create a web application to manage code [snippets](https://en.wikipedia.org/wiki/Snippet_(programming)). The web application will use the Node.js platform, Express as the application framework, and Mongoose as the object data modeling (ODM) library for MongoDB.

You must use the repository created for you and this assignment and make continuous commits so it is possible to follow the web application's creation. Make sure that no more files than necessary are committed to the repository.

To announce that you have completed the assignment, you must make a merge request of your assignment at its repository on GitLab.

## The web application

The web application must be a Node.js application that uses Express as the application framework and Mongoose as the ODM to create a web application that can store data persistently. The web application must work even when the client has disabled JavaScript. You must follow the course's coding standard. You must split your source code into several modules. Of course, you need to document and comment on the source code.

After cloning the repository with the application's source code and running `npm install`, it must be easy to lint the source code and run the application. Therefore, be sure to add the script start and lint to the "scripts" field in the package.json file.

A MongoDB database must store the web application's data. You are free to use [MongoDB as a Docker container](https://hub.docker.com/_/mongo), or a cloud-hosted MongoDB, for instance, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

Users must be able to register and login into the application after entering a username and a password. The username must be unique to the application, and it must not be possible to read back the password. A logged-in user must be able to log out of the application.

There must be support for some basic authentication and authorization for the application to differentiate between an anonymous and authenticated user. You may only use session storage on the server-side, using the [express-session](https://www.npmjs.com/package/express-session) package, to implement authentication and authorization. __You must not use any packages such as Passport, etc., to authenticate or authorize.__ 

The web application must have full CRUD functionality regarding snippets, whereby a user must be able to create, read, update, and delete snippets. Anonymous users should only be able to view snippets. In addition to view snippets, authenticated users must also create, edit, and delete their snippets. __No one but the owner, the creator, of a snippet, must be able to edit and delete the said snippet.__ When creating and viewing snippets, __the application must support multiline text__, enabling the logged-on user to write real code snippets, not just one-line texts. 

The application should be easy to use and understand, which means that it should notify the user of what is happening using, for example, flash messages. Do not invite users to make mistakes. Do not offer a user to do things in the web applications UI that the user is not granted to do.

If a user requests a non-existent resource or a resource that requires the user to be authenticated, the application must return the HTTP status code 404 (Not Found). When an authenticated user does not have permission to access a requested resource, the application must return the HTTP status code 403 (Forbidden). The HTTP status code 500 (Internal Server Error) must only be returned when it is essential.

As far as possible, be sure to protect the application from vulnerable attacks.

The application should be deployed on the given server in CSCloud.

