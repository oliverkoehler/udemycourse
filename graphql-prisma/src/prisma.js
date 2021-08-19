import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ id }');

  const user = await prisma.query.user({
    where: {
      id: authorId
    }
  }, '{ id name posts { id title published } }');

  return user;
};

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost({
    data: { ...data },
    where: { id: postId }
  }, '{ author { id } }');

  const user = await prisma.query.user({
    where: {
      id: post.author.id
    }
  }, '{ id name posts { id title published } }');

  return user;
};

// updatePostForUser('cksg22esv000r0a12ki8pa7li', {
//   title: 'not a nice day',
//   body: 'its raining'
// }).then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// });

// createPostForUser('cksd34i5c005a09128wuwf2vx', {
//   title: 'what i nice day',
//   body: 'its sunny',
//   published: true
// }).then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// });

prisma.exists.Comment({
  id: 'cksd3c6no00ao0912p3myt6gd'
}).then((comment) => {
  console.log(comment);
});