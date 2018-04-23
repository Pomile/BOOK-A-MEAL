import express from 'express';

// import controller that authenticate user

const router = express.Router();


router.get('/', (req, res) => {
  res.send('You are Welcome. Please Book a Meal');
});


export default router;
