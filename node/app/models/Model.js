/****************************
 COMMON MODEL
 ****************************/
let _ = require("lodash");

class Model {

    constructor(collection) {
        this.collection = collection;
    }

    // Find all data
    find(filter = {}, project = {}, paginate = {}) {
        return new Promise((resolve, reject) => {
            this.collection.find(filter, project).exec((err, data) => {
                if (err) { return reject({ message: err, status: 0 }); }
                return resolve(data);
            });
        });
    }

    // Find single data
    findOne(filter = {}, project = {}) {
        return new Promise((resolve, reject) => {
            this.collection.find(filter, project).exec((err, data) => {
                if (err) { return reject({ message: err, status: 0 }); }
                return resolve(data);
            });
        });
    }

    // Update Data
    update(filter, data) {
        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(filter, { $set: data }, { upsert: true, new: true }, (err, data) => {
                if (err) {
                    return reject({ message: err, status: 0 });
                }
                return resolve(data);
            });
        });
    }

    // Store Data
    store(data, options = {}) {
        return new Promise((resolve, reject) => {
            const collectionObject = new this.collection(data)

            collectionObject.save((err, createdObject) => {
                if (err) {
                    return reject({ message: err, status: 0 });
                }
                return resolve(createdObject);
            });
        });
    }

    // Setting the Sort Params
    stages(params) {
        let stages = [];

        if (typeof params.sortBy !== 'undefined'
            && params.sortBy !== ''
            && typeof params.order !== 'undefined'
            && params.order !== ''
        ) {
            let sort = {};
            sort[params.sortBy] = (params.order === 'asc') ? 1 : -1;
            stages.push({ $sort: sort });
        }
        return stages;
    }

    // Aggregration
    aggregate(stages, query) {
        return new Promise(async (resolve, reject) => {

            let aggregationStages = _.clone(stages);
            aggregationStages = aggregationStages.concat(this.stages(query));

            try {
                const data = await this.collection.aggregate(aggregationStages);

                let result = { data };
                return resolve(result);
            } catch (err) {
                console.log("Aggregration error", err);
                return reject({ message: err, status: 0 });
            }
        });
    }

    pagination(filter, page, sort = {}, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!sort) {
                    sort = { createdAt: -1 }
                }
                let skip = limit * (page - 1)
                this.collection.find(filter).sort(sort).skip(skip).limit(limit).exec((err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(data);
                });
            } catch (error) {
                console.log("pagination error = ", error);
                return reject({ message: error, status: 0 });
            }
        });
    }

    count(filter = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                this.collection.count((err, count) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(count);
                });
            }
            catch (error) {
                console.log("count error = ", error);
                return reject({ message: error, status: 0 });
            }

        });

    }
}

module.exports = Model;

