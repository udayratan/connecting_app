let express = require('express');
let router = express.Router();
let UserController = require('../Controllers/UserController');


router.post('/Remove_User', (req, res) => {
    UserController.Remove_User_Field_Validation(req.body).then((ValidityStatus) => {
        UserController.Check_for_User(req.body).then((UserData) => {
            UserController.Validate_for_Admin_User(UserData).then((ValidityStatus) => {
                UserController.Check_Operate_User(req.body).then((OperationUserData) => {
                    UserController.Remove_User(req.body).then((Result) => {
                        res.json(Result);
                    }).catch(err => res.json(err));
                }).catch(err => res.json(err));
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
})

router.post('/Update_User_Information', (req, res) => {
    UserController.Update_User_Information_Field_Validation(req.body).then((ValidityStatus) => {
        UserController.Check_for_User(req.body).then((UserData) => {
            UserController.Validate_for_Admin_User(UserData).then((ValidityStatus) => {
                UserController.Check_Operate_User(req.body).then((OperationUserData) => {
                    UserController.Update_User_Information(req.body).then((Result) => {
                        res.json(Result);
                    }).catch(err => res.json(err));
                }).catch(err => res.json(err));
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
})

router.post('/List_All_Users', (req, res) => {
    UserController.List_All_Users_Fields_Validation(req.body).then((ValidityStatus) => {
        UserController.Check_for_User(req.body).then((UserData) => {
            UserController.List_All_Users(req.body).then((Result) => {
                res.json(Result);
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
})

router.post('/Login', (req, res) => {
    UserController.Login_Fields_Validation(req.body).then((ValidityStatus) => {
        UserController.Check_for_Email(req.body).then((UserData) => {
            UserController.Login(req.body, UserData).then((Result) => {
                res.json(Result);
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
})

router.post('/Register_User', (req, res) => {
    UserController.Register_User_Field_Validation(req.body).then((ValidityStatus) => {
        UserController.Register_User_Check_for_Admin_User_and_Admin_Code(req.body).then((ValidityStatus) => {
            UserController.Check_for_Email_Already_Exist(req.body).then((EmailRegisteredStatus) => {
                UserController.Register_User(req.body).then((Result) => {
                    res.json(Result);
                }).catch(err => res.json(err));
            }).catch(err => res.json(err));
        }).catch(err => res.json(err));
    }).catch(err => res.json(err));
});

module.exports = router;