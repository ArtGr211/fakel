db.createUser({
    user: 'db_user',
    pwd: 'qwerty',
    roles: [
        {
            role: 'readWrite',
            db: 'db'
        }
    ]
});
