import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import openRoutes from './src/route/user';
import securedRoutes from './src/route/secure-user';

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('short'));

app.use(bodyParser.urlencoded({ extended: false, type: '*/x-www-form-urlencoded' }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.raw({ type: '*/octet-stream' }));


app.use('/api/v1/users', openRoutes);
app.use('/api/v1/auth', securedRoutes);

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send('Not Found');
  }
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

app.all('*', (req, res) => {
  res.send('Page Not Found');
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;
