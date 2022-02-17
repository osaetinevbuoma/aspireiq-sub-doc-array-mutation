import _ from 'lodash';
import IContentCreator from 'src/interfaces/IContentCreator';
import IMention from '../interfaces/IMention';
import IPost from '../interfaces/IPost';
import { handleMentionsException, handlePostsException } from '../utils';
import { ADD, REMOVE, UPDATE } from '../utils/constants';

export const determineObjectType = (
  mutation: IPost,
): boolean => _.hasIn(mutation, 'mentions');

export const determineOpertionType = (
  mutation: IPost,
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
      _.has(mutation.mentions![0], '_delete')
      && _.has(mutation.mentions![0], '_id')
    ) {
      return REMOVE;
    }

    if (
      !_.has(mutation.mentions![0], '_delete')
      && _.has(mutation.mentions![0], '_id')
    ) {
      return UPDATE;
    }

    if (
      !_.has(mutation.mentions![0], '_delete')
      && !_.has(mutation.mentions![0], '_id')
    ) {
      return ADD;
    }
  }

  return '';
};

export const updateDocument = (
  document: IContentCreator,
  mutation: IPost,
  isPostsOperation: boolean,
): { [key: string]: string } => {
  const output: { [key: string]: any } = {};
  const statement: { [key: string]: string | undefined } = {};

  const postIndex: number = _.findIndex(
    document.posts,
    (post: IPost) => post._id === mutation._id,
  );
  if (postIndex === -1) {
    handlePostsException(mutation._id!);
  }

  if (isPostsOperation) {
    statement[`posts.${postIndex}.value`] = mutation.value;
    output[`${UPDATE}`] = statement;
    return output;
  }

  const post = document.posts[postIndex];
  const mentionsIndexInPost: number = _.findIndex(
    post.mentions,
    (mention: IMention) => mention._id === mutation.mentions![0]._id,
  );
  if (mentionsIndexInPost === -1) {
    handleMentionsException(mutation._id!);
  }

  statement[`posts.${postIndex}.mentions.${mentionsIndexInPost}.text`] = mutation.mentions![0].text;
  output[`${UPDATE}`] = statement;
  return output;
};

export const addDocument = (
  document: IContentCreator,
  mutation: IPost,
  isPostsOperation: boolean,
): { [key: string]: string } => {
  if (isPostsOperation) {
    const output: { [key: string]: any } = {};
    output[`${ADD}`] = { posts: [{ value: mutation.value }] };
    return output;
  }

  const postIndex: number = _.findIndex(document.posts,
    (post: IPost) => post._id === mutation._id);
  if (postIndex === -1) {
    handlePostsException(mutation._id!);
  }

  const statement: { [key: string]: any } = {};
  statement[`posts.${postIndex}.mentions`] = [{ text: mutation.mentions![0].text }];

  const output: { [key: string]: any } = {};
  output[`${ADD}`] = statement;
  return output;
};

export const removeDocument = (
  document: IContentCreator,
  mutation: IPost,
  isPostsOperation: boolean,
): { [key: string]: string } => {
  const output: { [key: string]: any } = {};
  const statement: { [key: string]: boolean | undefined } = {};

  const postIndex: number = _.findIndex(
    document.posts,
    (post: IPost) => post._id === mutation._id,
  );
  if (postIndex === -1) {
    handlePostsException(mutation._id!);
  }

  if (isPostsOperation) {
    statement[`posts.${postIndex}`] = true;
    output[`${REMOVE}`] = statement;
    return output;
  }

  const post = document.posts[postIndex];
  const mentionsIndexInPost: number = _.findIndex(
    post.mentions,
    (mention: IMention) => mention._id === mutation.mentions![0]._id,
  );
  if (mentionsIndexInPost === -1) {
    handleMentionsException(mutation._id!);
  }

  statement[`posts.${postIndex}.mentions.${mentionsIndexInPost}`] = true;
  output[`${REMOVE}`] = statement;
  return output;
};

export const generateUpdateStatement = (
  document: IContentCreator,
  mutation: { [key: string]: IPost[] },
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
