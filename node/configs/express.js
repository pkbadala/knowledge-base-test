/****************************
 EXPRESS AND ROUTING HANDLING
 ****************************/
let express = require('express');
config = require('./configs');
morgan = require('morgan');
compress = require('compression');
bodyParser = require('body-parser');
methodOverride = require('method-override');
session = require('express-session');
jwt = require('jsonwebtoken');
multer = require('multer'); //middleware for handling multipart/form-data
multiparty = require('multiparty'); /*For File Upload*/
cors = require('cors'); //For cross domain error
fs = require('file-system');
path = require('path');
timeout = require('connect-timeout');

module.exports = function() {
    console.log('env - ' + process.env.NODE_ENV)
    var app = express();

    // create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

    // setup the logger
    app.use(morgan('combined', {stream: accessLogStream}))

    //console.log(__dirname)
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
      app.use(compress({ threshold: 2 }));
    }

    app.use(bodyParser.urlencoded({limit:"50mb",
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(methodOverride());

    app.use(cors());
    // app.use(morgan('combined')); // Just uncomment this line to show logs.

    // =======   Settings for CORS
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.use(timeout(120000));
    app.use(haltOnTimedout);

    function haltOnTimedout(req, res, next){
      if (!req.timedout) next();
    }

    app.use( (err, req, res, next)=> {

        return  res.send({
            status:  0,
            statusCode:  500,
            message:  err.message,
            error:  err
        });

        let aYear = 60 * 60 * 24 * 365;

        res.set('Strict-Transport-Security', 'max-age=' + aYear + ';includeSubdomains');
        next();
    })

    app.use(session({
      cookie: { maxAge: 30000 },
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret
    }));

    // =======   Routing
    require('../app/routes/UserRoutes')(app, express);
    require('../app/routes/CategoryRoutes')(app, express);
    require('../app/routes/ProductRoutes')(app, express);

    return app;
  };
