import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import openRoutes from './src/route/openRoutes';
import securedRoutes from './src/route/securedRoutes';
import db from './src/models';

const app = express();
const port = process.env.PORT || 3000;

console.log(`ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  app.use(morgan('short'));
}

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false, type: '*/x-www-form-urlencoded' }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.raw({ type: '*/octet-stream' }));

app.use('/api/v1/users', openRoutes);
app.use('/api/v1/auth', securedRoutes);


app.listen(port, () => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`${process.env.NODE_ENV} server is listening on port ${port}`);
    db.sequelize.sync();
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`${process.env.NODE_ENV} server is listening on port ${port}`);
    db.sequelize.sync({ force: true });
  } else {
    db.sequelize.sync();
    console.log(`${process.env.NODE_ENV} Server is listening on port ${port}`);
  }
});

export default app;
