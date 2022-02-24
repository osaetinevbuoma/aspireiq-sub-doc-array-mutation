import * as service from '../src/services/mutation.service';
import {
  TEST_LIKES,
  TEST_MENTIONS,
  TEST_OBJECT,
  TEST_POSTS,
} from './test.data';

describe('Test utility functions', () => {
  test('Determine if an object contains an array', () => {
    let doesObjectContainArray = service.doesMutationContainArray(TEST_MENTIONS.update.posts[0]);
    expect(doesObjectContainArray).toBe(true);

    doesObjectContainArray = service.doesMutationContainArray(TEST_POSTS.update.posts[0]);
    expect(doesObjectContainArray).toBe(false);
  });
});

describe('Test document operations', () => {
  test('Removing from object', () => {
    const document = {
      _id: 9,
      text: 'avocado',
      likes: [
        {
          _id: 11,
          up: 20,
        },
        {
          _id: 12,
          up: 2,
        },
      ],
    };
    let mutationObject = { _id: 11, _delete: true };
    const parentKey = 'likes';
    const mutationKey = 'posts.3.mentions.1';

    let statement = service.removeDocument(document, mutationObject, parentKey, {}, mutationKey);
    expect(statement).toStrictEqual({ $remove: { 'posts.3.mentions.1.likes.0': true } });

    mutationObject = { _id: 12, _delete: true };
    statement = service.removeDocument(document, mutationObject, parentKey, statement, mutationKey);
    expect(statement).toStrictEqual({
      $remove: [{ 'posts.3.mentions.1.likes.0': true }, { 'posts.3.mentions.1.likes.1': true }],
    });
  });

  test('Updating object', () => {
    const document = {
      _id: 9,
      text: 'avocado',
      likes: [
        {
          _id: 11,
          up: 20,
        },
        {
          _id: 12,
          up: 2,
        },
      ],
    };
    let mutationObject = { _id: 12, up: 5 };
    const parentKey = 'likes';
    const mutationKey = 'posts.3.mentions.1';

    let statement = service.updateDocument(document, mutationObject, parentKey, {}, mutationKey);
    expect(statement).toStrictEqual({ $update: { 'posts.3.mentions.1.likes.1.up': 5 } });

    mutationObject = { _id: 11, up: 20 };
    statement = service.updateDocument(document, mutationObject, parentKey, statement, mutationKey);
    expect(statement).toStrictEqual({
      $update: [{ 'posts.3.mentions.1.likes.1.up': 5 }, { 'posts.3.mentions.1.likes.0.up': 20 }],
    });
  });

  test('Adding objects', () => {
    let mutationObject = { text: 'apricot' };
    const parentKey = 'mentions';
    const mutationKey = 'posts.1';

    let statement = service.addDocument(mutationObject, parentKey, {}, mutationKey);
    expect(statement).toStrictEqual({ $add: { 'posts.1.mentions': [{ text: 'apricot' }] } });

    mutationObject = { text: 'guava' };
    statement = service.addDocument(mutationObject, parentKey, statement, mutationKey);
    expect(statement).toStrictEqual({
      $add: [{ 'posts.1.mentions': [{ text: 'apricot' }] }, { 'posts.1.mentions': [{ text: 'guava' }] }],
    });
  });
});

describe('Perform mutations', () => {
  describe('Perform remove mutations', () => {
    test('Remove mutations on first level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_POSTS.remove.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $remove: { 'posts.3': true } });
    });

    test('Remove mutations on second level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_MENTIONS.remove.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $remove: { 'posts.3.mentions.1': true } });
    });

    test('Remove multiple mutations on second level', () => {
      const mutationObject = {
        posts: [
          {
            _id: 7,
            mentions: [
              { _id: 9, _delete: true },
              { _id: 10, _delete: true },
            ],
          },
        ],
      };
      const statement = service.performMutation(TEST_OBJECT, mutationObject.posts[0], 'posts', {});
      expect(statement).toStrictEqual({
        $remove: [{ 'posts.3.mentions.1': true }, { 'posts.3.mentions.2': true }],
      });
    });

    test('Remove mutations on third level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_LIKES.remove.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $remove: { 'posts.3.mentions.1.likes.1': true } });
    });

    test('Remove multiple mutations on third level', () => {
      const mutationObject = {
        posts: [
          {
            _id: 7,
            mentions: [
              {
                _id: 9,
                likes: [
                  { _id: 12, _delete: true },
                  { _id: 11, _delete: true },
                ],
              },
            ],
          },
        ],
      };
      const statement = service.performMutation(TEST_OBJECT, mutationObject.posts[0], 'posts', {});
      expect(statement).toStrictEqual({
        $remove: [{ 'posts.3.mentions.1.likes.1': true }, { 'posts.3.mentions.1.likes.0': true }],
      });
    });
  });

  describe('Perform update operation', () => {
    test('Update operation on first level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_POSTS.update.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $update: { 'posts.0.value': 'too' } });
    });

    test('Update operation on second level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_MENTIONS.update.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $update: { 'posts.1.mentions.0.text': 'pear' } });
    });

    test('Update multiple mutations on second level', () => {
      const mutationObject = {
        posts: [
          {
            _id: 3,
            mentions: [
              { _id: 5, text: 'pear' },
              { _id: 6, text: 'clementine' },
            ],
          },
        ],
      };
      const statement = service.performMutation(TEST_OBJECT, mutationObject.posts[0], 'posts', {});
      expect(statement).toStrictEqual({
        $update: [{ 'posts.1.mentions.0.text': 'pear' }, { 'posts.1.mentions.1.text': 'clementine' }],
      });
    });

    test('Update operation on third level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_LIKES.update.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $update: { 'posts.3.mentions.1.likes.0.up': 22 } });
    });

    test('Update multiple mutations on third level', () => {
      const mutationObject = {
        posts: [
          {
            _id: 7,
            mentions: [
              {
                _id: 9,
                likes: [
                  { _id: 11, up: 22 },
                  { _id: 12, up: 33 },
                ],
              },
            ],
          },
        ],
      };
      const statement = service.performMutation(TEST_OBJECT, mutationObject.posts[0], 'posts', {});
      expect(statement).toStrictEqual({
        $update: [{ 'posts.3.mentions.1.likes.0.up': 22 }, { 'posts.3.mentions.1.likes.1.up': 33 }],
      });
    });
  });

  describe('Perform add operations', () => {
    test('Add operation on first level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_POSTS.add.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $add: { posts: [{ value: 'four' }] } });
    });

    test('Add operation on second level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_MENTIONS.add.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $add: { 'posts.2.mentions': [{ text: 'banana' }] } });
    });

    test('Add multiple mutations on second level', () => {
      const mutationObject = {
        posts: [
          {
            _id: 4,
            mentions: [{ text: 'banana' }, { text: 'mango' }],
          },
        ],
      };
      const statement = service.performMutation(TEST_OBJECT, mutationObject.posts[0], 'posts', {});
      expect(statement).toStrictEqual({
        $add: [{ 'posts.2.mentions': [{ text: 'banana' }] }, { 'posts.2.mentions': [{ text: 'mango' }] }],
      });
    });

    test('Add operation on third level', () => {
      const statement = service.performMutation(TEST_OBJECT, TEST_LIKES.add.posts[0], 'posts', {});
      expect(statement).toStrictEqual({ $add: { 'posts.1.mentions.0.likes': [{ up: 15 }] } });
    });

    test('Add multiple mutations on third level', () => {
      const mutationObject = {
        posts: [
          {
            _id: 3,
            mentions: [
              {
                _id: 5,
                likes: [{ up: 15 }, { up: 20 }],
              },
            ],
          },
        ],
      };
      const statement = service.performMutation(TEST_OBJECT, mutationObject.posts[0], 'posts', {});
      expect(statement).toStrictEqual({
        $add: [
          { 'posts.1.mentions.0.likes': [{ up: 15 }] },
          { 'posts.1.mentions.0.likes': [{ up: 20 }] },
        ],
      });
    });
  });
});

describe('Perform mutation from generic function', () => {
  test('Combined operations of remove, update and add', () => {
    const mutationObject = {
      posts: [
        {
          _id: 3,
          mentions: [
            {
              _id: 5,
              likes: [{ up: 10 }],
            },
            {
              _id: 6,
              likes: [{ up: 15 }],
            },
          ],
        },
        {
          _id: 7,
          mentions: [
            {
              _id: 8,
              likes: [{ up: 24 }],
            },
            {
              _id: 9,
              likes: [
                {
                  _id: 11,
                  _delete: true,
                },
                {
                  _id: 12,
                  up: 5,
                },
              ],
            },
          ],
        },
      ],
    };
    const statement = service.generateUpdateStatement(TEST_OBJECT, mutationObject);
    expect(statement).toStrictEqual({
      $update: { 'posts.3.mentions.1.likes.1.up': 5 },
      $remove: { 'posts.3.mentions.1.likes.0': true },
      $add: [
        { 'posts.1.mentions.0.likes': [{ up: 10 }] },
        { 'posts.1.mentions.1.likes': [{ up: 15 }] },
        { 'posts.3.mentions.0.likes': [{ up: 24 }] },
      ],
    });
  });

  test('Combined operations of remove, update and add for multiple mutation objects', () => {
    const mutationObject = {
      posts: [
        {
          _id: 3,
          mentions: [
            {
              _id: 5,
              likes: [{ up: 10 }],
            },
            {
              _id: 6,
              likes: [{ up: 15 }],
            },
          ],
        },
        {
          _id: 7,
          mentions: [
            {
              _id: 8,
              likes: [{ up: 24 }],
            },
            {
              _id: 9,
              likes: [
                {
                  _id: 11,
                  _delete: true,
                },
                {
                  _id: 12,
                  up: 5,
                },
              ],
            },
          ],
        },
      ],
      second_posts: [
        {
          _id: 3,
          mentions: [
            {
              _id: 5,
              likes: [{ up: 10 }],
            },
            {
              _id: 6,
              likes: [{ up: 15 }],
            },
          ],
        },
        {
          _id: 7,
          mentions: [
            {
              _id: 8,
              likes: [{ up: 24 }],
            },
            {
              _id: 9,
              likes: [
                {
                  _id: 11,
                  _delete: true,
                },
                {
                  _id: 12,
                  up: 5,
                },
              ],
            },
          ],
        },
      ],
    };
    const statement = service.generateUpdateStatement(TEST_OBJECT, mutationObject);
    expect(statement).toStrictEqual({
      $update: [
        { 'posts.3.mentions.1.likes.1.up': 5 },
        { 'second_posts.3.mentions.1.likes.1.up': 5 },
      ],
      $remove: [
        { 'posts.3.mentions.1.likes.0': true },
        { 'second_posts.3.mentions.1.likes.0': true },
      ],
      $add: [
        { 'posts.1.mentions.0.likes': [{ up: 10 }] },
        { 'posts.1.mentions.1.likes': [{ up: 15 }] },
        { 'posts.3.mentions.0.likes': [{ up: 24 }] },
        { 'second_posts.1.mentions.0.likes': [{ up: 10 }] },
        { 'second_posts.1.mentions.1.likes': [{ up: 15 }] },
        { 'second_posts.3.mentions.0.likes': [{ up: 24 }] },
      ],
    });
  });
});
