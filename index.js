let express = require('express');
let config = require('./Config/config');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let app = express();
mongoose.connect(config.dbUrl, { useNewUrlParser: true });
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(function (req, res, next) {
    let origin = req.headers.origin;
    if (config.CORS_Accept_Origin.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
app.use('/', require('./Router/router'));
app.listen(config.port, () => console.log(`Connecting app running on ${config.port}`));