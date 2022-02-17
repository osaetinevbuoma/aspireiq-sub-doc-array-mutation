import request from 'supertest';

import app from '../src/server';
import { TEST_MENTIONS, TEST_OBJECT, TEST_POSTS } from './test.data';

const API_ENDPOINT = '/api/array-mutation';

describe('Test generic routine via API requests', () => {
  test('test updating posts from API', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: TEST_POSTS.update,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $update: { 'posts.0.value': TEST_POSTS.update.posts[0].value },
        });
        done();
      });
  });

  test('test updating mentions from API', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: TEST_MENTIONS.update,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
        });
        done();
      });
  });

  test('test adding posts from API', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: TEST_POSTS.add,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $add: TEST_POSTS.add,
        });
        done();
      });
  });

  test('test adding mentions from API', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: TEST_MENTIONS.add,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $add: { 'posts.2.mentions': TEST_MENTIONS.add.posts[0].mentions },
        });
        done();
      });
  });

  test('test removing posts from API', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: TEST_POSTS.remove,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $remove: { 'posts.3': true },
        });
        done();
      });
  });

  test('test removing mentions from API', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: TEST_MENTIONS.remove,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $remove: { 'posts.3.mentions.1': true },
        });
        done();
      });
  });

  test('test performing combined operation from a single document from API - all posts', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: {
          posts: [TEST_POSTS.add.posts[0], TEST_POSTS.update.posts[0], TEST_POSTS.remove.posts[0]],
        },
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $add: { posts: TEST_POSTS.add.posts },
          $update: { 'posts.0.value': TEST_POSTS.update.posts[0].value },
          $remove: { 'posts.3': true },
        });
        done();
      });
  });

  test('test performing combined operation from a single document from API - all mentions', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: {
          posts: [
            TEST_MENTIONS.add.posts[0],
            TEST_MENTIONS.update.posts[0],
            TEST_MENTIONS.remove.posts[0],
          ],
        },
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $add: { 'posts.2.mentions': TEST_MENTIONS.add.posts[0].mentions },
          $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
          $remove: { 'posts.3.mentions.1': true },
        });
        done();
      });
  });

  test('test performing combined operation from a single document from API - mixture', (done) => {
    request(app)
      .post(API_ENDPOINT)
      .send({
        document: TEST_OBJECT,
        mutation: {
          posts: [
            TEST_POSTS.add.posts[0],
            TEST_MENTIONS.update.posts[0],
            TEST_MENTIONS.remove.posts[0],
          ],
        },
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({
          $add: { posts: TEST_POSTS.add.posts },
          $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
          $remove: { 'posts.3.mentions.1': true },
        });
        done();
      });
  });
});
