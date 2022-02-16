export const generateUpdateStatement = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
): { [key: string]: any } => ({ key: 'value' });

export const determineObjectType = (mutation: { [key: string]: any }): boolean => false;

export const determineOpertionType = (mutation: { [key: string]: any }): string => '';

export const updateDocument = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): { [key: string]: any } => ({ key: 'value' });

export const addDocument = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): { [key: string]: any } => ({ key: 'value' });

export const removeDocument = (
  document: { [key: string]: any },
  mutation: { [key: string]: any },
  isPostsOperation: boolean,
): { [key: string]: any } => ({ key: 'value' });
