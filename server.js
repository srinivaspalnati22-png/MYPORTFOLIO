// Portfolio Backend Server
// Node.js with Express.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Database Mock (You can replace with MongoDB/MySQL)
const projects = [{
        id: 1,
        title: "CareerSafe – AI Powered Career Safety Platform",
        description: "An AI-powered platform to detect job scams and fraudulent postings. Implements legitimacy verification, resume authenticity analysis, AI career guidance, and Android support using Capacitor.",
        technologies: ["Python", "Flask", "HTML", "CSS", "JavaScript", "Vite", "Capacitor", "OpenAI API"],
        imageUrl: "projects/careersafe.jpg"
    },
    {
        id: 2,
        title: "NexusAI – Smart Retail Demand Forecasting AI",
        description: "An AI-powered retail demand forecasting platform featuring glassmorphic dashboards, time-series forecasting analytics, responsive UI, and interactive data visualizations.",
        technologies: ["Python", "Flask", "JavaScript", "Tailwind CSS", "Chart.js"],
        imageUrl: "projects/nexus-ai.jpg"
    },
    {
        id: 3,
        title: "TruthLens AI – Fake News Detection Platform",
        description: "A fake news detection platform featuring clickbait detection, sentiment analysis, credibility scoring, bias detection, and interactive analytics dashboards.",
        technologies: ["Python", "Flask", "Tailwind CSS", "JavaScript", "Chart.js"],
        imageUrl: "projects/truthlens.jpg"
    }
];

const skills = [{
        category: "Programming",
        items: ["Python", "Java", "Data Structures & Algorithms (DSA)"]
    },
    {
        category: "Web Development",
        items: ["HTML", "CSS", "JavaScript", "Responsive UI Development"]
    },
    {
        category: "Database",
        items: ["Basic SQL / Database Knowledge"]
    },
    {
        category: "Tools & Technologies",
        items: ["VS Code", "Cursor AI", "GitHub", "Google AI Studio", "AI Agents & Prompt Engineering Tools"]
    },
    {
        category: "Core Areas",
        items: ["Artificial Intelligence", "Startup Prototyping", "Hackathon Project Development"]
    }
];

const student = {
    name: "PALNATI PUSHPA NAGA VENKATA SRINIVAS",
    email: "srinivaspalnati22@gmail.com",
    phone: "+91 9581778571",
    institution: "NRI University, Andhra Pradesh",
    course: "B.Tech Computer Science and Engineering (CSE)",
    year: "3rd Year - 1st Semester",
    bio: "I am a passionate and self-motivated Computer Science Engineering student with strong interest in Artificial Intelligence, Web Development, Startup-Oriented Product Building, and Hackathons. Skilled in building AI-powered applications, solving real-world problems, and developing modern software solutions using Python, Java, Web Technologies, and AI tools."
};

// Routes

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'v.html'));
});

// Get All Projects
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: projects,
        count: projects.length
    });
});

// Get Single Project
app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found"
        });
    }
    res.json({
        success: true,
        data: project
    });
});

// Get All Skills
app.get('/api/skills', (req, res) => {
    res.json({
        success: true,
        data: skills,
        count: skills.length
    });
});

// Get Student Info
app.get('/api/student', (req, res) => {
    res.json({
        success: true,
        data: student
    });
});

// Contact Form Submission
app.post('/api/contact', async(req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        // Configure email (Replace with your email credentials)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: email,
            to: student.email,
            subject: `Portfolio Contact: ${subject}`,
            text: `From: ${name} (${email})\n\nMessage:\n${message}`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Message sent successfully!"
        });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
});

// Get Portfolio Stats
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalProjects: projects.length,
            skillCategories: skills.length,
            cgpa: student.cgpa,
            year: student.year,
            institution: student.institution
        }
    });
});

// Add New Project (Admin)
app.post('/api/projects', (req, res) => {
    const { title, description, technologies, imageUrl } = req.body;

    if (!title || !description || !technologies) {
        return res.status(400).json({
            success: false,
            message: "Title, description, and technologies are required"
        });
    }

    const newProject = {
        id: projects.length + 1,
        title,
        description,
        technologies,
        imageUrl: imageUrl || "projects/default.jpg"
    };

    projects.push(newProject);

    res.status(201).json({
        success: true,
        message: "Project added successfully",
        data: newProject
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Portfolio Backend Server running on http://localhost:${PORT}`);
    console.log(`
    Available Routes:
    GET  /                 - Home
    GET  /api/projects     - Get all projects
    GET  /api/projects/:id - Get single project
    GET  /api/skills       - Get all skills
    GET  /api/student      - Get student info
    GET  /api/stats        - Get portfolio stats
    POST /api/contact      - Send contact message
    POST /api/projects     - Add new project (Admin)
    `);
});

module.exports = app;