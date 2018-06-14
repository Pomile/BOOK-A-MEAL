import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

exports.sendMenuNotification = (req, res) => {
  const { menu } = req;
  // console.log(menu);
  const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: 'ogedengbe123@gmail.com',
      pass: 'ayomide44',
    },
  }));

  const content = menu.reduce((initial, meal) => `
            ${initial} <tr>
              <td>${meal.name}</td>
              <td>${meal.price}</td>
              <td>${meal.category}</td>
              </tr>`, '');

  const mailOptions = {
    from: 'ogedengbe123@gmail.com',
    to: 'soft-sky@live.co.uk',
    subject: 'Todays Menu',
    html: `<div>
        <table>
          <thead>
            <tr>
              <th>Meals</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
          ${content}
          </tbody>
        </table>
        <p>Thank you</p>
        <p>Babatunde Ogedengbe</p>
        <h3>@andela-bootcamp-project</h3>
      </div>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(201).json({ success: true, msg: 'menu is set sucessfully but users are not notified', err: error.message });
    } else {
      res.status(201).json({ success: true, msg: 'menu is set sucessfully and customers are notified' });
      console.log(`Email sent: ${info.response}`);
    }
  });
};
