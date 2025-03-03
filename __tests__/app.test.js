// __tests__/api.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Adjust the path to your Express app

jest.setTimeout(10000); // Increase to 10 seconds

let mongoServer;
let instructorToken;
let studentToken;
let courseId;
let newCourseId; // for enrollment tests
let courseForUpload;

describe('Advanced E-Learning Platform API Integration Tests', () => {
  // Connect to the in-memory test database before running any tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Disconnect from the database after all tests have run
  afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Optionally clear the test database
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('User Authentication', () => {
    it('should register an instructor successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Instructor One',
          email: 'instructor1@example.com',
          password: 'password123',
          role: 'instructor',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should register a student successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Student One',
          email: 'student1@example.com',
          password: 'password123',
          role: 'student',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should login as instructor and receive a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'instructor1@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      instructorToken = `Bearer ${res.body.token}`;
    });

    it('should login as student and receive a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student1@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      studentToken = `Bearer ${res.body.token}`;
    });
  });

  describe('Course Management', () => {
    it('should allow an instructor to create a course', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', instructorToken)
        .send({
          title: 'Advanced Node.js',
          description: 'In-depth Node.js course',
          duration: '15 hours',
          price: 99.99,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id');
      courseId = res.body._id;
    });

    it('should not allow a student to create a course', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', studentToken)
        .send({
          title: 'Unauthorized Course',
          description: 'This should fail',
          duration: '10 hours',
          price: 49.99,
        });
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });

    it('should get all courses', async () => {
      const res = await request(app)
        .get('/api/courses')
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should allow an instructor to update a course', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', instructorToken)
        .send({
          title: 'Advanced Node.js Updated',
          description: 'Updated description',
          duration: '20 hours',
          price: 89.99,
        });
      expect(res.statusCode).toBe(200);
      // Adjust based on your response structure; for example:
      expect(res.body.course.title).toBe('Advanced Node.js Updated');
    });

    it('should allow an instructor to delete a course', async () => {
      const res = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', instructorToken);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Course deleted successfully');
    });
  });

  describe('Enrollment', () => {
    beforeAll(async () => {
      // Create a new course for enrollment tests
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', instructorToken)
        .send({
          title: 'Enrollment Test Course',
          description: 'Course for enrollment tests',
          duration: '10 hours',
          price: 59.99,
        });
      newCourseId = res.body._id;
    });

    it('should allow a student to enroll in a course', async () => {
      const res = await request(app)
        .post(`/api/courses/${newCourseId}/enroll`)
        .set('Authorization', studentToken);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Enrolled successfully');
    });

    it('should not allow an instructor to enroll in a course', async () => {
      const res = await request(app)
        .post(`/api/courses/${newCourseId}/enroll`)
        .set('Authorization', instructorToken);
      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('Media Upload', () => {
    beforeAll(async () => {
      // Create a new course for media upload tests
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', instructorToken)
        .send({
          title: 'Media Upload Test Course',
          description: 'Course for media upload tests',
          duration: '5 hours',
          price: 39.99,
        });
      courseForUpload = res.body._id;
    });

    it('should allow an instructor to upload media', async () => {
      const res = await request(app)
        .post(`/api/courses/${courseForUpload}/upload`)
        .set('Authorization', instructorToken)
        .attach('media', path.join(__dirname, 'test-files/moisture_content.jpg')); // Ensure this file exists in __tests__/test-files/
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('fileUrl');
    });
  });

  describe('Analytics', () => {
    it('should return an analytics summary', async () => {
      const res = await request(app)
        .get('/api/analytics/summary')
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalCourses');
      expect(res.body).toHaveProperty('totalEnrollments');
    });
  });

  describe('Password Reset and Change', () => {
    let resetToken;
    const testUserEmail = 'testuser@example.com';
    const initialPassword = 'initialPassword123';

    // Register a new user for password reset tests
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: testUserEmail,
          password: initialPassword,
          role: 'student',
        });
    });

    it('should send a password reset email for a valid email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUserEmail });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Retrieve the reset token from the database (simulate this for testing)
      const User = require('../src/models/User');
      const user = await User.findOne({ email: testUserEmail });
      expect(user).toHaveProperty('resetPasswordToken');
      resetToken = user.resetPasswordToken;
    });


    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    it('should reset the password using a valid token', async () => {
      const newPassword = 'newPassword456';
      const res = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({ newPassword });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Wait 100ms before attempting to log in
      // await delay(5000);

      // Verify that the user can now log in with the new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUserEmail, password: newPassword });
      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty('token');
    });

    it('should fail to reset the password with an invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password/invalidToken123')
        .send({ newPassword: 'anotherPassword789' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should change password for a logged-in user with the correct current password', async () => {
      // Log in to get a valid token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUserEmail, password: 'newPassword456' });
      expect(loginRes.statusCode).toBe(200);
      const token = `Bearer ${loginRes.body.token}`;

      // Change the password
      const changeRes = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', token)
        .send({ currentPassword: 'newPassword456', newPassword: 'changedPassword789' });
      expect(changeRes.statusCode).toBe(200);
      expect(changeRes.body).toHaveProperty('message');

      // Verify login with the new password
      const loginRes2 = await request(app)
        .post('/api/auth/login')
        .send({ email: testUserEmail, password: 'changedPassword789' });
      expect(loginRes2.statusCode).toBe(200);
      expect(loginRes2.body).toHaveProperty('token');
    });

    it('should fail to change the password with an incorrect current password', async () => {
      // Log in to get a valid token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUserEmail, password: 'changedPassword789' });
      expect(loginRes.statusCode).toBe(200);
      const token = `Bearer ${loginRes.body.token}`;

      // Attempt to change the password with the wrong current password
      const changeRes = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', token)
        .send({ currentPassword: 'wrongPassword', newPassword: 'shouldNotWork' });
      expect(changeRes.statusCode).toBe(400);
      expect(changeRes.body).toHaveProperty('message');
    });
  });
});
