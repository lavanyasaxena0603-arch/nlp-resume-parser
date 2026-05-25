const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// Advanced NLP Resume Parser (Dummy logic with realistic patterns)
function parseResume(filename) {
  const fileContent = filename.toLowerCase();
  
  // Simulate NLP extraction
  const names = ['Alex Rivera', 'Jordan Chen', 'Morgan Taylor', 'Casey Williams', 'Riley Parker'];
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com'];
  
  const skillCategories = {
    programming: ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'TypeScript', 'PHP'],
    frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'SASS', 'Webpack'],
    backend: ['Node.js', 'Django', 'Flask', 'Spring Boot', 'Express', 'FastAPI', 'GraphQL'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'DynamoDB'],
    cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Agile']
  };
  
  // Generate skills
  const selectedSkills = [];
  const skillScore = {};
  Object.keys(skillCategories).forEach(category => {
    const categorySkills = skillCategories[category];
    const count = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < count; i++) {
      const skill = categorySkills[Math.floor(Math.random() * categorySkills.length)];
      if (!selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
        skillScore[skill] = Math.floor(Math.random() * 30) + 70; // 70-100 score
      }
    }
  });
  
  // Generate experience
  const companies = ['Tech Innovators Inc.', 'Digital Solutions Co.', 'CloudFirst Systems', 'DataDrive Labs', 'NexGen Software'];
  const roles = ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Engineer', 'DevOps Engineer'];
  const experience = [];
  const yearsCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < yearsCount; i++) {
    const startYear = 2024 - (i * 2 + 1);
    const endYear = i === 0 ? 'Present' : (startYear + 2).toString();
    experience.push({
      role: roles[Math.floor(Math.random() * roles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      duration: `${startYear} - ${endYear}`,
      description: 'Developed and maintained scalable web applications, collaborated with cross-functional teams, and implemented modern software solutions.'
    });
  }
  
  // Generate education
  const universities = ['SRM Institute of Science and Technology', 'MIT', 'Stanford University', 'UC Berkeley', 'Carnegie Mellon'];
  const degrees = ['B.Tech in Computer Science', 'M.S. in Software Engineering', 'B.S. in Information Technology'];
  
  const education = [{
    degree: degrees[Math.floor(Math.random() * degrees.length)],
    institution: universities[Math.floor(Math.random() * universities.length)],
    year: `${2020 + Math.floor(Math.random() * 4)} - ${2024}`,
    gpa: (3.2 + Math.random() * 0.8).toFixed(2)
  }];
  
  // Calculate overall score
  const overallScore = Math.floor(
    (selectedSkills.length * 3) + 
    (experience.length * 15) + 
    (education.length * 10) + 
    (Math.random() * 20)
  );
  
  // Job matching
  const jobRoles = {
    'Frontend Developer': Math.floor(Math.random() * 30) + 70,
    'Backend Developer': Math.floor(Math.random() * 30) + 65,
    'Full Stack Developer': Math.floor(Math.random() * 30) + 75,
    'DevOps Engineer': Math.floor(Math.random() * 30) + 60,
    'Data Scientist': Math.floor(Math.random() * 30) + 55,
    'ML Engineer': Math.floor(Math.random() * 30) + 50
  };
  
  // Skill gaps
  const allPossibleSkills = Object.values(skillCategories).flat();
  const missingSkills = allPossibleSkills
    .filter(skill => !selectedSkills.includes(skill))
    .slice(0, 8);
  
  const name = names[Math.floor(Math.random() * names.length)];
  
  return {
    personal: {
      name: name,
      email: `${name.split(' ')[0].toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      location: 'Chennai, Tamil Nadu, India'
    },
    skills: selectedSkills,
    skillScores: skillScore,
    experience: experience,
    education: education,
    summary: `${experience.length}+ years of experience in software development with expertise in modern web technologies and cloud infrastructure.`,
    overallScore: Math.min(overallScore, 100),
    jobMatching: jobRoles,
    skillGaps: missingSkills,
    strengths: [
      'Strong technical foundation',
      'Diverse skill set',
      'Proven work experience',
      'Good educational background'
    ],
    improvements: [
      'Consider adding certifications',
      'Expand cloud expertise',
      'Include project portfolio',
      'Add open source contributions'
    ],
    heatmapData: {
      technical: Math.floor(Math.random() * 30) + 70,
      experience: Math.floor(Math.random() * 30) + 65,
      education: Math.floor(Math.random() * 30) + 75,
      projects: Math.floor(Math.random() * 30) + 60,
      certifications: Math.floor(Math.random() * 30) + 50
    }
  };
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/upload', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Parse the resume
    const parsedData = parseResume(req.file.filename);
    
    // Clean up uploaded file
    setTimeout(() => {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }, 5000);
    
    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: parsedData
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to parse resume',
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NLP Resume Parser Server running on port ${PORT}`);
  console.log(`📁 Visit http://localhost:${PORT}`);
});
