const User = require('../models/UserSchema').User;

class Common {

    // static isAuthorised(token) {
    static isAuthorised() {
        return async (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if(!token) {
                    return res.send({status : 0 , message:'Please provide access token'});
                } else {
                    const userEmail = this.decodeToken(token);
                    
                    if(!userEmail) {
                        return res.send({status : 0 , message:'You are not authorized person.'});
                    } else {
                        const isUserExist = User.findOne({"email": userEmail});
                        if(isUserExist) {
                            next();
                        } else {
                            return res.send({status : 0 , message:'Wrong authorization token.'});
                        }
                    }
                }
            } catch (err) {
                return res.send({ status: 0, message: err });
            }
        }
    }

    static decodeToken(token){
        var decoded = jwt.decode(token);
        if(!decoded) {
            return false;
        }
        return decoded.id.email;
    }

}

module.exports = Common;