import _ from 'lodash';
import { ADD, REMOVE, UPDATE } from '../utils/constants';

export const doesMutationContainArray = (mutationObject: { [key: string]: any }): boolean => {
  const keys = Object.keys(mutationObject);

  for (let i = 0; i < keys.length; i += 1) {
    if (_.isArray(mutationObject[keys[i]])) {
      return true;
    }
  }

  return false;
};

// We assume that the result will always be greater than -1
export const findObjectIndex = (
  arr: { [key: string]: any }[],
  obj: { [key: string]: any },
): number => arr.findIndex((item: { [key: string]: any }) => item._id === obj._id);

export const removeDocument = (
  document: { [key: string]: any },
  mutationObject: { [key: string]: any },
  parentKey: string,
  statement: { [key: string]: any },
  mutationKey?: string,
): { [key: string]: any } => {
  const index = findObjectIndex(document[parentKey], mutationObject);
  const mKey = mutationKey ? `${mutationKey}.${parentKey}.${index}` : `${parentKey}.${index}`;

  const operation: { [key: string]: any } = {};
  operation[mKey] = true;

  if (statement[REMOVE]) {
    if (_.isArray(statement[REMOVE])) {
      statement[REMOVE] = [...statement[REMOVE], { ...operation }];
    } else {
      statement[REMOVE] = [{ ...statement[REMOVE] }, { ...operation }];
    }
  } else {
    statement[REMOVE] = operation;
  }

  return statement;
};

export const updateDocument = (
  document: { [key: string]: any },
  mutationObject: { [key: string]: any },
  parentKey: string,
  statement: { [key: string]: any },
  mutationKey?: string,
): { [key: string]: any } => {
  const index = findObjectIndex(document[parentKey], mutationObject);
  let mKey = mutationKey ? `${mutationKey}.${parentKey}.${index}` : `${parentKey}.${index}`;

  // The mutation object here will always be of type { _id: number, key: value }
  // We get the key that isn't _id and construct the update operation
  const keys = Object.keys(mutationObject);
  const updateKey = keys.find((key: string) => key !== '_id');
  mKey += `.${updateKey}`;

  const operation: { [key: string]: any } = {};
  operation[mKey] = mutationObject[updateKey!];

  if (statement[UPDATE]) {
    if (_.isArray(statement[UPDATE])) {
      statement[UPDATE] = [...statement[UPDATE], { ...operation }];
    } else {
      statement[UPDATE] = [{ ...statement[UPDATE] }, { ...operation }];
    }
  } else {
    statement[UPDATE] = operation;
  }

  return statement;
};

export const addDocument = (
  mutationObject: { [key: string]: any },
  parentKey: string,
  statement: { [key: string]: any },
  mutationKey?: string,
): { [key: string]: any } => {
  const mKey = mutationKey ? `${mutationKey}.${parentKey}` : `${parentKey}`;
  const operation: { [key: string]: any } = {};

  // Mutation object will always be of type { key: value }
  operation[mKey] = [mutationObject];

  if (statement[ADD]) {
    if (_.isArray(statement[ADD])) {
      statement[ADD] = [...statement[ADD], { ...operation }];
    } else {
      statement[ADD] = [{ ...statement[ADD] }, { ...operation }];
    }
  } else {
    statement[ADD] = operation;
  }

  return statement;
};

/**
 * Depending on the mutation action required, this function executes that operation, returning
 * the output statement or for the case of nested subdocument array, recursively performs the
 * mutation opertion, returning the relevant statement.
 *
 * @param document the document object to search through during operation
 * @param mutationObject object with the mutation action required
 * @param parentKey the key of the subdocument array used to get relevants indexes
 * @param statement output operation statemenet
 * @param mutationKey key explaining path to operation used in constructing the output statement
 * @returns the operation(s) output statemenet
 */
export const performMutation = (
  document: { [key: string]: any },
  mutationObject: { [key: string]: any },
  parentKey: string,
  statement: { [key: string]: any },
  mutationKey?: string,
): { [key: string]: any } => {
  const keys = Object.keys(mutationObject);

  if (
    _.includes(keys, '_id')
    && _.includes(keys, '_delete')
    && doesMutationContainArray(mutationObject) === false
  ) {
    return removeDocument(document, mutationObject, parentKey, statement, mutationKey);
  }

  if (
    _.includes(keys, '_id')
    && !_.includes(keys, '_delete')
    && doesMutationContainArray(mutationObject) === false
  ) {
    return updateDocument(document, mutationObject, parentKey, statement, mutationKey);
  }

  if (
    !_.includes(keys, '_id')
    && !_.includes(keys, '_delete')
    && doesMutationContainArray(mutationObject) === false
  ) {
    return addDocument(mutationObject, parentKey, statement, mutationKey);
  }

  // For the sake of being generic, we're assumming that there may be more than one array
  // that requires mutation
  for (let i = 0; i < keys.length; i += 1) {
    if (_.isArray(mutationObject[keys[i]])) {
      const index = findObjectIndex(document[parentKey], mutationObject);
      const mKey = mutationKey ? `${mutationKey}.${parentKey}.${index}` : `${parentKey}.${index}`;

      for (let j = 0; j < mutationObject[keys[i]].length; j += 1) {
        performMutation(
          document[parentKey][index],
          mutationObject[keys[i]][j],
          keys[i],
          statement,
          mKey,
        );
      }
    }
  }

  return statement;
};

export const generateUpdateStatement = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
): { [key: string]: any } => {
  const statement = {};

  // In order to be generic, the assumption is we can have one or more high level subdocument
  // that require mutation
  const keys = Object.keys(mutation);
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = 0; j < mutation[keys[i]].length; j += 1) {
      performMutation(document, mutation[keys[i]][j], keys[i], statement);
    }
  }

  return statement;
};
