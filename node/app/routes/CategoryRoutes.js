const Common = require("../common/common");

module.exports = (app, express)=>{

    const router = express.Router(); 
    const CategoryController = require('../controllers/CategoryController');
    

    router.post('/saveCategory', Common.isAuthorised(), (req, res, next) => {
        const categoryObj = (new CategoryController()).boot(req, res);
        return categoryObj.saveCategory();
    });

    router.get('/getAllCategory', Common.isAuthorised(), (req, res, next) => {
        const categoryObj = (new CategoryController()).boot(req, res);
        return categoryObj.getAllCategory();
    });

    app.use(config.baseApiUrl, router);
}