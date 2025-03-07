// Load project and sector data from JSON files
const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

// Initialize an empty array for processed projects
let projects = [];

// Initialize function to populate the projects array with additional sector data
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Populate the projects array with enhanced project objects
            projects = projectData.map(project => {
                // Find the corresponding sector using sector_id
                const sector = sectorData.find(s => s.id === project.sector_id);
                return { 
                    ...project, 
                    sector: sector ? sector.sector_name : "Unknown" 
                };
            });
            resolve();
        } catch (error) {
            reject("Failed to initialize projects");
        }
    });
}

// Function to get all projects
function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length === 0) {
            reject("No projects available");
        } else {
            resolve(projects);
        }
    });
}

// Function to get a project by its ID
function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            resolve(project);
        } else {
            reject(`Project with ID ${projectId} not found`);
        }
    });
}

// Function to get projects by sector, with case-insensitive and partial matching
function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const filteredProjects = projects.filter(p => 
            p.sector.toLowerCase().includes(sector.toLowerCase())
        );
        if (filteredProjects.length > 0) {
            resolve(filteredProjects);
        } else {
            reject(`No projects found in sector: ${sector}`);
        }
    });
}

// Export the functions for use in other modules
module.exports = { 
    initialize, 
    getAllProjects, 
    getProjectById, 
    getProjectsBySector 
};