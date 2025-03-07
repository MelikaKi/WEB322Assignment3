/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Melika Kazemi
*  Student ID: 166429233
*  Date: 2025-03-06
*
*  Published URL: 
*
********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();

const studentName = "Melika Kazemi";
const studentId = "166429233";

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "views", "home.html"))
);

app.get("/about", (req, res) => 
    res.sendFile(path.join(__dirname, "views", "about.html"))
);

app.get("/solutions/projects", (req, res) => {
    const { sector } = req.query;
    if (sector) {
        projectData.getProjectsBySector(sector)
            .then(projects => res.json({
                studentName, 
                studentId, 
                timestamp: new Date(), 
                projects
            }))
            .catch(err => res.status(404).json({
                error: err.message, 
                studentName, 
                studentId, 
                timestamp: new Date()
            }));
    } else {
        projectData.getAllProjects()
            .then(projects => res.json({
                studentName, 
                studentId, 
                timestamp: new Date(), 
                projects
            }))
            .catch(err => res.status(500).json({
                error: err.message, 
                studentName, 
                studentId, 
                timestamp: new Date()
            }));
    }
});

app.get("/solutions/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
        return res.status(404).json({
            error: "Invalid project ID",
            studentName,
            studentId,
            timestamp: new Date()
        });
    }
    
    projectData.getProjectById(projectId)
        .then(project => {
            if (project) {
                res.json({
                    studentName, 
                    studentId, 
                    timestamp: new Date(), 
                    project
                });
            } else {
                res.status(404).json({
                    error: "Project not found",
                    studentName,
                    studentId,
                    timestamp: new Date()
                });
            }
        })
        .catch(err => res.status(404).json({
            error: err.message, 
            studentName, 
            studentId, 
            timestamp: new Date()
        }));
});

app.post("/post-request", (req, res) => {
    res.json({
        studentName,
        studentId,
        timestamp: new Date(),
        requestBody: req.body
    });
});

// Custom 404 Page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"), {
        headers: {
            'Content-Type': 'text/html'
        }
    });
});

// Initialize Project Data
projectData.initialize()
    .then(() => {
        console.log("Project data initialized successfully.");
    })
    .catch(err => {
        console.error(`Failed to initialize project data: ${err}`);
        process.exit(1);
    });

// Export the app for Vercel
module.exports = app;
