import { v4 as uuid4 } from 'uuid';

const Mutation = {
  createUser(parent, args, { db }) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);

    if (emailTaken) {
      throw new Error('Email is already taken.');
    }

    const user = {
      id: uuid4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },
  deleteUser(parent, args, { db }) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('No user found.');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match)
        db.comments = db.comments.filter((comment) => comment.post !== post.id);

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUsers;
  },
  updateUser(parent, args, { db }) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found.');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email is already taken');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    console.log(user);
    return user;
  },
  createPost(parent, args, { db, pubsub }) {
    const userExists = db.users.some((user) => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found.');
    }

    const post = {
      id: uuid4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post does not exists.');
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }

    return post;
  },
  updatePost(parent, args, { db, pubsub }) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error('Post does not exists!');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }) {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExists) {
      throw new Error('User not found.');
    } else if (!postExists) {
      throw new Error('Post does not exists or is not published');
    }

    const comment = {
      id: uuid4(),
      ...args.data,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(parent, { id, data }, { db, pubsub }) {
    const commentIndex = db.comments.findIndex((comment) => comment.id === id);

    if (commentIndex === -1) {
      throw new Error('Comment does not exists.');
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    });

    return deletedComment;
  },
  updateComment(parent, { id, data }, { db, pubsub }) {
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error('Comment does not exists.');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    console.log(comment);
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      },
    });
    return comment;
  },
};

export { Mutation as default };
