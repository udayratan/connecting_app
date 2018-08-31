let UserController = function () { };
//Dependencies
let validator = require('validator');
let moment = require('moment');
let uuid = require('uuid');
let crypto = require('crypto');
let rand = require('csprng');


//File Models
let ApiMessages = require('../Config/ApiMessages');
let config = require('../Config/config');

//DB Models
let Users = require('../Models/Users');


/*Controlling Function Below
                          ||
                          ||
                          ||
                          ||
                          ||
                          \/                                        */


UserController.Remove_User = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let query = {
                    USERID: values.Operate_USERID
                };
                Users.deleteOne(query).lean().exec().then((UpdateStatus) => {
                    resolve({ success: true, extras: { Status: "Removed Successfully" } })
                }).catch((err) => {
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Remove_User_Field_Validation = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (
                    values.USERID != null && values.SessionID != null
                    && values.Operate_USERID != null
                ) {
                    resolve('validated successfully');
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBMIT_ALL_VALUES } });
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Update_User_Information = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let query = {
                    USERID: values.Operate_USERID
                };
                let changes = {
                    $set: {
                        Name: values.Name,
                        PhoneNumber: values.PhoneNumber,
                        DOB: moment(values.DOB, 'DD-MM-YYYY').toDate(),
                        updated_time: new Date()
                    }
                };
                Users.updateOne(query, changes).lean().exec().then((UpdateStatus) => {
                    resolve({ success: true, extras: { Status: "Updated Successfully" } })
                }).catch((err) => {
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Check_Operate_User = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let query = {
                    USERID: values.Operate_USERID
                };
                Users.findOne(query).lean().exec().then((Result) => {
                    if (Result == null) {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_OPERATION_USERID } });
                    } else if (Result != null) {
                        resolve(Result);
                    }
                }).catch((err) => {
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Validate_for_Admin_User = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (UserData.Whether_Admin_User) {
                    resolve('Validated Successfully')
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.NOT_ADMIN_USER } })
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Update_User_Information_Field_Validation = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (
                    values.USERID != null && values.SessionID != null
                    && values.Operate_USERID
                    && values.Name != null && values.Name != ''
                    && values.PhoneNumber != null && values.PhoneNumber != ''
                    && values.DOB != null && values.DOB != ''
                ) {
                    if (validator.isMobilePhone(values.PhoneNumber, 'en-IN')) {
                        if (moment(values.DOB, 'DD-MM-YYYY').isValid()) {
                            resolve('validated successfully');
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.INVALID_DATE_FORMAT } });
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_PHONE_NUMBER } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBMIT_ALL_VALUES } });
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}


UserController.List_All_Users = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                Users.find({ USERID: { $ne: values.USERID } }).select('-_id USERID Name EmailID PhoneNumber DOB').then((Result) => {
                    resolve({ success: true, extras: { Data: Result } })
                }).catch((err) => {
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Check_for_User = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let query = {
                    USERID: values.USERID
                };
                Users.findOne(query).lean().exec().then((Result) => {
                    if (Result == null) {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_USERID } });
                    } else if (Result != null) {
                        if (Result.SessionID == values.SessionID) {
                            resolve(Result);
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.SESSION_EXPIRED } });
                        }
                    }
                }).catch((err) => {
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.List_All_Users_Fields_Validation = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (
                    values.USERID != null && values.SessionID != null
                ) {
                    resolve('validated successfully');
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBMIT_ALL_VALUES } });
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Login = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let pass = values.Password + UserData.PasswordSalt;
                let NewPasswordHash = crypto.createHash('sha512').update(pass).digest("hex");
                if (NewPasswordHash == UserData.PasswordHash) {
                    //Password Matched Successfully
                    let SessionID = uuid.v4();
                    let query = {
                        USERID: UserData.USERID
                    }
                    let changes = {
                        $set: {
                            SessionID: SessionID,
                            updated_time: new Date()
                        }
                    };
                    Users.updateOne(query, changes).lean().exec().then((UpdateStatus) => {
                        resolve({
                            success: true, extras: {
                                Status: "Login Successfully",
                                Data: {
                                    USERID: UserData.USERID,
                                    Whether_Admin_User: UserData.Whether_Admin_User,
                                    Name: UserData.Name,
                                    EmailID: UserData.EmailID,
                                    PhoneNumber: UserData.PhoneNumber,
                                    DOB: UserData.DOB,
                                    SessionID: SessionID
                                }
                            }
                        });
                    }).catch((err) => {
                        reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                    })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PASSWORD } })
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Check_for_Email = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let query = {
                    EmailID: values.EmailID
                };
                Users.findOne(query).lean().exec().then((Result) => {
                    if (Result == null) {
                        reject({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_REGISTERED } })
                    } else if (Result != null) {
                        resolve(Result);
                    }
                }).catch((err) => {
                    console.error('Database Error');
                    console.error(err);
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Login_Fields_Validation = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (
                    values.EmailID != null && values.EmailID != ''
                    && values.Password != null && values.Password != ''
                ) {
                    if (validator.isEmail(values.EmailID)) {
                        if (String(values.Password).length >= 8) {
                            resolve('validated successfully');
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.PASSWORD_MUST_HAVE_ATLEAST_8_CHARACTERS } });
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_EMAIL_FORMAT } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBMIT_ALL_VALUES } });
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}


UserController.Register_User = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let Password = values.Password;
                let salt = rand(80, 24);
                let pass = Password + salt;
                let Data = {
                    USERID: uuid.v4(),
                    Whether_Admin_User: values.Whether_Admin_User,
                    Name: values.Name,
                    EmailID: values.EmailID,
                    PhoneNumber: values.PhoneNumber,
                    DOB: moment(values.DOB, 'DD-MM-YYYY').toDate(),
                    PasswordHash: crypto.createHash('sha512').update(pass).digest("hex"),
                    PasswordSalt: salt,
                    SessionID: uuid.v4(),
                    created_time: new Date(),
                    updated_time: new Date()
                };
                Users(Data).save().then((Result) => {
                    resolve({
                        success: true, extras: {
                            Status: "Registered Successfully",
                            Data: {
                                USERID: Result.USERID,
                                Whether_Admin_User: Result.Whether_Admin_User,
                                Name: Result.Name,
                                EmailID: Result.EmailID,
                                PhoneNumber: Result.PhoneNumber,
                                DOB: Result.DOB,
                                SessionID: Result.SessionID
                            }
                        }
                    });
                }).catch((err) => {
                    console.error('Database Error');
                    console.error(err);
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })


            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}
UserController.Check_for_Email_Already_Exist = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                let query = {
                    EmailID: values.EmailID
                };
                Users.findOne(query).lean().exec().then((Result) => {
                    if (Result == null) {
                        resolve('Email Validated Successfully')
                    } else if (Result != null) {
                        reject({ success: false, extras: { msg: ApiMessages.EMAIL_ALREADY_REGISTERED } })
                    }
                }).catch((err) => {
                    console.error('Database Error');
                    console.error(err);
                    reject({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } });
                })
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Register_User_Check_for_Admin_User_and_Admin_Code = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (values.Whether_Admin_User == true) {
                    if (values.Admin_Code != '') {
                        if (config.Admin_Code == values.Admin_Code) {
                            resolve('Validated Successfully')
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.INVALID_ADMIN_CODE } });
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.SUBMIT_ALL_VALUES } });
                    }
                } else {
                    resolve('Validated Successfully')
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

UserController.Register_User_Field_Validation = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                if (
                    values.Whether_Admin_User != null
                    && values.Admin_Code != null
                    && values.Name != null && values.Name != ''
                    && values.EmailID != null && values.EmailID != ''
                    && values.PhoneNumber != null && values.PhoneNumber != ''
                    && values.DOB != null && values.DOB != ''
                    && values.Password != null && values.Password != ''
                ) {
                    if (validator.isEmail(values.EmailID)) {
                        if (validator.isMobilePhone(values.PhoneNumber, 'en-IN')) {
                            if (moment(values.DOB, 'DD-MM-YYYY').isValid()) {
                                if (String(values.Password).length >= 8) {
                                    resolve('validated successfully');
                                } else {
                                    reject({ success: false, extras: { msg: ApiMessages.PASSWORD_MUST_HAVE_ATLEAST_8_CHARACTERS } });
                                }
                            } else {
                                reject({ success: false, extras: { msg: ApiMessages.INVALID_DATE_FORMAT } });
                            }
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.INVALID_PHONE_NUMBER } });
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_EMAIL_FORMAT } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBMIT_ALL_VALUES } });
                }
            } catch (error) {
                console.error('Something Error');
                console.error(error);
            }
        });
    });
}

module.exports = UserController;