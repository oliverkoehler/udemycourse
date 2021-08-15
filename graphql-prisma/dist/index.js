"use strict";

var _graphqlYoga = require("graphql-yoga");

var _db = _interopRequireDefault(require("./db"));

var _Query = _interopRequireDefault(require("./resolvers/Query"));

var _Mutation = _interopRequireDefault(require("./resolvers/Mutation"));

var _User = _interopRequireDefault(require("./resolvers/User"));

var _Post = _interopRequireDefault(require("./resolvers/Post"));

var _Comment = _interopRequireDefault(require("./resolvers/Comment"));

var _Subscription = _interopRequireDefault(require("./resolvers/Subscription"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var pubsub = new _graphqlYoga.PubSub();
var server = new _graphqlYoga.GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query: _Query["default"],
    Mutation: _Mutation["default"],
    Subscription: _Subscription["default"],
    User: _User["default"],
    Post: _Post["default"],
    Comment: _Comment["default"]
  },
  context: {
    db: _db["default"],
    pubsub: pubsub
  }
});
server.start(function () {
  console.log('Server is up and running...');
});
//# sourceMappingURL=index.js.map