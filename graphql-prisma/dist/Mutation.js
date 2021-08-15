"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _uuid = require("uuid");

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var Mutation = {
  createUser: function createUser(parent, args, _ref) {
    var db = _ref.db;
    var emailTaken = db.users.some(function (user) {
      return user.email === args.data.email;
    });

    if (emailTaken) {
      throw new Error('Email is already taken.');
    }

    var user = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.users.push(user);
    return user;
  },
  deleteUser: function deleteUser(parent, args, _ref2) {
    var db = _ref2.db;
    var userIndex = db.users.findIndex(function (user) {
      return user.id === args.id;
    });

    if (userIndex === -1) {
      throw new Error('No user found.');
    }

    var deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(function (post) {
      var match = post.author === args.id;
      if (match) db.comments = db.comments.filter(function (comment) {
        return comment.post !== post.id;
      });
      return !match;
    });
    db.comments = db.comments.filter(function (comment) {
      return comment.author !== args.id;
    });
    return deletedUsers;
  },
  updateUser: function updateUser(parent, args, _ref3) {
    var db = _ref3.db;
    var id = args.id,
        data = args.data;
    var user = db.users.find(function (user) {
      return user.id === id;
    });

    if (!user) {
      throw new Error('User not found.');
    }

    if (typeof data.email === 'string') {
      var emailTaken = db.users.some(function (user) {
        return user.email === data.email;
      });

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
  createPost: function createPost(parent, args, _ref4) {
    var db = _ref4.db,
        pubsub = _ref4.pubsub;
    var userExists = db.users.some(function (user) {
      return user.id === args.data.author;
    });

    if (!userExists) {
      throw new Error('User not found.');
    }

    var post = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: 'CREATED',
          data: post
        }
      });
    }

    return post;
  },
  deletePost: function deletePost(parent, args, _ref5) {
    var db = _ref5.db,
        pubsub = _ref5.pubsub;
    var postIndex = db.posts.findIndex(function (post) {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error('Post does not exists.');
    }

    var _db$posts$splice = db.posts.splice(postIndex, 1),
        _db$posts$splice2 = _slicedToArray(_db$posts$splice, 1),
        post = _db$posts$splice2[0];

    db.comments = db.comments.filter(function (comment) {
      return comment.post !== args.id;
    });

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }

    return post;
  },
  updatePost: function updatePost(parent, args, _ref6) {
    var db = _ref6.db,
        pubsub = _ref6.pubsub;
    var id = args.id,
        data = args.data;
    var post = db.posts.find(function (post) {
      return post.id === id;
    });

    var originalPost = _objectSpread({}, post);

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
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        });
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      });
    }

    return post;
  },
  createComment: function createComment(parent, args, _ref7) {
    var db = _ref7.db,
        pubsub = _ref7.pubsub;
    var userExists = db.users.some(function (user) {
      return user.id === args.data.author;
    });
    var postExists = db.posts.some(function (post) {
      return post.id === args.data.post && post.published;
    });

    if (!userExists) {
      throw new Error('User not found.');
    } else if (!postExists) {
      throw new Error('Post does not exists or is not published');
    }

    var comment = _objectSpread({
      id: (0, _uuid.v4)()
    }, args.data);

    db.comments.push(comment);
    pubsub.publish("comment ".concat(args.data.post), {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    });
    return comment;
  },
  deleteComment: function deleteComment(parent, _ref8, _ref9) {
    var id = _ref8.id,
        data = _ref8.data;
    var db = _ref9.db,
        pubsub = _ref9.pubsub;
    var commentIndex = db.comments.findIndex(function (comment) {
      return comment.id === id;
    });

    if (commentIndex === -1) {
      throw new Error('Comment does not exists.');
    }

    var _db$comments$splice = db.comments.splice(commentIndex, 1),
        _db$comments$splice2 = _slicedToArray(_db$comments$splice, 1),
        deletedComment = _db$comments$splice2[0];

    pubsub.publish("comment ".concat(deletedComment.post), {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    });
    return deletedComment;
  },
  updateComment: function updateComment(parent, _ref10, _ref11) {
    var id = _ref10.id,
        data = _ref10.data;
    var db = _ref11.db,
        pubsub = _ref11.pubsub;
    var comment = db.comments.find(function (comment) {
      return comment.id === id;
    });

    if (!comment) {
      throw new Error('Comment does not exists.');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    console.log(comment);
    pubsub.publish("comment ".concat(comment.post), {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    });
    return comment;
  }
};
exports["default"] = Mutation;
//# sourceMappingURL=Mutation.js.map