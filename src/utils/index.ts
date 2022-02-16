export const handlePostsException = (_id: number): void => {
  throw new Error(`cannot find index of post with _id ${_id}`);
};

export const handleMentionsException = (_id: number): void => {
  throw new Error(`cannot find index of mention with _id ${_id}`);
};
