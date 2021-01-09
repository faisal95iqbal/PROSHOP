import bcrypt from 'bcryptjs'

const users = [
    {
    name: 'admin user',
    email: 'admin@example.com',
    password: bcrypt.hashSync('12345',10),
    isAdmin:true
    },
     {
    name: 'user 1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('12345',10)
    },
      {
    name: 'user 2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('12345',10)
    }
]

export default users