# E-Learning Platform RESTful API

A RESTful API for managing courses and student enrollments. This project allows users to register, log in, create and manage courses, and enable student enrollment. Built with Node.js, Express, and MongoDB Atlas, the API is designed with security and scalability in mind.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Postman Documentaion](#postman-documentation)
- [Deployment](#deployment)
- [Development Experience](#development-experience)

## Features
- **User Authentication:**  
  Register and log in using JWT-based authentication.
- **Course Management:**  
  Instructors can create, update, and delete courses.
- **Student Enrollment:**  
  Students can enroll in courses; instructors can manage enrollments.
- **MongoDB Atlas Integration:**  
  Cloud-hosted MongoDB for data storage.
- **Role-Based Access:**  
  Separate functionalities for students and instructors.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (using Mongoose)
- **Authentication:** JSON Web Token (JWT), bcrypt
- **Documentation:** Postman
- **Deployment:** Render

## Setup Instructions

1. **Clone the repository:**

 ```bash
 git clone <repository_url>
 cd e-learning-api
 ```

2. **Install dependencies:**

```bash

npm install
```

3. **Environment Variables:**
Create a .env file in the root directory and add the following:

```ini
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/e-learning
JWT_SECRET=your_secret_key
PORT=5000
```

4. **Run the application:**

```bash
npm run dev
The API will run on http://localhost:8000.
```

## **API Endpoints**
### Authentication
- **Register a new user:**
  - **Endpoint:** POST /api/auth/register

![user-reg-student](https://github.com/user-attachments/assets/cf7ee9fd-94f4-4129-b7d8-1c7ee8ae6922)

![user-reg-instructor](https://github.com/user-attachments/assets/ecc88543-6b87-4774-8dde-90a3f0ef8ae7)

- **Login a user:**
  - **Endpoint:** POST /api/auth/login

![login-student](https://github.com/user-attachments/assets/73f57a41-5d99-4b5d-a600-96496b274abd)

![login-instructor](https://github.com/user-attachments/assets/004d0aa3-eebd-428e-b54a-22b74175f96b)

### **Courses**
- **Create a Course (Instructor Only):**
  - **Endpoint:** POST /api/courses
  - **Headers:** Authorization:** Bearer <token>

![create-course](https://github.com/user-attachments/assets/1441141c-f143-4cc6-8720-5d77b9bf7078)

- **Get All Courses:**
  - **Endpoint:** GET /api/courses

![all-courses](https://github.com/user-attachments/assets/cdb141d5-f709-4e5d-9561-6d8718d27e92)

- **Enroll in a Course (Student Only):**
  - **Endpoint:** POST /api/courses/:courseId/enroll
  - **Headers:** Authorization: Bearer <token>

![enroll](https://github.com/user-attachments/assets/ada63625-fe09-443c-8b41-1d8f8e153d73)

  
## Postman Documentation
- Check out the [postman documentation](https://documenter.getpostman.com/view/33057863/2sAYXCmKYT)
- Update the variables:
  - ```{{baseUrl}}:``` Set this to your deployed API URL (or http://localhost:8000 during development).
  - ```{{token}}:``` Update after successful login.
  - ```{{courseId}}:``` Set to a valid course ID when testing enrollment.

## Deployment
- This API is deployed on Render at  https://e-learning-api-hxel.onrender.com
- To deploy:
  - Push your code to GitHub.
  - Create a new Web Service on Render and connect your repository.
  - Set your environment variables on Render (same as in your .env file).
  - Once deployed, update the {{baseUrl}} variable in the Postman Collection.
 
## Development Experience
 I wrote about my experience while working on the assignment at https://globalsmile.medium.com/building-an-e-learning-platform-restful-api-a-developers-journey-c30c4fb89bb6
