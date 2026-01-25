/**
 * PROJECTS.JS - Projects Section Dynamic Loader
 * Fetches and displays projects from projects.json
 */

/**
 * Load and display projects from JSON file
 * Each project includes: title, description, tech stack, GitHub link, and image
 */
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) throw new Error('Failed to load projects data');
        
        const data = await response.json();
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (!data.projects || data.projects.length === 0) {
            projectsGrid.innerHTML = '<p class="loading">No projects available yet.</p>';
            return;
        }
        
        // Generate HTML for each project
        projectsGrid.innerHTML = data.projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <img src="${project.image || 'images/image.png'}" 
                         alt="${project.title}"
                         onerror="this.src='images/image.png'">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-tech">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                    
                    ${project.github ? `
                        <a href="${project.github}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="project-link">
                            <i class="fab fa-github"></i>
                            View on GitHub
                        </a>
                    ` : ''}
                    
                    ${project.demo ? `
                        <a href="${project.demo}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="project-link" 
                           style="margin-left: 1rem;">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        console.log(`${data.projects.length} projects loaded successfully`);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = `
            <div class="loading">
                Unable to load projects. Please check that data/projects.json exists.
            </div>
        `;
    }
}

// Load projects when page is ready
document.addEventListener('DOMContentLoaded', loadProjects);