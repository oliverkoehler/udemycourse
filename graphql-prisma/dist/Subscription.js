"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Subscription = {
  comment: {
    subscribe: function subscribe(parent, _ref, _ref2) {
      var postId = _ref.postId;
      var db = _ref2.db,
          pubsub = _ref2.pubsub;
      var post = db.posts.find(function (post) {
        return post.id === postId && post.published;
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return pubsub.asyncIterator("comment ".concat(postId));
    }
  },
  post: {
    subscribe: function subscribe(parent, args, _ref3) {
      var pubsub = _ref3.pubsub;
      return pubsub.asyncIterator("post");
    }
  }
};
exports["default"] = Subscription;
//# sourceMappingURL=Subscription.js.map