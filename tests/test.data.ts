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
          likes: [],
        },
        {
          _id: 6,
          text: 'orange',
          likes: [],
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
          likes: [],
        },
        {
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
        },
        {
          _id: 10,
          text: 'grapes',
          likes: [],
        },
      ],
    },
  ],
  second_posts: [
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
          likes: [],
        },
        {
          _id: 6,
          text: 'orange',
          likes: [],
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
          likes: [],
        },
        {
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
        },
        {
          _id: 10,
          text: 'grapes',
          likes: [],
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

export const TEST_LIKES = {
  update: {
    posts: [{ _id: 7, mentions: [{ _id: 9, likes: [{ _id: 11, up: 22 }] }] }],
  },
  add: {
    posts: [{ _id: 3, mentions: [{ _id: 5, likes: [{ up: 15 }] }] }],
  },
  remove: {
    posts: [{ _id: 7, mentions: [{ _id: 9, likes: [{ _id: 12, _delete: true }] }] }],
  },
};

// {
//   $update: { 'posts.3.mentions.1.likes.1.up': 5 },
//   $remove: { 'posts.3.mentions.1.likes.0': true },
//   $add: [
//    { 'posts.1.mentions.0.likes': [{ up: 10 }] },
//    { 'posts.1.mentions.1.likes': [{ up: 15 }] },
//    { 'posts.3.mentions.0.likes': [{ up: 24 }] },
//   ],
// }
// {
//   posts: [
//     {
//       _id: 3,
//       mentions: [
//         {
//           _id: 5,
//           likes: [{ up: 10 }], // { posts.1.mentions.0.likes: [{ up: 10 }] }
//         },
//         {
//           _id: 6,
//           likes: [{ up: 15 }], // { posts.1.mentions.1.likes: [{ up: 15 }] }
//         },
//       ],
//     },
//     {
//       _id: 7,
//       mentions: [
//         {
//           _id: 8,
//           likes: [{ up: 24 }], // { posts.3.mentions.0.likes: [{ up: 24 }] }
//         },
//         {
//           _id: 9,
//           likes: [
//             {
//               _id: 11,
//               _delete: true, // { posts.3.mentions.1.likes.0: true }
//             },
//             {
//               _id: 12,
//               up: 5, // { posts.3.mentions.1.likes.1.up: 5 }
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }
