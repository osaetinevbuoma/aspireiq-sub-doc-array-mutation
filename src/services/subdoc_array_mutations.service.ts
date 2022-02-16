import _ from 'lodash';
import { handleMentionsException, handlePostsException } from '../utils';
import { ADD, REMOVE, UPDATE } from '../utils/constants';

export const determineObjectType = (
  mutation: { [key: string]: any },
): boolean => _.hasIn(mutation, 'mentions');

export const determineOpertionType = (
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): string => {
  if (isPostsOperation) {
    if (_.has(mutation, '_delete') && _.has(mutation, '_id')) {
      return REMOVE;
    }

    if (!_.has(mutation, '_delete') && _.has(mutation, '_id')) {
      return UPDATE;
    }

    if (!_.has(mutation, '_delete') && !_.has(mutation, '_id')) {
      return ADD;
    }
  } else {
    if (
      _.has(mutation.mentions[0], '_delete')
      && _.has(mutation.mentions[0], '_id')
    ) {
      return REMOVE;
    }

    if (
      !_.has(mutation.mentions[0], '_delete')
      && _.has(mutation.mentions[0], '_id')
    ) {
      return UPDATE;
    }

    if (
      !_.has(mutation.mentions[0], '_delete')
      && !_.has(mutation.mentions[0], '_id')
    ) {
      return ADD;
    }
  }

  return '';
};

export const updateDocument = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): { [key: string]: any } => {
  const output: { [key: string]: any } = {};
  const statement: { [key: string]: any } = {};

  const postIndex: number = _.findIndex(
    document.posts,
    (post: { [key: string]: any }) => post._id === mutation._id,
  );
  if (postIndex === -1) {
    handlePostsException(mutation._id);
  }

  if (isPostsOperation) {
    statement[`posts.${postIndex}.value`] = mutation.value;
    output[`${UPDATE}`] = statement;
    return output;
  }

  const post = document.posts[postIndex];
  const mentionsIndexInPost: number = _.findIndex(
    post.mentions,
    (mention: { [key: string]: any }) => mention._id === mutation.mentions[0]._id,
  );
  if (mentionsIndexInPost === -1) {
    handleMentionsException(mutation._id);
  }

  statement[`posts.${postIndex}.mentions.${mentionsIndexInPost}.text`] = mutation.mentions[0].text;
  output[`${UPDATE}`] = statement;
  return output;
};

export const addDocument = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): { [key: string]: any } => {
  if (isPostsOperation) {
    const output: { [key: string]: any } = {};
    output[`${ADD}`] = { posts: [{ value: mutation.value }] };
    return output;
  }

  const postIndex: number = _.findIndex(document.posts,
    (post: { [key: string]: any }) => post._id === mutation._id);
  if (postIndex === -1) {
    handlePostsException(mutation._id);
  }

  const statement: { [key: string]: any } = {};
  statement[`posts.${postIndex}.mentions`] = [{ text: mutation.mentions[0].text }];

  const output: { [key: string]: any } = {};
  output[`${ADD}`] = statement;
  return output;
};

export const removeDocument = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): { [key: string]: any } => {
  const output: { [key: string]: any } = {};
  const statement: { [key: string]: any } = {};

  const postIndex: number = _.findIndex(
    document.posts,
    (post: { [key: string]: any }) => post._id === mutation._id,
  );
  if (postIndex === -1) {
    handlePostsException(mutation._id);
  }

  if (isPostsOperation) {
    statement[`posts.${postIndex}`] = true;
    output[`${REMOVE}`] = statement;
    return output;
  }

  const post = document.posts[postIndex];
  const mentionsIndexInPost: number = _.findIndex(
    post.mentions,
    (mention: { [key: string]: any }) => mention._id === mutation.mentions[0]._id,
  );
  if (mentionsIndexInPost === -1) {
    handleMentionsException(mutation._id);
  }

  statement[`posts.${postIndex}.mentions.${mentionsIndexInPost}`] = true;
  output[`${REMOVE}`] = statement;
  return output;
};

export const generateUpdateStatement = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
): { [key: string]: any } => {
  let statement = {};

  for (let i = 0; i < mutation.posts.length; i += 1) {
    const post = mutation.posts[i];
    const isPostsOperation = !determineObjectType(post);
    const operationType = determineOpertionType(post, isPostsOperation);

    switch (operationType) {
      case ADD: {
        const addStatement = addDocument(document, post, isPostsOperation);
        statement = { ...statement, ...addStatement };
        break;
      }
      case UPDATE: {
        const updateStatement = updateDocument(document, post, isPostsOperation);
        statement = { ...statement, ...updateStatement };
        break;
      }
      case REMOVE: {
        const removeStatement = removeDocument(document, post, isPostsOperation);
        statement = { ...statement, ...removeStatement };
        break;
      }
      default:
        statement = { ...statement };
    }
  }

  return statement;
};
