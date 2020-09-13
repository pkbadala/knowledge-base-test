const Common = require("../common/common");

module.exports = (app, express)=>{

    const router = express.Router(); 
    const ProductController = require('../controllers/ProductController');
    

    router.post('/saveProduct', Common.isAuthorised(), (req, res, next) => {
        const productObj = (new ProductController()).boot(req, res);
        return productObj.saveProduct();
    });

    router.post('/getAllProduct', Common.isAuthorised(), (req, res, next) => {
        const productObj = (new ProductController()).boot(req, res);
        return productObj.getAllProduct();
    });

    router.put('/editProduct', Common.isAuthorised(), (req, res, next) => {
        const productObj = (new ProductController()).boot(req, res);
        return productObj.editProduct();
    });

    router.get('/getProductDetail/:productId', Common.isAuthorised(), (req, res, next) => {
        const productObj = (new ProductController()).boot(req, res);
        return productObj.getProductDetail();
    });

    router.delete('/deleteProduct/:productId', Common.isAuthorised(), (req, res, next) => {
        const productObj = (new ProductController()).boot(req, res);
        return productObj.deleteProduct();
    });

    router.post('/fileUpload', (req, res, next) => {
        const productObj = (new ProductController()).boot(req, res);
        return productObj.fileUpload();
    });
    
    
    app.use(config.baseApiUrl, router);
}