import express from 'express';

let router = express.Router();

router.get('/test', (req, res) => {
	res.send('Test route is working!');
});

export default router;
