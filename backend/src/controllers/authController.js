const authService = require('../services/authService');
const express = require('express');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; // multer parses text fields

        console.log("Uploaded file:", req.file);

        // If logo uploaded
        let companyLogo = null;
        if (req.file) {
            companyLogo = `/uploads/${req.file.filename}`; // relative path (or full URL if serving statically)
        }
        console.log("Company Logo Path:", companyLogo);

        const result = await authService.registerUser({
            name,
            email,
            password,
            role,
            companyLogo
        });

        res.status(201).json({
            success: true,
            user: result.user,
            token: result.token
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};



exports.login = async (req, res) => {
    
    try {
        const body = JSON.parse(req.body || "{}");
        const { email, password } = body;
        const result = await authService.loginUser({ email, password });
        res.status(200).json({ success: true, user: result.user, token: result.token, });
    } catch (err) {
        res.status(401).json({ success: false, message: err.message });
    }
};

exports.signOut = async (req, res) => {
    res.clearCookie('token'); // assuming token is stored in cookie
    res.status(200).json({ message: 'Signed out successfully' });
};
