import express from "express";
import nodemailer from "nodemailer";
import Feedback from "../models/Feedback.js";
import ContactQuery from "../models/ContactQuery.js";
import Announcement from "../models/Announcement.js";
import AppDocument from "../models/AppDocument.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();


router.get("/feedbacks", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(3);
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedbacks" });
    }
});

router.post("/feedbacks", async (req, res) => {
    try {
        const { name, role, text } = req.body;
        if (!name || !role || !text) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newFeedback = new Feedback({ name, role, text });
        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
    } catch (error) {
        console.error("Database Save Failed (feedbacks):", error);
        res.status(500).json({ message: "Error submitting feedback" });
    }
});

router.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save to ContactQuery collection
        const newQuery = new ContactQuery({ name, email, message });
        await newQuery.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Message from ${name}`,
            text: `From: ${name} (${email})\n\nMessage:\n${message}`,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch(emailErr){
            console.error("Email sending failed but query was saved:", emailErr);
            // We won't block the actual saving process if email fails, UI should still say success
        }
        res.status(200).json({ message: "Your query has been submitted successfully." });
    } catch (error) {
        console.error("Error handling contact:", error);
        res.status(500).json({ message: "Error processing your request" });
    }
});

router.get("/announcements", async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ date: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: "Error fetching announcements" });
    }
});

router.get("/documents", async (req, res) => {
    try {
        // Find public administrative and sample format documents
        const docs = await AppDocument.find().sort({ uploadDate: -1 });
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents" });
    }
});

export default router;
