// require('dotenv').config();
// const connectDB = require('./connections/db');
// const { app, connectServer } = require('./connections/server');
// const { appRoute } = require('./src/routes/index');
// const express = require('express');
// const cors = require('cors');
// app.use(    
//     cors({
//         origin: ['http://localhost:3000','http://192.168.85.1:3000'],
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//         credentials: true,
//         })
// )

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/v1', appRoute);

// app.post("/api/v1/text", (req, res) => {
//     console.log("Received Body:", req.body);
//     res.json({ received: req.body });
// });

// // Start
// (async () => {
//     await connectDB();
//     connectServer();
// })();
