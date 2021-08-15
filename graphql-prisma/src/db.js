const users = [
    {
        id: '1',
        name: 'Olli',
        email: 'olli9622@gmail.com',
        age: 25,
    },
    {
        id: '2',
        name: 'Petra',
        email: 'test@test.de',
        age: 58,
    },
    {
        id: '3',
        name: 'Celli',
        email: 'tesesdasd',
        age: 35,
    },
    {
        id: '4',
        name: 'Celli',
        email: 'dasdasdasd',
        age: 352,
    },
];

const posts = [
    {
        id: '11',
        title: 'Test enty',
        body: 'Just a test',
        published: true,
        author: '3',
    },
    {
        id: '12',
        title: 'Secret',
        body: 'Just a test',
        published: true,
        author: '2',
    },
    {
        id: '13',
        title: 'Top secret',
        body: 'Just a test',
        published: true,
        author: '2',
    },
];

const comments = [
    {
        id: '101',
        text: 'nice post!',
        author: '1',
        post: '12',
    },
    {
        id: '102',
        text: 'good job!',
        author: '1',
        post: '12',
    },
    {
        id: '103',
        text: 'thanks!',
        author: '4',
        post: '11',
    },
    {
        id: '104',
        text: 'wow!',
        author: '2',
        post: '13',
    },
];

const db = {
    users,
    posts,
    comments,
};

export { db as default };
