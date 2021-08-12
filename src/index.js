import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

// TODO: Get Users from DB
const users = [
    {
        id: "1",
        name: "Olli",
        email: "olli9622@gmail.com",
        age: 25,
    },
    {
        id: "2",
        name: "Petra",
        email: "test@test.de",
        age: 58,
    },
    {
        id: "3",
        name: "Celli",
        email: "tesesdasd",
        age: 35,
    },
    {
        id: "4",
        name: "Celli",
        email: "dasdasdasd",
        age: 352,
    },
];

const posts = [
    {
        id: "11",
        title: "Test enty",
        body: "Just a test",
        published: true,
        author: "3",
    },
    {
        id: "12",
        title: "Secret",
        body: "Just a test",
        published: true,
        author: "2",
    },
    {
        id: "13",
        title: "Top secret",
        body: "Just a test",
        published: true,
        author: "2",
    },
];

const comments = [
    {
        id: "101",
        text: "nice post!",
        author: "1",
        post: "12",
    },
    {
        id: "102",
        text: "good job!",
        author: "1",
        post: "12",
    },
    {
        id: "103",
        text: "thanks!",
        author: "4",
        post: "11",
    },
    {
        id: "104",
        text: "wow!",
        author: "2",
        post: "13",
    },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        post: Post!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String!,
        email: String!, 
        age: Int
    }

    input CreatePostInput {
        title: String!, 
        body: String!, 
        published: Boolean!, 
        author: ID!
    }

    input CreateCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String
        body: String
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter((user) => {
                return user.name
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
            });
        },
        me() {
            return {
                id: "123",
                name: "Oliver",
                email: "test@test.de",
            };
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title
                    .toLowerCase()
                    .includes(args.query.toLowerCase());
                const isBodyMatch = post.body
                    .toLowerCase()
                    .includes(args.query.toLowerCase());

                return isTitleMatch || isBodyMatch;
            });
        },
        post() {
            return {
                id: "t123",
                title: "test",
                body: "tesdasdasdasdasd",
                published: true,
            };
        },
        comments() {
            return comments;
        },
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(
                (user) => user.email === args.data.email
            );

            if (emailTaken) {
                throw new Error("Email is already taken.");
            }

            const user = {
                id: uuidv4(),
                ...args.data,
            };

            users.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(
                (user) => user.id === args.data.author
            );

            if (!userExists) {
                throw new Error("User not found.");
            }

            const post = {
                id: uuidv4(),
                ...args.data,
            };

            posts.push(post);

            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(
                (user) => user.id === args.data.author
            );
            const postExists = posts.some(
                (post) => post.id === args.data.post && post.published
            );

            if (!userExists) {
                throw new Error("User not found.");
            } else if (!postExists) {
                throw new Error("Post does not exists or is not published");
            }

            const comment = {
                id: uuidv4(),
                ...args.data,
            };

            comments.push(comment);

            return comment;
        },
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        comments(parent, argx, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            });
        },
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
        },
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author;
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post;
            });
        },
    },
};

const server = new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

server.start(() => {
    console.log("Server is up and running...");
});
