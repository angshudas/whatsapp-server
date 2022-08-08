const express = require('express');
const userController = require('../controller/userController');
const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();


router.route('/register').post(userController.register);
router.route('/login').post(userController.login);
router.route('/delete').get(userController.deleteAll);
router.use(verifyJWT);
router.route('/update/details').post(userController.updateDetails);
router.route('/update/password').post(userController.updatePassword);

// router.route('/refresh').post(userController.refresh);

router.route('/test').get(verifyJWT,(req,res)=>{
  const email = req.headers['email'];
  return res.json({ msg : 'done', email });
})

module.exports = router;