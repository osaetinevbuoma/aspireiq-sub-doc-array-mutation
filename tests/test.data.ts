export const TEST_OBJECT = {
  _id: 1,
  name: 'Johnny Content Creator',
  posts: [
    {
      _id: 2,
      value: 'one',
      mentions: [],
    },
    {
      _id: 3,
      value: 'two',
      mentions: [
        {
          _id: 5,
          text: 'apple',
        },
        {
          _id: 6,
          text: 'orange',
        },
      ],
    },
    {
      _id: 4,
      value: 'three',
      mentions: [],
    },
    {
      _id: 7,
      value: 'four',
      mentions: [
        {
          _id: 8,
          text: 'plum',
        },
        {
          _id: 9,
          text: 'avocado',
        },
        {
          _id: 10,
          text: 'grapes',
        },
      ],
    },
  ],
};

export const TEST_POSTS = {
  update: {
    posts: [{ _id: 2, value: 'too' }],
  },
  add: {
    posts: [{ value: 'four' }],
  },
  remove: {
    posts: [{ _id: 7, _delete: true }],
  },
};

export const TEST_MENTIONS = {
  update: {
    posts: [{ _id: 3, mentions: [{ _id: 5, text: 'pear' }] }],
  },
  add: {
    posts: [{ _id: 4, mentions: [{ text: 'banana' }] }],
  },
  remove: {
    posts: [{ _id: 7, mentions: [{ _id: 9, _delete: true }] }],
  },
};
