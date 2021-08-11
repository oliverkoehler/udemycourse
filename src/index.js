import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
const typeDefs = `
    type Query {
        add(a: Float!, b: Float!): Float!
        greeting(name: String): String!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID
        title: String
        body: String
        published: Boolean
    }
`;

// Resolvers
const resolvers = {
    Query: {
        add() {
            return arguments[1].a + arguments[1].b;
        },
        greeting() {
            if (arguments[1].name) {
                return `Hello ${arguments[1].name}!`;
            } else {
                return "Hello unknown!";
            }
        },
        me() {
            return {
                id: "123",
                name: "Oliver",
                email: "test@test.de",
            };
        },
        post() {
            return {
                id: "t123",
                title: "test",
                body: "tesdasdasdasdasd",
                published: true,
            };
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
