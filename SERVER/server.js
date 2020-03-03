import express from 'express';
import bodyParser from 'body-parser';
import configProd from 'dotenv';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import openRoutes from './src/route/openRoutes';
import securedRoutes from './src/route/securedRoutes';

const app = express();
console.log(`ENV: ${process.env.NODE_ENV}`);

// loads .env into process.env
configProd.config();

// use morgan middleware on either production or development environment.
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

export default app;
