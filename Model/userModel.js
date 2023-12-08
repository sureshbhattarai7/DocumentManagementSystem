const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter the first name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter the last name!"],
  },
  username: {
    type: String,
    unique: [true, "Username already taken. Please enter unique username!"],
    required: [true, "Please enter the username!"],
  },
  email: {
    type: String,
    unique: [true, "Email must be unique!"],
    required: [true, "Please enter the email!"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password!"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password must be the same!",
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  //Only run this function if the password is created or modified
  if (!this.isModified("password")) return next();

  //Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
});

// userSchema.pre("save", function (next) {
//     if (!isModified('password') || this.isNew) return next();
//     this.passwordChangedAt = Date.now() - 1000;
//     next();
// });

//Instance method - it is gonna available on all document of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
