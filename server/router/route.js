import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import { registerMail } from '../controllers/mailer.js'
import Auth, { localVariables } from '../middleware/auth.js';


/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(registerMail); // send the email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser,controller.login); // login in app
router.route('/question').post(controller.question);
router.route('/answer').post(controller.answer);

/** GET Methods */
router.route('/getAllUsers').get(controller.getAllUsers)
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/generateSignupOTP').get(localVariables, controller.generateOTP)
router.route('/verifySignupOTP').get(controller.verifyOTP)  
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables
router.route('/getAllQuestions').get(controller.getAllQuestions)


/** PUT Methods */
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/updateAnswer').put(controller.updateAnswer); 
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password


export default router;