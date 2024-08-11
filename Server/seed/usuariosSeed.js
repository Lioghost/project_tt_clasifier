import bcrypt from 'bcrypt'

const usuarios = [
    {
        name: "leonel",
        username: "ghost",
        email: "broly@gmail.com",
        password: bcrypt.hashSync("12345", 10),
        role: "Admin",
        confirmado: 1
      },
      {
        name: "emilio",
        username: "cyber-punk",
        email: "goku@gmail.com",
        password: bcrypt.hashSync("12345", 10),
        role: "Client",
        confirmado: 1
      }
]

export default usuarios;