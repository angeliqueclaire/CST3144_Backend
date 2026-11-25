var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(request, response) {
    fetch("https://cst3144-backend-e38z.onrender.com")
});

module.exports = router;