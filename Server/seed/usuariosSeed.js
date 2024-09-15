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
      },
      {
        name: "Daniel Olmos",
        lastname: "Gutiérrez",
        username: "DanielOlmos123",
        email: "lotsaparrot93@gmail.com",
        password: bcrypt.hashSync("MineZero_123", 10),
        role: "Client",
        confirmado: 1
      }
]

export default usuarios;