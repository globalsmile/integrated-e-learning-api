#  Advanced E-Learning Platform RESTful API

A robust RESTful API built with Node.js, Express, and MongoDB Atlas for managing online courses and student enrollments. This project implements features like user authentication with JWT, role-based access control, request validation with JOI, email notifications via Mailgun, media uploads using Cloudinary, and analytics using MongoDB aggregation. The API is documented with Postman and deployed on Render.com.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Repository Setup and Branching](#repository-setup-and-branching)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Third-Party Integrations](#third-party-integrations)
  - [Mailgun for Email Notifications](#mailgun-for-email-notifications)
  - [Cloudinary for Media Uploads](#cloudinary-for-media-uploads)
- [Postman Documentation](#postman-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Running the Integration Tests](#running-the-integration-tests)
- [Test Results](#test-results)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)

## Features
- **User Authentication:**  
  - Register and log in using JWT and bcrypt.
  - Role-based access control for instructors and students.
  
- **Course Management:**  
  - CRUD operations for courses (only instructors can create, update, or delete courses).
  - Students can enroll in courses.

- **Request Validation:**  
  - All data-modifying requests are validated with JOI.

- **Email Notifications:**  
  - Send email confirmations for account creation, password resets, password changes, and course enrollment using Mailgun.

- **Media Uploads:**  
  - Instructors can upload course media (images, videos, documents) to Cloudinary.

- **Analytics:**  
  - An endpoint providing insights via MongoDB aggregation.

---

## Technologies Used

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas (using Mongoose)  
- **Authentication:** JWT, bcrypt  
- **Validation:** JOI  
- **Email:** Mailgun  
- **Media Upload:** Cloudinary, multer, multer-storage-cloudinary  
- **Deployment:** Render.com  
- **Documentation:** Postman

---

## Repository Setup and Branching

### Cloning and Creating a New Repository

1. **Clone the Existing Repository into a New Directory:**

```bash
   git clone <old-repo-url> advanced-e-learning-api
   cd advanced-e-learning-api
```

2. **Remove the Old Remote to Prevent Accidental Pushes:**

```
git remote remove origin
```

3. **Create a New Repository on GitHub and add the new remote:**

```
git remote add origin <new-repo-url>
```

**Branching Strategy**
- **Feature Branches:**
  - Develop new features on separate branches (e.g., feature/validation-joi).

- **Development Branch:**
  - Merge feature branches into a development branch for integration and testing:

```
git checkout main
git pull origin main
git checkout -b development
git push -u origin development
```

- **Main Branch:**
  - After thorough testing on development, merge changes into main:

```
git checkout main
git merge development
git push origin main
```

## **Environment Variables**
Create a .env file in the project root with the following variables:

```
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/e-learning

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Mailgun (Email Notifications)
MAILGUN_API_KEY=your_mailgun_private_api_key
MAILGUN_DOMAIN=your_mailgun_domain
EMAIL_FROM=no-reply@yourdomain.com

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Port
PORT=5000
```

Make sure to configure these variables in your production environment as well.

## **Setup Instructions**
- Clone the Repository & Install Dependencies:

```
git clone <new-repo-url>
cd advanced-e-learning-api
npm install
```

- Set Up Environment Variables:
- Create a .env file (as shown above).
- Run the Application Locally:

```
npm run dev
```

The API will be available at http://localhost:5000.

## **API Endpoints**
- Authentication
  - **Register:** POST /api/auth/register

  ![advanced-user-reg](https://github.com/user-attachments/assets/89fcf6ee-2524-4244-96e1-cdcd421eac59)
  ![advanced-user-reg-student](https://github.com/user-attachments/assets/84b3c044-a67a-4a11-8e57-2549f7bf1e8e)
    
  - **Login:** POST /api/auth/login
 
  ![advanced-user-login-instructor](https://github.com/user-attachments/assets/7d0f7d6a-dd5e-4816-9622-37fb5074f99f)
  ![advanced-user-login-stu](https://github.com/user-attachments/assets/b8163a46-50e9-4eb4-a621-698f77287a9f)

  - **Forgot Password:** POST /api/auth/forgot-password
  
  ![advanced-user-forgot-pass-instructor](https://github.com/user-attachments/assets/373cc6d7-2317-42fa-a434-6026474342dc)
  ![advanced-user-forgot-pass-stu](https://github.com/user-attachments/assets/933cbd6f-b292-4f9f-b854-5c28be0b3436)
  
  - **Reset Password:** POST /api/auth/reset-password/:resetToken
 
  ![user-reset-password](https://github.com/user-attachments/assets/74fe79a9-114f-46dc-adae-5e47f20e1fbc)

  - **Change Password:** POST /api/auth/change-password

  ![user-change-password-stu](https://github.com/user-attachments/assets/4f923bb5-4498-4023-bbfc-5a411f17acc3)

-  Courses
  - **Create Course (Instructor Only):** POST /api/courses

  ![user-create-course](https://github.com/user-attachments/assets/5d64f1bc-0484-40b7-8096-f2c40c3b93ed)
  
  - **Get All Courses:** GET /api/courses

  ![get all courses](https://github.com/user-attachments/assets/cd766738-8b2e-4acf-ba79-1b25df95f7ac)

  - **Update Course (Instructor Only):** PUT /api/courses/:courseId

  ![update course](https://github.com/user-attachments/assets/9df05236-bc06-46b4-a933-a4e6e2500c26)

  - **Delete Course (Instructor Only):** DELETE /api/courses/:courseId

  ![delete-course](https://github.com/user-attachments/assets/eeadff63-12a2-4b02-9a30-d61b12eb0034)

  - **Enroll in Course (Student Only):** POST /api/courses/:courseId/enroll

  ![enroll-user](https://github.com/user-attachments/assets/43764e63-ad38-4686-a5da-55491390935a)

  - **Upload Course Media (Instructor Only):** POST /api/courses/:courseId/upload

  ![upload](https://github.com/user-attachments/assets/9aa6e876-2259-43fe-a0b9-c4f1984d2933)


- Analytics
  - **Analytics Summary:** GET /api/analytics/summary

  ![enrollment](https://github.com/user-attachments/assets/2ec46238-2867-4ea8-b883-ed5ac141c668)


Refer to the Postman Documentation for detailed request and response examples.

## **Third-Party Integrations**
### **Mailgun for Email Notifications**
  - Emails are sent using Mailgun. In production, configure Mailgun by storing your API key and domain as environment variables. The email utility (src/utils/email.js) handles sending emails for account creation, password resets, and changes.

### **Cloudinary for Media Uploads**
  - Cloudinary is configured in src/config/cloudinary.js using environment variables. Instructors can upload media files via the /api/courses/:courseId/upload endpoint. This setup uses multer and multer-storage-cloudinary for file handling.

## **Postman Documentation**
  - Import the Collection:
    - Import the provided Postman collection JSON file into Postman.

- **Publish the Documentation:**

- Open the collection in Postman.
- Click on "View Documentation" and then "Publish".
- Copy the generated public URL and include it in the README or share it with your team.


## **API Documentation**

You can view the full API documentation here: [Advanced-E-Learning API Documentation](https://documenter.getpostman.com/view/33057863/2sAYdbPD1w)


## **Deployment**
This API is deployed on Render at  https://advanced-e-learning-api.onrender.com. Deployment steps include:

- Push Code to GitHub:
  - Ensure all changes are committed and pushed to the new GitHub repository.

- Configure Render.com:
  - Connect the repository.

- Set environment variables (as shown above) in Render’s dashboard.
- Deploy the application.
- Update Postman Base URL:
- In your Postman collection, update the {{baseUrl}} variable to the production URL provided by Render.

## **Troubleshooting**
- 502 Bad Gateway Errors:
  - Check server logs and ensure that environment variables (MongoDB URI, JWT secret, etc.) are correctly configured. Verify that the application is listening on the correct port.

- 500 Internal Server Errors on Upload:
  - Verify Cloudinary configuration, file size limits, and allowed formats. Wrap your upload route in a try-catch block to log detailed error messages.

- Mailgun Errors:
  - Ensure that the "to" field is populated with a valid email address and that your Mailgun credentials are correct.

- JWT or JOI Validation Issues:
  - Confirm that your JWT secret is consistently used across signing and verification. Review JOI schemas for correctness.

## **Running the Integration Tests**

To run the integration tests for the Advanced E-Learning Platform RESTful API, execute the following command from the root of the project:

```bash
npm test
```

## **Test Results**

```
PASS __tests__/app.test.js (9.334 s)
  Advanced E-Learning Platform API Integration Tests
    User Authentication
      ✓ should register an instructor successfully (221 ms)
      ✓ should register a student successfully (107 ms)
      ✓ should login as instructor and receive a token (98 ms)
      ✓ should login as student and receive a token (110 ms)
    Course Management
      ✓ should allow an instructor to create a course (21 ms)
      ✓ should not allow a student to create a course (19 ms)
      ✓ should get all courses (34 ms)
      ✓ should allow an instructor to update a course (29 ms)
      ✓ should allow an instructor to delete a course (19 ms)
    Enrollment
      ✓ should allow a student to enroll in a course (18 ms)
      ✓ should not allow an instructor to enroll in a course (8 ms)
    Media Upload
      ✓ should allow an instructor to upload media (945 ms)
    Analytics
      ✓ should return an analytics summary (16 ms)
    Password Reset and Change
      ✓ should send a password reset email for a valid email (24 ms)
      ✓ should reset the password using a valid token (5265 ms)
      ✓ should fail to reset the password with an invalid token (9 ms)
      ✓ should change password for a logged-in user with the correct current password (347 ms)
      ✓ should fail to change the password with an incorrect current password (197 ms)

Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        9.359 s, estimated 10 s
Ran all test suites.
```


## **Lessons Learned**
- Repository Management:
  - Creating a new repository and using a dedicated development branch helped streamline the development process and prevent accidental pushes.

- Validation & Security:
  - Implementing JOI for request validation and using JWT for authentication ensured that data integrity and security were maintained.

- Third-Party Integrations:
  - Integrating Mailgun and Cloudinary provided valuable experience in managing external services securely in production.

- Deployment Best Practices:
  - Properly configuring environment variables and using a continuous deployment platform like Render.com streamlined the production rollout process.

## **Conclusion**
The Advanced E-Learning Platform RESTful API is a feature-rich project that demonstrates modern web development practices, including secure authentication, role-based access control, request validation, email notifications, media uploads, and analytics. This project has been a significant learning experience, reinforcing the importance of robust repository management, thorough testing, and the integration of external services.

For further details or questions, please refer to the documentation provided or contact the project maintainer.
