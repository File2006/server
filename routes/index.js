const express = require('express');
const router = express.Router();
router.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is connected successfully' });
});
router.get('/', (req, res) => {
    res.send('Hello, World!');
});
module.exports = router;