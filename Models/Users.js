let mongoose = require('mongoose');
const Users = mongoose.Schema({
    USERID: { type: String, default: "" },
    Whether_Admin_User: { type: Boolean, default: false },
    Name: { type: String, default: "" },
    EmailID: { type: String, default: "" },
    PhoneNumber: { type: String, default: "" },
    DOB: { type: Date, default: null },
    PasswordHash: { type: String, default: "" },
    PasswordSalt: { type: String, default: "" },
    SessionID: { type: String, default: "" },
    created_time: { type: Date, default: Date.now() },
    updated_time: { type: Date, default: Date.now() }
}, { collection: 'Users' });
module.exports = mongoose.model('Users', Users);