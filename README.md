
# Communify - Backend

Full-stack social networking platform. It encompasses server-side logic and APIs, managing user interactions, posts, comments, and communities. It ensures seamless communication between the frontend and the database, driving the core functionality of the platform.




## Features
- **Registration and Login:**
  - Users can create an account through a registration process.
  - Secure authentication allows registered users to log in 
  - Logout Functionality: Users can securely log out of their accounts.
- **Post Management:**
  - **Create Posts:** Users can create and share posts with text and images.
  - **Edit Posts:** Users have the ability to edit their own posts.
  - **Delete Posts:** Users can delete their own posts.
- **Commenting:** 
  - Users can react to post by commenting.
- **Voting System:** 
  - Users can upvoted or downvoted, influencing visibility and popularity.
- **Community Creation and Joining:**
  - Users can create and join communities.


## Tech Stack
- **Backend:** Node.js, Express, MongoDB


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ACCESS_TOKEN_SECRET`
`ADMIN_PASSWORD`
`ADMIN_SECRET_KEY`

## Run Locally

Clone the project

```bash
  git clone https://github.com/fathimathjazeera/serverofcommunify.git
```

Go to the project directory

```bash
  cd serverofcommunify
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
If you have any issues in bcrypt when start server, run 
```bash
  npm uninstall bcrypt
  npm install bcrypt
  npm start
```

