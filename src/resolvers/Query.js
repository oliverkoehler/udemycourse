const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    me() {
        return {
            id: '123',
            name: 'Oliver',
            email: 'test@test.de',
        };
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }

        return db.posts.filter((post) => {
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
            id: 't123',
            title: 'test',
            body: 'tesdasdasdasdasd',
            published: true,
        };
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    },
};

export { Query as default };
