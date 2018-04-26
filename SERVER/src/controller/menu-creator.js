import nodemailer from 'nodemailer';
import { data } from '../db/data';

class MenuCreator {
  static addAMenu(req, res) {
    const selectedMeals = req.body.meals;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'ogedengbe123@gmail.com',
        pass: 'ayomide44',
      },
    });


    const menu = data.meals.map((meal) => {
      if (selectedMeals.includes(meal.id)) {
        return meal;
      }
      return null;
    }).filter(item => item !== null);

    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const todaysDate = `${month}/${day}/${year}`;
    const menuLen = data.menus.length;

    // search if menu is already added for the day
    const searchTodaysMenu = data.menus.findIndex(currentmenu => currentmenu.date === todaysDate);

    if (searchTodaysMenu === -1) {
      data.menus.push({
        id: menuLen + 1,
        meals: menu,
        date: todaysDate,
      });
      res.status(201).json({ success: true, msg: 'menu added sucessfully' });
      console.log(menu);
      const content = menu.reduce((initial, meal) => `
            ${initial} <tr>
              <td>${meal.name}</td>
              <td>${meal.price}</td>
              <td>${meal.type}</td>
              </tr>`, '');
      console.log(content);

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
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    } else {
      res.status(409).json({ success: false, msg: 'menu already set for the day' });
    }
  }
}

export default MenuCreator;
