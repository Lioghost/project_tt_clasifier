import bcrypt from 'bcrypt'

const usuarios = [
    {
        name: "leonel",
        username: "ghost",
        email: "lionxttrod@gmail.com",
        password: bcrypt.hashSync("12345", 10),
        role: "Admin",
        confirmado: 1
      }
]

export default usuarios;