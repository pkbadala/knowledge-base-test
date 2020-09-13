const Controller = require("./Controller");
const Category = require('../models/CategorySchema').Category;
const _ = require("lodash");
const Model = require("../models/Model");
const Common = require("../common/common");

class CategoryController extends Controller {
    constructor(){
        super();
    }

    /*************************************************************************************
        save new category
    **************************************************************************************/
    async saveCategory() {
        let _this = this;

        try {
            const newCategory = await new Model(Category).store(_this.req.body);

            if (_.isEmpty(newCategory))
                return _this.res.send({ status: 0, message: 'Category not saved.' })

            _this.res.send({ status: 1, message: 'Congratulation, You have added category successfully.'});

        } catch (error) {
            if (error.message.name == 'ValidationError') {
                return _this.res.send({ status: 0, message: "Category name is required." });
            } else if (error.message.name == 'MongoError' && error.message.code === 11000) {
                return _this.res.send({ status: 0, message: "This category already exist." });
            } else {
                return _this.res.send({ status: 0, message: error });
            }
        }
    }

    /*************************************************************************************
     get all category
     **************************************************************************************/
    async getAllCategory(req, res){

        let _this = this;
        try {
            const categoryList = await Category.find().sort({ 'categoryName': 1});
            return _this.res.send({status : 1 , message:'List of all Category.', categoryList: categoryList})
        } catch (error) {
            _this.res.send({status : 0 , message:'An internal error has occurred, please try again.'});
        }
    }
}

module.exports = CategoryController;