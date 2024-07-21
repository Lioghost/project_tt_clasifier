import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path: '../../env'});

const emailRegistro = async (datos) => {
    //Datos de nodemailtrap
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    //Datos se pasar de usuarioController en envio de email
    const { username, email, token } = datos

      //Enviar email
      //El "transport permite autencacion, y acceder a los servicios de mailtrap y brinda acceso a una funcion 'sendMail'"
    await transport.sendMail({      //Configuracion del email, que cuenta lo envia
        from: 'GesketGenious.com',
        to: email,
        subject: 'Confirma tu Cuenta en GasketGenious.com',
        text: 'Confirma tu Cuenta en GasketGenious.com',
        html: `
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border: 1px solid #dddddd;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: center;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              display: inline-block;
              margin-top: 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Confirma tu correo electrónico</h1>
            </div>
            <div class="content">
              <p>Gracias por registrarte <b>${username}</b>. Por favor, confirma tu correo electrónico haciendo clic en el siguiente botón:</p>
              <a href="${process.env.BACKEND_URL}:${process.env.PORT_FRONT ?? 3000}/auth/confirmar/${token}" class="button">Confirmar correo electrónico</a>
              <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
            </div>
          </div>
        </body>
      `
      });

}

const emailOlvidePassword = async (datos) => {
  //Datos de nodemailtrap
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

  const { username, email, token } = datos

    //Enviar email
  await transport.sendMail({      //Configuracion del email, que cuenta lo envia
      from: 'GaskeGenious.com',
      to: email,
      subject: 'Restablece tu Password en GesketGenious.com',
      text: 'Restablece tu Password en GasketGenious.com',
      html: `
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border: 1px solid #dddddd;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 10px;
              text-align: center;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .button {
              background-color: #4CAF50;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              display: inline-block;
              margin-top: 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Restablece tu Password</h1>
            </div>
            <div class="content">
              <p>Hola <b>${username}</b>, has solicitado restablecer tu password en GesketGenious.com</p>
              <p>Sigue el siguiente enlace para generar un password nuevo:</p>
              <a href="${process.env.BACKEND_URL}:${process.env.PORT_FRONT ?? 3000}/auth/olvide-password/${token}" class="button">Restablecer Password</a>
              <p>Si tu no solicitaste el cambio de password, puedes ignorar este mensaje</p>
            </div>
          </div>
        </body>
      `
  });
}

export {
  emailRegistro,
  emailOlvidePassword
}