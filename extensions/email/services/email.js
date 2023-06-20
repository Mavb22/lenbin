const nodemailer = require('nodemailer');

module.exports = {
  send: async ({ to, from, subject, html }) => {
    // Configura el transporte de correo
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.USEREMAIL, // generated ethereal user
        pass: process.env.PASSWORDEMAIL // generated ethereal password
      },
    });

    // Definir los detalles del correo electrónico
    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    // Enviar el correo electrónico
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado:', info.response);
      return info;
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
      throw error;
    }
  },
};
