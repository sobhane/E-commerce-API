const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?email=${email}&token=${token}`;

  const message = `<p>Please reset your password by clicking in the following link : <a href='${resetURL}'>reset</a></p>`;

  return sendEmail({
    to: email,
    subject: "reseting Password",
    html: `<h4>Hello ,${name}</h4>
    ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
