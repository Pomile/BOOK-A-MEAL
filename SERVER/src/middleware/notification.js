import nodemailer from 'nodemailer';
import fs from 'fs';
import { google } from 'googleapis';
import opn from 'opn';
import { Meals, MealMenus, Menus } from '../models';

const clientId = '689151234993-7bcjnid76h639skieoqc4qkiafv8hbi6.apps.googleusercontent.com';
const clientSecret = 'mVi2uY6_cxgthdoG1L8sG0l5';
const redirectUri = 'http://localhost:8000/api/v1/auth/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri,
);

exports.storeAuth = async (req, res, next) => {
  const { code } = req.query;
  if (code !== undefined) {
    await fs.writeFileSync(
      `${__dirname}/../../specs/googleAuthCode.json`,
      JSON.stringify({ code }, null, 2),
      'utf-8',
    );
    await oauth2Client.getToken(code, (err, tokens) => {
      if (!err) {
        req.token = tokens;
        next();
      } else {
        res.status(401).json({ msg: 'invalid grant', error: err.message });
      }
    });
  } else {
    res.status(400).json({ msg: 'Bad request' });
  }
};

exports.getTodaysMenu = async (req, res, next) => {
  const date = new Date();
  const todaysDate = date.toISOString();
  const menu = await Menus.findOne({
    where: { date: todaysDate },
  });
  if (!menu) {
    return res.status(401).json({ msg: 'Menu is not set for today', success: false });
  }
  const meals = await MealMenus.findAll({
    where: { menuId: menu.id },
    include: [{
      model: Meals,
      attributes: ['name', 'price', 'quantity', 'image', 'category'],
    }],
  });
  const availableMeals = [];
  if (meals.length === 0 || meals.isFulfilled === false) {
    return res.status(401).json({ msg: 'No meal found' });
  }
  await meals.map(meal => availableMeals.push(meal.Meal));
  req.mealsMenu = availableMeals;
  return next();
};

exports.googleAuth = async (req, res) => {
  const scopes = ['https://mail.google.com/'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    opn(url);
    res.status(201).json({ msg: 'Menu is set for the day', success: true });
  } else {
    res.redirect(301, url);
  }
};

exports.sendMenuNotification = (req, res) => {
  const menu = req.mealsMenu;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'ogedengbe123@gmail.com',
      serviceClient: '103130079380338133447',
      privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5BnoZd/oTGK+0\nhAB9B8KGucdwd618qzo+WqTFUuykwK7N++IdrziHxA59D0/OEmPe7Yi0/goHiqa4\naS/92JjporRi91w0YtsxA+Y++tZk/1w82RZddH+DMrPtarExvWVIJpkHz81dzwUT\ndTX8HFz68borU6vTA0c7k1fpOSLZ/1vk1RsJPOIo93XiBfdOFPqdC4bdrdreOgnK\n8xLdHOQRZ9borcA3ibJwuaJMd2j6PCEJQwe9vZXGRcWB4unv8PtQLuCFew5FbDIq\nolwlwvJ6eXq2snt+nTGY4pUVSMdn1wTFGehEzYg9NX1oLyDxOgxaSeg0HJMx/zJZ\nNnDoYpURAgMBAAECggEAPvjOW5ay3Qb83gJDLEqU0Uevcj65JAIe25P8GlCDy/rs\nQ5zjs1isc8CtcbDhZ3Bo3zmW2orPnQt6fK8IL2wldvbyT/CCSC4RDdiW5351s4AZ\nw3fbHcmFkICULkyurBAaxXilgrwd2DyaLKoqynhYyOu2ggKDK1klSEh4lh7lFq42\n2ihxIsqQV6yzLAYQaD5arnGMGiTfKuFzib1P7PqglXw0wNUf3hmzjBs4IYbLZp6y\nH8ClGa21CFGl2zaGy885RmEXIoE3jPh1zDNT/nPrh6yNKyvx81yHoV1BGWHLRRBq\n+D3Cfm4zPswOJqfJMAxbfTNv6xXIk4w8NVEvztQ0pQKBgQDrqFv3glVbKWY2Pnz8\nShip+v+9TAMdI6AtQYn1324DKKV5u3oH+5RCVv+DJ1rinVKLdkMsn8Q5gZKiqY0f\nWCC+VDJvYiURR/JROBHmu16qERIHn5FbdFLbCV0a/WYUTkywhBPV+phk/9Xl4z0R\nw2nBdL5aonlp3BVKsamkfgF4XwKBgQDI/zor1XVIAikm1vNP8ZQuyfYW0H5jtEgL\n/jRsz9YugW6WvAmrpB6lL1pUb85jepR7wbnYriFoaTZpLeHTPjXYZvv6GcV0YsM+\nce/1ZqDQZhkEEAj/ouu4RITXIc2Y0YkilZpHucr6EiWKYZW6BQpK2xcXjcjPi5hN\n8eIzAq6ojwKBgQCDK8hdIbffMVEKeofZamkGHIdDV88X5h+fcS6YpFA5A+PvuXH4\nhYmFz6UT3NES+Jzcsew8J4XyuHPlhNjfjI9VQcp9AzU8xD5WBQ65zqunoC7X/XLM\nZBhGgZTIlCnAvcCkNDBSV9WByoHGH1F71LjGDPRzwKIyUWWsmO2jeNvaowKBgC43\nKUv859uny4iHsih2lqjvfSsfw3/vawV+7NT8MPY+gowcLmkN8pHuwmlZz+3luJCA\nKdhdqYbVclJa32rwCfd5LoUCOfmZ3+TS0+bsMxvX7faWLUuCTYrwDk9dEWYK/+o4\n1eGaIcbAN2uLJp9AG26806Fx03ONWHbLoEQ0YK6XAoGAOARpWB1HxszkNZzBHwoK\nVMpvZEm77h3NcADxdM2U0rxDDSVLieA8ZxjOjeIk06sodn56WYPWDCueF23E9S6t\nRtFY+LFdDhTJWv2n+Mm5DFEiDH3TECXc7WeDxfgzSxaKQpv7lJKLfNMbfdYyno14\njphJq+sqGV1znbsU+ikPU6g=\n-----END PRIVATE KEY-----\n',
      accessToken: req.token.access_token || 'ya29.GlvhBUMvFNO9MZeEdyF-rCXGirShjDzZVAAlzCxeBaAwE-sZI3glZmqrd9-ZIm1NKYd7-l0l5N-CTH6yAQ2HUk3S0dOvgW3dVVt_NKnBq5qrnMd8D6dnuUJpWUl',
    },
  });
  const content = menu.reduce((initial, meal) => `${initial} <tr><td>${meal.name}</td><td>${meal.price}</td><td>${meal.category}</td></tr>`, '');
  const mailOptions = {
    from: 'ogedengbe123@gmail.com',
    to: 'soft-sky@live.co.uk',
    subject: 'Todays Menu',
    html: `<div>
        <div><img src="delicious-admin" /></div><table><thead><tr><th>Meals</th><th>Price</th><th>Category</th></tr></thead><tbody>
        ${content}</tbody></table><p>Thank you</p><p>Babatunde Ogedengbe</p><h3>@andela-bootcamp-project</h3></div>`,
    attachments: [{ filename: 'delicious-admin.jpg', path: `${__dirname}/../../public/delicious-admin.jpg`, cid: 'delicious-admin' }],
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(201).json({ success: true, msg: 'menu is set sucessfully but users are not notified', err: error.message });
    } else {
      res.status(201).json({ success: true, msg: 'menu is set sucessfully and customers are notified', info: info.response });
    }
  });
};
