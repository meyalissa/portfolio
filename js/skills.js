/**
 * SKILLS.JS - Skills Section Dynamic Loader
 * Fetches and displays skills from skills.json
 */

/**
 * Load and display skills from JSON file
 * Skills are organized by categories (e.g., Programming Languages, Web Technologies, Tools)
 */
async function loadSkills() {
    try {
        const response = await fetch('data/skills.json');
        if (!response.ok) throw new Error('Failed to load skills data');
        
        const data = await response.json();
        const skillsContainer = document.getElementById('skillsContainer');
        
        if (!data.skills || data.skills.length === 0) {
            skillsContainer.innerHTML = '<p class="loading">No skills data available.</p>';
            return;
        }
        
        // Generate HTML for each skill category
        skillsContainer.innerHTML = data.skills.map(category => `
            <div class="skill-category">
                <h3>
                    <i class="${category.icon || 'fas fa-code'}"></i>
                    ${category.category}
                </h3>
                <ul class="skill-list">
                    ${category.items.map(skill => `
                        <li class="skill-item">${skill}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
        
        console.log('Skills loaded successfully');
        
    } catch (error) {
        console.error('Error loading skills:', error);
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.innerHTML = `
            <div class="loading">
                Unable to load skills. Please check that data/skills.json exists.
            </div>
        `;
    }
}

// Load skills when page is ready
document.addEventListener('DOMContentLoaded', loadSkills);