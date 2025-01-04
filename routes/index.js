var express = require('express');
var router = express.Router();

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

module.exports = router;
