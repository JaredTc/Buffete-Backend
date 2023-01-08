const express = require('express');
const router = express.Router();


router.get('/', (req,res) => {

    res.send('WELCOME TO SERVER HAPPY HACKING!')

});



module.exports = router;