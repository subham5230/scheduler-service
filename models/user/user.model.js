let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const { Role } = require("./user.enum");

const userSchema = new Schema({
  id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },

  role: {
    type: String,
    enum: Role,
    default: Role.USER,
  },

  firstName: String,
  lastName: String,
  password: String,
  lastVisited: { type: Date, default: new Date() },
  isActive: {type: Boolean, default: false},

  meta: {
    profilePhoto: String,
    description: String,
    phoneNumber: {type:String},
    address: String,
    city: String,
    zipcode: String,
    lat: String,
    lon: String,
    refreshToken: String,
    accessToken: String,
    isPhoneVerified: {type: Boolean, required: true, default: false},
    isEmailVerified: {type: Boolean, required: true, default: false},
  },

}, {timestamps: true});

var userModel = mongoose.model("users", userSchema, "users");

module.exports = userModel;
