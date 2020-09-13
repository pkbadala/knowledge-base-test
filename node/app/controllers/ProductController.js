const Controller = require("./Controller");
const Products = require('../models/ProductSchema').Product;
const _ = require("lodash");
const Model = require("../models/Model");
const ObjectId = require('mongodb').ObjectID;
let Config = require('../../configs/configs');
const File = require("../common/File");
const Form = require("../common/Form");
env = require('dotenv').config();

class ProductController extends Controller{
    constructor(){
        super();
    }

    /*************************************************************************************
        save product
    **************************************************************************************/
    async saveProduct() {
        let _this = this;

        try {
            const Product = await new Model(Products).store(_this.req.body);

            if (_.isEmpty(Product))
                return _this.res.send({ status: 0, message: 'Product not saved.' })

            _this.res.send({ status: 1, message: 'Congratulation, You have added product successfully.'});
        } catch (error) {
            console.log("error :: ",error)
            if (error.message.name == 'ValidationError') {
                return _this.res.send({ status: 0, message: "All field's are required." });
            } else if (error.message.name == 'MongoError' && error.message.code === 11000) {
                return _this.res.send({ status: 0, message: "This product name already exist." });
            } else {
                return _this.res.send({ status: 0, message: error });
            }
        }
    }

    /*************************************************************************************
     get all product
     **************************************************************************************/
    async getAllProduct(req, res){

        let _this = this;

        if(!_this.req.body.pageNumber || !_this.req.body.pageSize) {
            return __this.res.send({status : 0 , message:'Page number and page size is missing.'});
        }
        let skip = Number(_this.req.body.pageNumber - 1) * Number(_this.req.body.pageSize);
        let limit = _this.req.body.pageSize;
        try {
            let matchQuery = {"isDeleted" : false};
            
            if(_this.req.body.filterByCategory) {
                matchQuery = {
                    "categoryId" : ObjectId(_this.req.body.filterByCategory),
                    "isDeleted" : false
                };
            }

            if(_this.req.body.searchKeyword) {
                matchQuery = {
                    'productName': new RegExp(_this.req.body.searchKeyword, 'i'),
                    'productDescription': new RegExp(_this.req.body.searchKeyword, 'i'),
                    "isDeleted" : false
                };
            }

            let stages = [
                {
                    $match: matchQuery
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $project: {
                        "_id": 1,
                        "createdAt": 1,
                        "productName": 1,
                        "productDescription": 1,
                        "productImage": 1,
                        "category._id": 1,
                        "category.categoryName": 1
                    }
                },
                { 
                    $skip: Number(skip)
                },
                {
                    $limit: Number(limit)
                }, 
                {
                    $sort: {
                        "_id": -1
                    }
                }
            ];

            const ProductsData = await Products.aggregate(stages);

            let countStages = [
                {
                    $match: matchQuery
                },
                {
                    $facet: {
                        totalCount: [{
                            $count: 'count'
                        }]
                    }
                }
            ];

            const totalProduct = await Products.aggregate(countStages);
            const totalProducts = totalProduct.length > 0 ? totalProduct[0].totalCount.length > 0 ? totalProduct[0].totalCount[0].count : 0 : 0;

            if (!ProductsData) { return _this.res.send({status : 0 , message:'No post exist.'}); }
            return _this.res.send({status : 1 , message:'List of all products.', data: ProductsData, totalProducts: totalProducts})
        } catch (error) {
            console.log("error- ", error);
            _this.res.send({status : 0 , message:'An internal error has occurred, please try again.'});
        }
    }

    /*************************************************************************************
        return product detail
    **************************************************************************************/
    async getProductDetail() {
        let _this = this;

        try {
            if(!this.req.params.productId) {
                return _this.res.send({status : 0 , message:'Product not exist.'});
            }
            let data = {
                "_id" : ObjectId(this.req.params.productId)
            };

            // product detail
            const productDetail = await new Model(Products).findOne(data);

            if (_.isEmpty(productDetail))
                return _this.res.send({ status: 0, message: 'Product not deleted.' })

            _this.res.send({ status: 1, data: productDetail.length > 0 ? productDetail[0] : productDetail});
        } catch (error) {
            console.log("error = ", error);
            _this.res.send({ status: 0, message: error });
        }
    }

    /*************************************************************************************
        edit product
    **************************************************************************************/
    async editProduct() {
        let _this = this;

        try {
            // const Product = await new Model(Products).store(_this.req.body);
            if(!this.req.body.productId) {
                return _this.res.send({status : 0 , message:'Product not exist.'});
            }
            let filter = {
                "_id" : ObjectId(this.req.body.productId)
            };

            let data = {
                "productName" : this.req.body.productName,
                "productDescription" : this.req.body.productDescription,
                "categoryId" : this.req.body.categoryId,
                "productImage" : this.req.body.productImage
            };

            // edit product detail
            const updateProduct = await new Model(Products).update(filter, data);

            if (_.isEmpty(updateProduct))
                return _this.res.send({ status: 0, message: 'Product not updated.' })

            _this.res.send({ status: 1, message: 'Congratulation, You have updated product successfully.'});
        } catch (error) {
            console.log("error :: ",error)
            if (error.message.name == 'ValidationError') {
                return _this.res.send({ status: 0, message: "All field's are required." });
            } else if (error.message.name == 'MongoError' && error.message.code === 11000) {
                return _this.res.send({ status: 0, message: "This product name already exist." });
            } else {
                return _this.res.send({ status: 0, message: error });
            }
        }
    }
    /*************************************************************************************
        delete product
    **************************************************************************************/
    async deleteProduct() {
        let _this = this;

        try {
            if(!this.req.params.productId) {
                return _this.res.send({status : 0 , message:'Product not exist.'});
            }
            let filter = {
                "_id" : ObjectId(this.req.params.productId)
            };

            let data = {
                "isDeleted" : true
            };

            // soft delete
            const updateProduct = await new Model(Products).update(filter, data);

            if (_.isEmpty(updateProduct))
                return _this.res.send({ status: 0, message: 'Product not deleted.' })

            _this.res.send({ status: 1, message: 'Delete product successfully.'});
        } catch (error) {
            console.log("error = ", error);
            _this.res.send({ status: 0, message: error });
        }
    }

    /********************************************************
    Purpose: Single File uploading
    Parameter:
    {
           "file":
    }
    Return: JSON String
    ********************************************************/
    async fileUpload() {
        try {
            let form = new Form(this.req);
            let formObject = await form.parse();
            if (_.isEmpty(formObject.files)) {
                return this.res.send({ status: 0, message: 'File is required.' });
            }
            const file = new File(formObject.files);
            let filePath = "";
            if (process.env.S3_UPLOAD_FILES == 'true') {
                filePath = file.uploadFileOnS3(formObject.files.file[0]);
            }
            else {
                let fileObject = await file.store();
                filePath = fileObject.filePath;
            }
            this.res.send({ status: 1, data: { filePath } });

        } catch (error) {
            console.log("error- ", error);
            this.res.send({ status: 0, message: error });
        }
    }
}

module.exports = ProductController;