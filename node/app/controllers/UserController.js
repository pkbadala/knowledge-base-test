const Controller = require("./Controller");
const User = require('../models/UserSchema').User;
const _ = require("lodash");
const Model = require("../models/Model");
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectID;

class UserController extends Controller{
    constructor(){
        super();
    }

    /*************************************************************************************
     register new user
    **************************************************************************************/
    async registration() {
        let _this = this;

        try {
            if (_this.req.body.password !== _this.req.body.confirmPassword)
                return _this.res.send({message: "Both password not match.", status: 0});

            if(!this.checkEmailPattern(_this.req.body.email))
                return _this.res.send({message: "Email not valid.", status: 0});

            const token = await this.getToken({ email: _this.req.body.email });
            const generatePassword = await this.getHashPassword(_this.req.body.password);

            let data = {
                userName: _this.req.body.userName,
                email: _this.req.body.email,
                password: generatePassword,
                accessToken: token
            };

            // save new user
            const newUser = await new Model(User).store(data);

            if (_.isEmpty(newUser)) {
                return _this.res.send({ status: 0, message: 'User not saved.' })
            } else {
                let uesrData = {
                    userName: newUser.userName,
                    email: newUser.email,
                    userId: newUser._id,
                    accessToken: token
                };

                return _this.res.send({status: 1, message: "User register successfully.", data: uesrData});
            }
        } catch (error) {
            if (error.message.name == 'ValidationError') {
                return _this.res.send({ status: 0, message: "All field's is required." });
            } else if (error.message.name == 'MongoError' && error.message.code === 11000) {
                return _this.res.send({ status: 0, message: "This user email already exist." });
            } else {
                return _this.res.send({ status: 0, message: error });
            }
        }
    }

    /*************************************************************************************
     login existing user
    **************************************************************************************/
    async login() {
        let _this = this;

        try {
            if (_this.req.body.email == '' || _this.req.body.password == '')
                return _this.res.send({message: "All field's required.", status: 0});

            const user = await User.findOne({"email": _this.req.body.email})

            if (_.isEmpty(user)) {
                return _this.res.send({status: 0, message: "User not exist."});
            } else {
                const checkPassword = await bcrypt.compare(_this.req.body.password, user.password);

                if (checkPassword) {
                    const token = await this.getToken({ email: user.email });

                    let filter = {email : user.email};
                    let updateData = { "accessToken" : token};

                    const updatedUser = await new Model(User).update(filter, updateData, { new: true });

                    let userData = {
                        userName: updatedUser.userName,
                        email: updatedUser.email,
                        userId: updatedUser._id,
                        accessToken: token
                    };
                    return _this.res.send({status: 1, message: "Login successfully", data: userData});
                } else {
                    return _this.res.send({status: 0, message: "Incorrect email or password."})
                }
            }
        } catch (error) {
            console.log("error occurred in login");
           return  _this.res.send({status: 0, message: "Something went wrong."});
        }
    }

    /*************************************************************************************
     register new user with google
    **************************************************************************************/
    async registrationWithGoogle() {
        let _this = this;

        try {
            const token = await this.getToken({ email: _this.req.body.email });

            let data = {
                userName: _this.req.body.userName,
                email: _this.req.body.email,
                googleId: _this.req.body.googleId,
                googleIdToken: _this.req.body.googleIdToken,
                googleToken: _this.req.body.googleToken,
                accessToken: token
            };

            // save new user
            const newUser = await new Model(User).store(data);

            if (_.isEmpty(newUser)) {
                return _this.res.send({ status: 0, message: 'User not saved.' })
            } else {
                let uesrData = {
                    userName: newUser.userName,
                    email: newUser.email,
                    userId: newUser._id,
                    accessToken: token
                };

                return _this.res.send({status: 1, message: "User register successfully.", data: uesrData});
            }
        } catch (error) {
            if (error.message.name == 'ValidationError') {
                return _this.res.send({ status: 0, message: "All field's is required." });
            } else if (error.message.name == 'MongoError' && error.message.code === 11000) {
                return _this.res.send({ status: 0, message: "This user email already exist." });
            } else {
                return _this.res.send({ status: 0, message: error });
            }
        }
    }

    /*************************************************************************************
     login user with google
    **************************************************************************************/
    async signInWithGoogle() {
        let _this = this;

        try {
            const user = await User.findOne({"email": _this.req.body.email})

            if (_.isEmpty(user)) {
                return _this.res.send({status: 0, message: "User not exist."});
            } else {
                const token = await this.getToken({ email: user.email });

                let filter = {email : user.email};
                let updateData = { 
                    "accessToken" : token,
                    "googleId" : _this.req.body.id,
                    "googleIdToken" : _this.req.body.idToken,
                    "googleToken" : _this.req.body.token
                };

                const updatedUser = await new Model(User).update(filter, updateData, { new: true });

                let userData = {
                    userName: updatedUser.userName,
                    email: updatedUser.email,
                    userId: updatedUser._id,
                    accessToken: token
                };
                return _this.res.send({status: 1, message: "Login successfully", data: userData});
            }
        } catch (error) {
            console.log("error occurred in login");
        return  _this.res.send({status: 0, message: "Something went wrong."});
        }
    }

    /*************************************************************************************
      get user detail
    **************************************************************************************/
    async getUserDetail() {
        let _this = this;
        
        try {
            if (_this.req.params.userId == '')
                return _this.res.send({message: "UserID is required.", status: 0});

            const user = await User.findOne({"_id": ObjectId(_this.req.params.userId)})

            if (_.isEmpty(user)) {
                return _this.res.send({status: 0, message: "User not exist."});
            } else {
                let userData = {
                    userName: user.userName,
                    email: user.email,
                    userId: user._id
                };
                return _this.res.send({status: 1, message: "User detail", data: userData});
            }
        } catch (error) {
            console.log("error occurred in login");
           return  _this.res.send({status: 0, message: "Something went wrong."});
        }
    }

    /*************************************************************************************
     update user detail
    **************************************************************************************/
    async updateUserDetail() {
        let _this = this;

        try {
            if (!_this.req.body.userId)
                return _this.res.send({message: "User ID is required.", status: 0});
            
            let data = {
                userName: _this.req.body.userName
            };

            let filter = {
                _id: ObjectId(_this.req.body.userId)
            };

            // update user detail
            const newUser = await new Model(User).update(filter, data);

            if (_.isEmpty(newUser))
                return _this.res.send({ status: 0, message: 'User not saved.' })
            else
                return _this.res.send({status: 1, message: "User updated successfully."});

            } catch (error) {
            if (error.message.name == 'ValidationError') {
                return _this.res.send({ status: 0, message: "All field's is required." });
            } else if (error.message.name == 'MongoError' && error.message.code === 11000) {
                return _this.res.send({ status: 0, message: "This user email already exist." });
            } else {
                return _this.res.send({ status: 0, message: error });
            }
        }
    }

    /*************************************************************************************
      use for token
    **************************************************************************************/
    getToken(id) {
        let _this = this;

        return new Promise(async (resolve, reject) => {

            try {
                // Generate Token
                let token = jwt.sign({
                    id: id,
                    algorithm: "HS256",
                    exp: Math.floor(new Date().getTime() / 1000) + config.tokenExpiry
                }, config.securityToken);

                return resolve(token);

            } catch(err) {
                console.log("Get token", err);
                return reject({message: err, status: 0 });
            }

        });
    }

    getHashPassword(password) {
        return new Promise((resolve, reject)=>{
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    throw err
                } else {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) {
                            throw err
                        } else {
                            resolve(hash);
                        }
                    })
                }
            })
        });
    }

    checkEmailPattern(email) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
            return true;
        else
            return false;
    }
}

module.exports = UserController;