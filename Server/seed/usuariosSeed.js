import bcrypt from 'bcrypt'

const usuarios = [
    {
        name: "goku",
        lastname: "palacios",
        username: "ghost",
        email: "broly@gmail.com",
        password: bcrypt.hashSync("12345", 10),
        role: "Admin",
        confirmado: 1
      },
      {
        name: "broly",
        lastname: "tamayo",
        username: "cyber-punk",
        email: "lionxttrod@gmail.com",
        password: bcrypt.hashSync("12345", 10),
        role: "Client",
        confirmado: 1
      }
]

export default usuarios;