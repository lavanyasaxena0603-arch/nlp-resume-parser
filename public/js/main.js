// ==============================
// GLOBAL STATE
// ==============================
let currentResumeData = null;

// ==============================
// LOADING SCREEN
// ==============================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingPercentage = document.getElementById('loadingPercentage');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }, 200);
});

// ==============================
// CUSTOM CURSOR
// ==============================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Cursor interactions
document.querySelectorAll('a, button, .upload-zone').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ==============================
// NAVIGATION
// ==============================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        const scrollPos = window.scrollY;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// ==============================
// TYPING EFFECT
// ==============================
const typingText = document.getElementById('typingText');
const phrases = [
    'with AI Intelligence',
    'in Seconds',
    'with Visual Analytics',
    'Effortlessly'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ==============================
// SCROLL REVEAL
// ==============================
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ==============================
// MAGNETIC BUTTONS
// ==============================
document.querySelectorAll('.magnetic-button').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ==============================
// SCROLL FUNCTIONS
// ==============================
function scrollToUpload() {
    document.getElementById('upload').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

// ==============================
// FILE UPLOAD
// ==============================
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const analyzeButton = document.getElementById('analyzeButton');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let selectedFile = null;

// Click to upload
uploadZone.addEventListener('click', () => {
    fileInput.click();
});

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// File input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
    }
    
    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.classList.remove('hidden');
    analyzeButton.disabled = false;
}

removeFile.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFile = null;
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    analyzeButton.disabled = true;
});

// Analyze button
analyzeButton.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    // Show progress
    uploadProgress.classList.remove('hidden');
    analyzeButton.disabled = true;
    
    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    try {
        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress > 90) progress = 90;
            progressFill.style.width = progress + '%';
        }, 200);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const result = await response.json();
        
        if (result.success) {
            currentResumeData = result.data;
            progressText.textContent = 'Analysis complete!';
            
            setTimeout(() => {
                // Show dashboard
                document.getElementById('dashboard').classList.remove('hidden');
                document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
                
                // Render dashboard
                renderDashboard(result.data);
            }, 1000);
        }
    } catch (error) {
        console.error('Error:', error);
        progressText.textContent = 'Upload failed. Please try again.';
        progressText.style.color = 'var(--primary)';
        analyzeButton.disabled = false;
    }
});

// ==============================
// DASHBOARD RENDERING
// ==============================
function renderDashboard(data) {
    renderPersonalInfo(data.personal);
    renderOverallScore(data.overallScore, data.strengths);
    renderSkills(data.skills, data.skillScores);
    renderExperienceTimeline(data.experience);
    renderJobMatchingRadar(data.jobMatching);
    renderResumeHeatmap(data.heatmapData);
    renderSkillConstellation(data.skills, data.skillScores);
    renderAISuggestions(data.improvements, data.skillGaps);
    renderJSONViewer(data);
}

function renderPersonalInfo(personal) {
    const container = document.getElementById('personalInfo');
    container.innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <i class="fas fa-user"></i>
                <div>
                    <strong>Name</strong>
                    <div>${personal.name}</div>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <strong>Email</strong>
                    <div>${personal.email}</div>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-phone"></i>
                <div>
                    <strong>Phone</strong>
                    <div>${personal.phone}</div>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Location</strong>
                    <div>${personal.location}</div>
                </div>
            </div>
        </div>
    `;
}

function renderOverallScore(score, strengths) {
    const canvas = document.getElementById('scoreCanvas');
    const ctx = canvas.getContext('2d');
    const detailsDiv = document.getElementById('scoreDetails');
    
    // Set canvas size
    canvas.width = 250;
    canvas.height = 250;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Score circle
    const percentage = score / 100;
    const endAngle = -Math.PI / 2 + (2 * Math.PI * percentage);
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FF6B9D');
    gradient.addColorStop(1, '#5DFFCB');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Score text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score, centerX, centerY);
    
    ctx.font = '16px Inter';
    ctx.fillStyle = '#B4B4C8';
    ctx.fillText('/100', centerX, centerY + 30);
    
    // Render strengths
    detailsDiv.innerHTML = `
        <div style="margin-top: 1.5rem;">
            <h4 style="margin-bottom: 1rem; color: var(--secondary);">Key Strengths</h4>
            ${strengths.map(strength => `
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                    <i class="fas fa-check-circle" style="color: var(--secondary);"></i>
                    <span>${strength}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSkills(skills, skillScores) {
    const container = document.getElementById('skillsContent');
    container.innerHTML = `
        <div class="skills-grid">
            ${skills.map(skill => `
                <div class="skill-tag">
                    <span>${skill}</span>
                    <span class="skill-score">${skillScores[skill]}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderExperienceTimeline(experience) {
    const container = document.getElementById('experienceTimeline');
    container.innerHTML = `
        <div class="timeline">
            ${experience.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-role">${exp.role}</div>
                    <div class="timeline-company">${exp.company}</div>
                    <div class="timeline-duration">${exp.duration}</div>
                    <div class="timeline-description">${exp.description}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderJobMatchingRadar(jobMatching) {
    const canvas = document.getElementById('radarCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 400;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;
    
    const jobs = Object.keys(jobMatching);
    const scores = Object.values(jobMatching);
    const angleStep = (2 * Math.PI) / jobs.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circles
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    jobs.forEach((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Draw labels
        const labelX = centerX + (radius + 40) * Math.cos(angle);
        const labelY = centerY + (radius + 40) * Math.sin(angle);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(jobs[i], labelX, labelY);
    });
    
    // Draw data polygon
    ctx.beginPath();
    scores.forEach((score, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const distance = (score / 100) * radius;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
    
    // Fill
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 107, 157, 0.4)');
    gradient.addColorStop(1, 'rgba(93, 255, 203, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Stroke
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw points
    scores.forEach((score, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const distance = (score / 100) * radius;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#5DFFCB';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function renderResumeHeatmap(heatmapData) {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 400;
    
    const categories = Object.keys(heatmapData);
    const values = Object.values(heatmapData);
    
    const barWidth = canvas.width * 0.7;
    const barHeight = 40;
    const spacing = 20;
    const startX = 50;
    const startY = (canvas.height - (barHeight + spacing) * categories.length) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    categories.forEach((category, i) => {
        const value = values[i];
        const y = startY + (barHeight + spacing) * i;
        
        // Background bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(startX, y, barWidth, barHeight);
        
        // Value bar with gradient
        const gradient = ctx.createLinearGradient(startX, 0, startX + barWidth, 0);
        const intensity = value / 100;
        
        if (intensity < 0.5) {
            gradient.addColorStop(0, '#C084FC');
            gradient.addColorStop(1, '#FF6B9D');
        } else {
            gradient.addColorStop(0, '#FF6B9D');
            gradient.addColorStop(1, '#5DFFCB');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, y, barWidth * (value / 100), barHeight);
        
        // Category label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Inter';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(category.charAt(0).toUpperCase() + category.slice(1), startX - 10, y + barHeight / 2);
        
        // Value text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'left';
        ctx.fillText(value, startX + barWidth + 10, y + barHeight / 2);
    });
}

function renderSkillConstellation(skills, skillScores) {
    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 400;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate node positions
    const nodes = skills.map((skill, i) => {
        const angle = (i / skills.length) * 2 * Math.PI;
        const radiusVariance = 100 + Math.random() * 50;
        
        return {
            skill,
            score: skillScores[skill],
            x: canvas.width / 2 + radiusVariance * Math.cos(angle),
            y: canvas.height / 2 + radiusVariance * Math.sin(angle),
            radius: 5 + (skillScores[skill] / 100) * 10
        };
    });
    
    // Draw connections
    ctx.strokeStyle = 'rgba(93, 255, 203, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
    
    // Draw nodes
    nodes.forEach(node => {
        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2);
        gradient.addColorStop(0, 'rgba(255, 107, 157, 0.5)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Node circle
        const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
        nodeGradient.addColorStop(0, '#5DFFCB');
        nodeGradient.addColorStop(1, '#FF6B9D');
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.skill, node.x, node.y - node.radius - 15);
        
        // Score
        ctx.font = '9px Inter';
        ctx.fillStyle = '#B4B4C8';
        ctx.fillText(node.score, node.x, node.y - node.radius - 5);
    });
}

function renderAISuggestions(improvements, skillGaps) {
    const container = document.getElementById('aiSuggestions');
    container.innerHTML = `
        <div class="suggestions-grid">
            <h4 style="margin-bottom: 1rem; font-size: 1.2rem;">💡 Improvement Suggestions</h4>
            ${improvements.map(improvement => `
                <div class="suggestion-item">
                    <i class="fas fa-arrow-up"></i>
                    <div class="suggestion-content">
                        <h4>${improvement}</h4>
                        <p>Recommended action to strengthen your profile</p>
                    </div>
                </div>
            `).join('')}
            
            <h4 style="margin-top: 2rem; margin-bottom: 1rem; font-size: 1.2rem;">🎯 Skill Gaps</h4>
            <div class="skills-grid">
                ${skillGaps.map(skill => `
                    <div class="skill-tag" style="opacity: 0.7; border-style: dashed;">
                        <span>${skill}</span>
                        <i class="fas fa-plus" style="color: var(--secondary);"></i>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderJSONViewer(data) {
    const container = document.getElementById('jsonViewer');
    container.textContent = JSON.stringify(data, null, 2);
}

// Copy JSON
document.getElementById('copyJson').addEventListener('click', () => {
    const jsonText = document.getElementById('jsonViewer').textContent;
    navigator.clipboard.writeText(jsonText).then(() => {
        const btn = document.getElementById('copyJson');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
});

// ==============================
// RESET DASHBOARD
// ==============================
function resetDashboard() {
    document.getElementById('dashboard').classList.add('hidden');
    selectedFile = null;
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    analyzeButton.disabled = true;
    uploadProgress.classList.add('hidden');
    progressFill.style.width = '0%';
    progressText.textContent = 'Uploading...';
    progressText.style.color = 'var(--text-dim)';
    
    document.getElementById('upload').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==============================
// MOUSE GLOW EFFECT
// ==============================
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    const rect = hero.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        hero.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 107, 157, 0.1), transparent 50%)`;
    }
});

console.log('%c🚀 ResumeAI Loaded Successfully!', 'color: #FF6B9D; font-size: 20px; font-weight: bold;');
console.log('%cBuilt by SRM Students with ❤️', 'color: #5DFFCB; font-size: 14px;');
