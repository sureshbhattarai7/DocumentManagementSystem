const User = require("./../Model/userModel");
const catchAsyncError = require("./../Utils/catchAsyncError");
const AppError = require("./../Utils/appError");
const sendEmail = require("./../Utils/email");
const puppeteer = require("puppeteer");
const path = require("path");
const htmlContent = require("../Reusable/generatehtml");

exports.signup = catchAsyncError(async (req, res) => {
  const newUser = await User.create(req.body);

  const content = htmlContent.generate(req.body);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(content);
  await page.pdf({
    path: `${path.join(__dirname, "./../pdfs", req.body.username + ".pdf")}`,
    format: "A4",
    printBackground: true,
  });
  await browser.close();

  await sendEmail({
    email: req.body.email,
    subject: "Welcome from XYZ Company",
    message:
      "Dear user, We heartly welcome you for joining XYZ company. You are now active member and your email is ${newUser.email}.",
    html: `
        <html>
        <body>
        <h3>XYZ Company</h3>
        <p>Dear ${req.body.firstName},</p>
        <p>Dear user, We heartly welcome you for joining XYZ company. You are now active member and your email is ${newUser.email}.</p>
        </body>
        </html>
        `,
  });

  res.send("User Registration Successfull. Please check your mail");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  //check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please enter email and password!", 400));
  }

  //Check if email exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Please enter correct email or password", 401));
  }

  res.status(200).json({
    status: "success",
  });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  //Get the user
  const user = await User.findById(req.user.id).select("+password");

  //Check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Current password is incorrect!", 401));
  }

  //If password is correct, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
