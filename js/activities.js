/**
 * ACTIVITIES.JS - Activities/Experience Section Dynamic Loader
 * Fetches and displays activities from activities.json
 */

/**
 * Load and display activities/experience from JSON file
 * Activities include: workshops, hackathons, academic projects, etc.
 * Displayed in a timeline format
 */
async function loadActivities() {
    try {
        const response = await fetch('data/activities.json');
        if (!response.ok) throw new Error('Failed to load activities data');
        
        const data = await response.json();
        const activitiesTimeline = document.getElementById('activitiesTimeline');
        
        if (!data.activities || data.activities.length === 0) {
            activitiesTimeline.innerHTML = '<p class="loading">No activities available yet.</p>';
            return;
        }
        
        // Sort activities by date (most recent first)
        const sortedActivities = data.activities.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Generate HTML for each activity in timeline format
        activitiesTimeline.innerHTML = sortedActivities.map(activity => `
            <div class="timeline-item">
                <div class="timeline-content">
                    <p class="timeline-date">
                        <i class="far fa-calendar"></i>
                        ${formatDate(activity.date)}
                    </p>
                    <h3 class="timeline-title">${activity.title}</h3>
                    ${activity.organization ? `
                        <p style="color: var(--accent-color); font-weight: 500; margin-bottom: 0.5rem;">
                            ${activity.organization}
                        </p>
                    ` : ''}
                    <p class="timeline-description">${activity.description}</p>
                    ${activity.achievements && activity.achievements.length > 0 ? `
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem; color: var(--text-light);">
                            ${activity.achievements.map(achievement => `
                                <li style="margin-bottom: 0.25rem;">${achievement}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        console.log(`${sortedActivities.length} activities loaded successfully`);
        
    } catch (error) {
        console.error('Error loading activities:', error);
        const activitiesTimeline = document.getElementById('activitiesTimeline');
        activitiesTimeline.innerHTML = `
            <div class="loading">
                Unable to load activities. Please check that data/activities.json exists.
            </div>
        `;
    }
}

/**
 * Format date string to readable format
 * @param {string} dateString - Date in YYYY-MM-DD or YYYY-MM format
 * @returns {string} - Formatted date (e.g., "January 2024")
 */
function formatDate(dateString) {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid
    }
    
    return date.toLocaleDateString('en-US', options);
}

// Load activities when page is ready
document.addEventListener('DOMContentLoaded', loadActivities);