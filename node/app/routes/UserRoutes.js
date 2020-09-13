
module.exports = (app, express)=>{

    const router = express.Router(); 
    const UserController = require('../controllers/UserController');

    router.post('/login', (req, res, next) => {
        const userObj = (new UserController()).boot(req, res);
        return userObj.login();
    });
    router.post('/signInWithGoogle', (req, res, next) => {
        const userObj = (new UserController()).boot(req, res);
        return userObj.signInWithGoogle();
    });

    router.post('/registration', (req, res, next) => {
        const userObj = (new UserController()).boot(req, res);
        return userObj.registration();
    });

    router.post('/registrationWithGoogle', (req, res, next) => {
        const userObj = (new UserController()).boot(req, res);
        return userObj.registrationWithGoogle();
    });

    router.get('/getUserDetail/:userId', (req, res, next) => {
        const userObj = (new UserController()).boot(req, res);
        return userObj.getUserDetail();
    });

    router.put('/updateUserDetail', (req, res, next) => {
        const userObj = (new UserController()).boot(req, res);
        return userObj.updateUserDetail();
    });

    app.use(config.baseApiUrl, router);
}