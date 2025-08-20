const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async ({ name, email, password, role, companyLogo }) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const user = new User({ name, email, password, role, companyLogo: companyLogo });
    await user.save();

    return {
        user,
        token: generateToken(user)
    };
};

exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid credentials");
    }

    return {
        user,
        token: generateToken(user)
    };
};
