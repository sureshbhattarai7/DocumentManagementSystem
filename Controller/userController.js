const catchAsyncError = require('./../Utils/catchAsyncError');
const User = require('./../Model/userModel');
const AppError = require('./../Utils/appError');

const filterObject = (obj, ...allowedFields) => {
    const newObject = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObject[el] = obj[el];
    });
    return newObject;
}

exports.getUsers = catchAsyncError(async (req, res) => {
    const getUsers = await User.find();
    res.status(200).json({
        status: 'success',
        totalData: getUsers.length,
        data: {
            getUsers
        },
    });
});

exports.getUser = catchAsyncError(async (req, res) => {
    const getUser = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            getUser
        },
    });
});

exports.updateCurrentData = catchAsyncError(async (req, res) => {
    //Create error if user posts current data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError(`Password can not be updated in this route! Please goto '/updatePassword' route.`, 400));
    };

    //Filter out unwanted fields that are not allowed to update
    const filteredBody = filterObject(req.body, 'firstName', 'lastName', 'username', 'email');

    //Update the user document
    const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// exports.deleteCurrentData = catchAsyncError(async (req, res) => {
//     await User.findByIdAndDelete(req.user.id, { active: false });

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// });

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new AppError(`Can not find the data with that ID!`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: null
    });
});