import UserModel from '../model/User.model.js'
import QuestionModel from '../model/Question.model.js'
import AnswerModel from '../model/Answer.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}

export async function register(req,res){

    try {
        const { username, password, profile, email, role } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email,
                                role
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error);
    }

}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}

export async function getAllQuestions(req,res){
   
    try {
        await QuestionModel
          .aggregate([
            {
              $lookup: {
                from: "answers", //collection to join
                localField: "_id", //field from input document
                foreignField: "questionId",
                as: "allAnswers", //output array field
              },
            },
          ])
          .exec()
          .then((doc) => {
            res.status(200).send(doc);
          })
          .catch((error) => {
            res.status(500).send({
              status: false,
              message: "Unable to get the question details",
            });
          });
      } catch (e) {
        res.status(500).send({
          status: false,
          message: "Unexpected error",
          user: req.body.user
        });
      }
}

export async function getAllUsers(req,res){
   
    try {
        UserModel.find()
        .exec()
        .then(users => {
            const response = {
                users: users.map(user => {

                    return {
                        name: user.username,
                        role: user.role,
                        email: user.email
                    }

                })

            };
            res.status(200).json(response);
        }).catch(err => {
        res.status(500).json({
            success: false
        })
    })
      } catch (e) {
        res.status(500).send({
          status: false,
          message: "Unexpected error",
          user: req.body.user
        });
      }
}

export async function question(req,res){

    try {
        await QuestionModel
          .create({
            questionName: req.body.questionName,
            questionUrl: req.body.questionUrl,
            user: req.body.user,
            category: req.body.category,
            createdAt: req.body.createdDate
          })
          .then(() => {
            res.status(201).send({
              status: true,
              message: "Question added successfully",
              user: req.body.user
            });
          })
          .catch((err) => {
            res.status(400).send({
              staus: false,
              message: "Bad format",
            });
          });
      } catch (e) {
        res.status(500).send({
          status: false,
          message: "Error while adding question",
        });
      }
}

export async function answer(req,res){
   
    try {
        await AnswerModel
          .create({
            answer: req.body.answer,
            questionId: req.body.questionId,
            user: req.body.user,
            createdAt: req.body.createdDate,
            likes: 0
          })
          .then(() => {
            res.status(201).send({
              status: true,
              message: "Answer added successfully",
            });
          })
          .catch((e) => {
            res.status(400).send({
              status: false,
              message: "Bad request",
            });
          });
      } catch (e) {
        res.status(500).send({
          status: false,
          message: "Error while adding answer",
        });
      }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    
    const { username } = req.params;

    try {
        
        if(!username) return res.status(501).send({ error: "Invalid Username"});

        UserModel.findOne({ username }, function(err, user){
            if(err) return res.status(500).send({ err });
            if(!user) return res.status(501).send({ error : "Couldn't Find the User"});

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

export async function updateAnswer(req,res){
    try {
        await AnswerModel
          .updateOne({
            _id: req.body._id 
          }, { $set: { likes: req.body.likes } })
          .then(() => {
            res.status(201).send({
              status: true,
              answer: req.body,
              message: "like added successfully",
            });
          })
          .catch((e) => {
            res.status(400).send({
              status: false,
              message: "Bad request",
            });
          });
      } catch (e) {
        res.status(500).send({
          status: false,
          message: "Error while adding like",
        });
      }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;

        try {
            
            UserModel.findOne({ username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username : user.username },
                            { password: hashedPassword}, function(err, data){
                                if(err) throw err;
                                req.app.locals.resetSession = false; // reset session
                                return res.status(201).send({ msg : "Record Updated...!"})
                            });
                        })
                        .catch( e => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error : "Username not Found"});
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}


