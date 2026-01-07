import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/user.js';
import Notification from '../models/notificationModel.js';
import Capsule from '../models/capsuleModel.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Feature: Notification Management (Student ID: 22301404)', () => {
  let authToken = '';
  let testUserId = '';
  let testNotificationId = '';
  let testCapsuleId = '';

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteOne({ email: 'testnotification@user.com' });
    await Notification.deleteMany({});

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Notification User',
        email: 'testnotification@user.com',
        password: 'testpassword123'
      });

    authToken = registerResponse.body.token;
    testUserId = registerResponse.body.user.id;

    const testCapsule = await Capsule.create({
      title: 'Test Capsule for Notifications',
      description: 'Test capsule description',
      releaseDate: new Date('2026-12-31'),
      status: 'locked',
      owner: testUserId
    });
    testCapsuleId = testCapsule._id;

    const notification = await Notification.create({
      user: testUserId,
      capsule: testCapsuleId,
      message: 'Your capsule "Test Capsule for Notifications" has been unlocked!',
      type: 'capsule_unlocked',
      isRead: false
    });
    testNotificationId = notification._id.toString();
  });

  afterAll(async () => {
    await User.deleteOne({ email: 'testnotification@user.com' });
    await Notification.deleteMany({ user: testUserId });
    await Capsule.deleteMany({ owner: testUserId });
    await mongoose.connection.close();
  });

  describe('Test 1: GET all notifications', () => {
    it('should retrieve all notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('message');
      expect(res.body[0]).toHaveProperty('type');
      expect(res.body[0]).toHaveProperty('isRead');
    });
  });

  describe('Test 2: GET unread count', () => {
    it('should return unread count', async () => {
      const res = await request(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('count');
      expect(typeof res.body.count).toBe('number');
      expect(res.body.count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Test 3: PUT mark as read', () => {
    it('should mark notification as read', async () => {
      const res = await request(app)
        .put(`/api/notifications/${testNotificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('isRead', true);
      expect(res.body).toHaveProperty('_id', testNotificationId);
    });
  });

  describe('Test 4: PUT mark all as read', () => {
    it('should mark all as read', async () => {
      await Notification.create({
        user: testUserId,
        capsule: testCapsuleId,
        message: 'Another test notification',
        type: 'system',
        isRead: false
      });

      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'All notifications marked as read');

      const unreadCount = await Notification.countDocuments({
        user: testUserId,
        isRead: false
      });
      expect(unreadCount).toBe(0);
    });
  });

  describe('Test 5: DELETE notification', () => {
    it('should delete notification', async () => {
      const notificationToDelete = await Notification.create({
        user: testUserId,
        message: 'Notification to be deleted',
        type: 'system',
        isRead: false
      });

      const res = await request(app)
        .delete(`/api/notifications/${notificationToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Notification deleted');

      const deletedNotification = await Notification.findById(notificationToDelete._id);
      expect(deletedNotification).toBeNull();
    });
  });

  describe('Test 6: Mark as read - not found', () => {
    it('should return 404', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/notifications/${fakeId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Notification not found');
    });
  });

  describe('Test 7: Delete - not found', () => {
    it('should return 404', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/notifications/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Notification not found');
    });
  });

  describe('Test 8: Invalid ID format', () => {
    it('should return 500', async () => {
      const res = await request(app)
        .put('/api/notifications/invalid-id-format/read')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('Test 9: GET without token', () => {
    it('should return 401', async () => {
      const res = await request(app)
        .get('/api/notifications');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });

  describe('Test 10: GET unread count without token', () => {
    it('should return 401', async () => {
      const res = await request(app)
        .get('/api/notifications/unread-count');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });

  describe('Test 11: PUT without token', () => {
    it('should return 401', async () => {
      const res = await request(app)
        .put(`/api/notifications/${testNotificationId}/read`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });

  describe('Test 12: DELETE without token', () => {
    it('should return 401', async () => {
      const res = await request(app)
        .delete(`/api/notifications/${testNotificationId}`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'No token, authorization denied');
    });
  });

  describe('Test 13: Invalid token', () => {
    it('should return 401', async () => {
      const res = await request(app)
        .put(`/api/notifications/${testNotificationId}/read`)
        .set('Authorization', 'Bearer invalid-token-12345');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Token is not valid');
    });
  });

  describe('Test 14: Empty notifications list', () => {
    it('should return empty array', async () => {
      const newUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Empty Notification User',
          email: 'emptynotif@user.com',
          password: 'password123'
        });

      const newToken = newUserRes.body.token;

      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${newToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);

      await User.deleteOne({ email: 'emptynotif@user.com' });
    });
  });

  describe('Test 15: Mark all when already read', () => {
    it('should handle gracefully', async () => {
      await Notification.updateMany(
        { user: testUserId },
        { isRead: true }
      );

      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'All notifications marked as read');
    });
  });
});
