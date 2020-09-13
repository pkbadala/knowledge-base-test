/****************************
 FILE HANDLING OPERATIONS
 ****************************/
let fs = require('fs');
let path = require('path');
const config = require('../../configs/configs');
const _ = require("lodash");
const mv = require('mv');
const aws = require('aws-sdk');
env = require('dotenv').config();

aws.config.update({
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    region: process.env.S3_REGION
});

const s3 = new aws.S3();


class File {

    constructor(file, location) {
        this.file = file;
        this.location = location;
    }

    // Method to Store file on server
    store(data) {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(this.file.file)) {
                reject('Please send file.');
            }

            let fileName = this.file.file[0].originalFilename.split(".");
            let ext = _.last(fileName);
            let imagePath = data && data.imagePath ? data.imagePath : '/public/upload/images/';
            let name = 'image_' + Date.now().toString() + '.' + ext;
            let filePath = imagePath + name;
            let fileObject = { "filePath": name };
            mv(this.file.file[0].path, appRoot + filePath, { mkdirp: true }, function (err) {
                if (err) {
                    reject(err);
                }
                if (!err) {
                    resolve(fileObject);
                }
            });
        });
    }

    // Upload image on s3 bucket
    uploadFileOnS3(file) {
        let fileName = file.originalFilename.split(".");
        let newFileName = fileName[0] + Date.now().toString() + '.' + fileName[1];
        return new Promise((resolve, reject) => {
            s3.createBucket(() => {
                let params = {
                    Bucket: 'bucket1',
                    Key: newFileName,
                    Body: fs.createReadStream(file.path),
                    ACL: "public-read",
                }
                s3.upload(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }

                });
            });
        });
    }

    // Read file
    readFile(filepath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, 'utf-8', (err, html) => {
                if (err) {
                    return reject({ message: err, status: 0 });
                }
                return resolve(html);
            });
        });
    }
}

module.exports = File;