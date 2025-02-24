# SocialSnap

SocialSnap is a full-stack social media platform built with Node.js, Express, Sequelize (with MySQL), and React. The application allows users to register, log in, create posts, comment on posts, and like posts. When a user is not logged in, the navigation bar only displays options to **Login** and **Register**. Once authenticated, users can view posts, create new posts, and interact through comments and likes.

---

## Features

- **User Authentication:**
  - **Register:** New users can sign up (see screenshot: **foto daftar.png**).
  - **Login:** Existing users can log in (see screenshot: **login.png**).
- **Post Management:**
  - **Home Page:** View all posts (see screenshot: **home.png**).
  - **Create Post:** Users can create new posts with photo uploads (see screenshot: **createpost.png**).
- **Social Interactions:**
  - **Commenting:** Users can comment on posts (see screenshot: **komentar.png**).
  - **Liking:** Users can like posts.
- **Responsive Navigation:**
  - When not logged in, only **Login** and **Register** options are visible.
  - After logging in, options such as **Home**, **Create Post**, and **Logout** are available.

---

## Technologies Used

- **Backend:**
  - **Node.js:** v22.14.0
  - **Express.js**
  - **Sequelize ORM** with **MySQL**
- **Frontend:**
  - **React:** v19 (created using `npm create-react-app`)
  - **HTML & CSS**
- **Runtime Tools:**
  - **npm:** v10.9.2

---

## Getting Started

`cd backend`

### Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   Configure Environment Variables:
   ```

Create a .env file in the backend root directory with your MySQL configuration:

## .env

```
JWT_SECRET=yoursecret
PORT = 5000
```

### after setup backend next setupfrontend

### bash

`cd frontend`
Install frontend dependencies:
bash

```
npm install
```

Run the frontend application:
bash

```
npm start
```

Here are some screenshots of the SocialSnap application:

- **Register Page (foto daftar.png):**  
  ![](register.png)

- **Login Page (login.png):**  
  ![](login.png)

- **Home Page (home.png):**  
  ![](home.png)

- **Create Post Page (createpost.png):**  
  ![](createpost.png)

- **Comment Section (komentar.png):**  
  ![](komentar.png)

Ensure that these image files are placed in an images folder at the root of your repository.

License

```
This project is licensed under the MIT License.
```

-----------------------------------------**Developed by [jerypatut]** -------------------------------------------------------
