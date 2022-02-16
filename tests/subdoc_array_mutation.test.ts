import { ADD, REMOVE, UPDATE } from '../src/utils/constants';
import * as services from '../src/services/subdoc_array_mutations.service';
import { TEST_MENTIONS, TEST_OBJECT, TEST_POSTS } from './test.data';

describe('Determine the object type being operated on', () => {
  test('that input is for operation on posts', () => {
    let isPostsOperation: boolean = services.determineObjectType(TEST_POSTS.add.posts[0]);
    expect(!isPostsOperation).toBe(true);

    isPostsOperation = services.determineObjectType(TEST_POSTS.update.posts[0]);
    expect(!isPostsOperation).toBe(true);

    isPostsOperation = services.determineObjectType(TEST_POSTS.remove.posts[0]);
    expect(!isPostsOperation).toBe(true);
  });

  test('that input is for operation on mentions', () => {
    let isMentionsOperation: boolean = services.determineObjectType(TEST_MENTIONS.add.posts[0]);
    expect(isMentionsOperation).toBe(true);

    isMentionsOperation = services.determineObjectType(TEST_MENTIONS.update.posts[0]);
    expect(isMentionsOperation).toBe(true);

    isMentionsOperation = services.determineObjectType(TEST_MENTIONS.remove.posts[0]);
    expect(isMentionsOperation).toBe(true);
  });
});

describe('Determine the operation type based on input object', () => {
  test('that operation type is delete', () => {
    const postsOperationType: string = services.determineOpertionType(TEST_POSTS.remove.posts[0],
      true);
    const mentionsOperationType: string = services.determineOpertionType(
      TEST_MENTIONS.remove.posts[0], false,
    );

    expect(postsOperationType).toBe(REMOVE);
    expect(mentionsOperationType).toBe(REMOVE);
  });

  test('that operation type is update', () => {
    const postsOperationType: string = services.determineOpertionType(TEST_POSTS.update.posts[0],
      true);
    const mentionsOperationType: string = services.determineOpertionType(
      TEST_MENTIONS.update.posts[0],
      false,
    );

    expect(postsOperationType).toBe(UPDATE);
    expect(mentionsOperationType).toBe(UPDATE);
  });

  test('that operation type is add', () => {
    const postsOperationType: string = services.determineOpertionType(TEST_POSTS.add.posts[0],
      true);
    const mentionsOperationType: string = services.determineOpertionType(
      TEST_MENTIONS.add.posts[0], false,
    );

    expect(postsOperationType).toBe(ADD);
    expect(mentionsOperationType).toBe(ADD);
  });
});

describe('Test operations on input object', () => {
  describe('Test update operations', () => {
    test('update operation on posts', () => {
      const postUpdate: { [key: string]: any } = services.updateDocument(
        TEST_OBJECT,
        TEST_POSTS.update.posts[0],
        true,
      );
      expect(postUpdate).toStrictEqual({ $update: { 'posts.0.value': TEST_POSTS.update.posts[0].value } });
    });

    test('update operation on mentions', () => {
      const mentionUpdate: { [key: string]: any } = services.updateDocument(
        TEST_OBJECT,
        TEST_MENTIONS.update.posts[0],
        false,
      );
      expect(mentionUpdate).toStrictEqual({
        $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
      });
    });
  });

  describe('Test add operations', () => {
    test('add operation on posts', () => {
      const postAdd: { [key: string]: any } = services.addDocument(
        TEST_OBJECT,
        TEST_POSTS.add.posts[0],
        true,
      );
      expect(postAdd).toStrictEqual({ $add: TEST_POSTS.add });
    });

    test('add operation on mentions', () => {
      const mentionAdd: { [key: string]: any } = services.addDocument(
        TEST_OBJECT,
        TEST_MENTIONS.add.posts[0],
        false,
      );
      expect(mentionAdd).toStrictEqual({
        $add: { 'posts.2.mentions': TEST_MENTIONS.add.posts[0].mentions },
      });
    });
  });

  describe('Test remove operations', () => {
    test('remove operation on posts', () => {
      const postRemove: { [key: string]: any } = services.removeDocument(
        TEST_OBJECT,
        TEST_POSTS.remove.posts[0],
        true,
      );
      expect(postRemove).toStrictEqual({ $remove: { 'posts.3': true } });
    });

    test('remove operation on mention', () => {
      const mentionRemove: { [key: string]: any } = services.removeDocument(
        TEST_OBJECT,
        TEST_MENTIONS.remove.posts[0],
        false,
      );
      expect(mentionRemove).toStrictEqual({ $remove: { 'posts.3.mentions.1': true } });
    });
  });
});

describe('Perform test on generic routine', () => {
  test('generic routine on update posts', () => {
    const postUpdate: { [key: string]: any } = services.generateUpdateStatement(
      TEST_OBJECT,
      TEST_POSTS.update,
    );
    expect(postUpdate).toStrictEqual({
      $update: { 'posts.0.value': TEST_POSTS.update.posts[0].value },
    });
  });

  test('generic routine to update mentions', () => {
    const mentionUpdate: { [key: string]: any } = services.generateUpdateStatement(
      TEST_OBJECT,
      TEST_MENTIONS.update,
    );
    expect(mentionUpdate).toStrictEqual({
      $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
    });
  });

  test('generic routine to add posts', () => {
    const postAdd: { [key: string]: any } = services.generateUpdateStatement(
      TEST_OBJECT,
      TEST_POSTS.add,
    );
    expect(postAdd).toStrictEqual({ $add: TEST_POSTS.add });
  });

  test('generic routine to add mentions', () => {
    const mentionAdd: { [key: string]: any } = services.generateUpdateStatement(
      TEST_OBJECT,
      TEST_MENTIONS.add,
    );
    expect(mentionAdd).toStrictEqual({
      $add: { 'posts.2.mentions': TEST_MENTIONS.add.posts[0].mentions },
    });
  });

  test('generic routine to remove posts', () => {
    const postRemove: { [key: string]: any } = services.generateUpdateStatement(
      TEST_OBJECT,
      TEST_POSTS.remove,
    );
    expect(postRemove).toStrictEqual({ $remove: { 'posts.3': true } });
  });

  test('generic routine to remove mentions', () => {
    const mentionRemove: { [key: string]: any } = services.generateUpdateStatement(
      TEST_OBJECT,
      TEST_MENTIONS.remove,
    );
    expect(mentionRemove).toStrictEqual({ $remove: { 'posts.3.mentions.1': true } });
  });

  test('generic routine to perform combined operation on a single document', () => {
    const test_obj_posts = {
      posts: [TEST_POSTS.add.posts[0], TEST_POSTS.update.posts[0], TEST_POSTS.remove.posts[0]],
    };

    let statement = services.generateUpdateStatement(TEST_OBJECT, test_obj_posts);
    expect(statement).toStrictEqual({
      $add: { posts: TEST_POSTS.add.posts },
      $update: { 'posts.0.value': TEST_POSTS.update.posts[0].value },
      $remove: { 'posts.3': true },
    });

    const test_obj_mentions = {
      posts: [TEST_MENTIONS.add.posts[0], TEST_MENTIONS.update.posts[0],
        TEST_MENTIONS.remove.posts[0]],
    };
    statement = services.generateUpdateStatement(TEST_OBJECT, test_obj_mentions);
    expect(statement).toStrictEqual({
      $add: { 'posts.2.mentions': TEST_MENTIONS.add.posts[0].mentions },
      $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
      $remove: { 'posts.3.mentions.1': true },
    });

    const test_obj_combined = {
      posts: [TEST_POSTS.add.posts[0], TEST_MENTIONS.update.posts[0],
        TEST_MENTIONS.remove.posts[0]],
    };
    statement = services.generateUpdateStatement(TEST_OBJECT, test_obj_combined);
    expect(statement).toStrictEqual({
      $add: { posts: TEST_POSTS.add.posts },
      $update: { 'posts.1.mentions.0.text': TEST_MENTIONS.update.posts[0].mentions[0].text },
      $remove: { 'posts.3.mentions.1': true },
    });
  });
});
