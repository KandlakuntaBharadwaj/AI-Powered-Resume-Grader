const { detectDomains, extractKeywordsFromText, processDomainKeywords, isEquivalentPresentInResume } = require('../services/keywordService');
const { DOMAINS } = require('../data/keywordDatabase');

let passCount = 0;
let failCount = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  FAIL: ${testName}`);
    failCount++;
  }
};

console.log('=== RUNNING DOMAIN-AWARE KEYWORD SYSTEM TESTS ===\n');

// -------------------------------------------------------------
// Test 1: CSE Student Resume
// -------------------------------------------------------------
console.log('Test 1: CSE / Software Engineering Student');
const cseResume = `
John Doe
B.Tech in Computer Science and Engineering (CSE)
Skills: C++, Java, Python, JavaScript, ReactJS, Node.js, Express, MongoDB, Git, GitHub
Projects: Developed a full-stack social media web application using MERN stack and REST APIs.
Implemented user authentication with JWT. Experience with OOP, DSA, and DBMS.
Soft Skills: Strong problem solving, team collaboration, and communication.
`;

const cseDomains = detectDomains(cseResume, '');
assert(cseDomains.has('CSE'), 'Detects CSE domain accurately');

const cseProcessed = processDomainKeywords(cseResume, '', ['React', 'Node.js', 'MongoDB'], ['AutoCAD', 'Docker', 'AWS', 'VLSI Design']);
assert(cseProcessed.skillsAnalysis.matchingTechnicalSkills.includes('React.js'), 'Maps ReactJS to canonical React.js');
assert(cseProcessed.skillsAnalysis.matchingTechnicalSkills.includes('MongoDB'), 'Includes MongoDB');
assert(!cseProcessed.skillsAnalysis.missingTechnicalSkills.includes('React.js'), 'Does not mark React.js as missing when ReactJS is present');
assert(!cseProcessed.skillsAnalysis.missingTechnicalSkills.includes('AutoCAD'), 'Filters out AutoCAD from CSE missing keywords');
assert(!cseProcessed.skillsAnalysis.missingTechnicalSkills.includes('VLSI Design'), 'Filters out VLSI Design from CSE missing keywords');
assert(cseProcessed.skillsAnalysis.matchingSoftSkills.includes('Problem Solving'), 'Separates Problem Solving as soft skill');
assert(!cseProcessed.skillsAnalysis.matchingTechnicalSkills.includes('Problem Solving'), 'Soft skills not placed in technical skills');

// -------------------------------------------------------------
// Test 2: ECE Student Resume
// -------------------------------------------------------------
console.log('\nTest 2: ECE Student Resume');
const eceResume = `
Jane Smith
B.Tech in Electronics and Communication Engineering (ECE)
Skills: Embedded Systems, Microcontrollers, 8051, Arduino, Verilog, Digital Electronics, Analog Electronics, MATLAB
Projects: Smart home automation with IoT sensors and ESP32 microcontrollers. FPGA simulation using Xilinx.
`;

const eceDomains = detectDomains(eceResume, '');
assert(eceDomains.has('ECE'), 'Detects ECE domain accurately');

const eceProcessed = processDomainKeywords(eceResume, '', ['Verilog', 'MATLAB'], ['STAAD Pro', 'SolidWorks', 'VLSI Design', 'PCB Design']);
assert(eceProcessed.skillsAnalysis.matchingTechnicalSkills.includes('Verilog'), 'Includes Verilog in matching technical skills');
assert(!eceProcessed.skillsAnalysis.missingTechnicalSkills.includes('STAAD Pro'), 'Filters out Civil STAAD Pro from ECE missing skills');
assert(!eceProcessed.skillsAnalysis.missingTechnicalSkills.includes('SolidWorks'), 'Filters out Mechanical SolidWorks from ECE missing skills');
assert(eceProcessed.skillsAnalysis.missingTechnicalSkills.includes('VLSI Design') || eceProcessed.skillsAnalysis.missingTechnicalSkills.includes('PCB Design'), 'Suggests domain-relevant ECE skills (VLSI/PCB Design)');

// -------------------------------------------------------------
// Test 3: Mechanical Engineering Resume
// -------------------------------------------------------------
console.log('\nTest 3: Mechanical Engineering Student Resume');
const mechResume = `
Alex Kumar
Bachelor of Engineering in Mechanical Engineering
Skills: SolidWorks, AutoCAD, ANSYS Fluent, Thermodynamics, Fluid Mechanics, Manufacturing Processes, CNC Machining
Projects: Aerodynamic analysis of race car wing using CFD and FEA in ANSYS. 3D modeling and GD&T in SolidWorks.
`;

const mechDomains = detectDomains(mechResume, '');
assert(mechDomains.has('MECHANICAL'), 'Detects Mechanical domain accurately');

const mechProcessed = processDomainKeywords(mechResume, '', ['SolidWorks', 'ANSYS'], ['React.js', 'Express.js', 'CATIA', 'Robotics']);
assert(mechProcessed.skillsAnalysis.matchingTechnicalSkills.includes('SolidWorks'), 'Matches SolidWorks');
assert(!mechProcessed.skillsAnalysis.missingTechnicalSkills.includes('React.js'), 'Filters out Web dev React.js from Mechanical missing skills');
assert(!mechProcessed.skillsAnalysis.missingTechnicalSkills.includes('Express.js'), 'Filters out Express.js from Mechanical missing skills');

// -------------------------------------------------------------
// Test 4: Civil Engineering Resume
// -------------------------------------------------------------
console.log('\nTest 4: Civil Engineering Student Resume');
const civilResume = `
Priya Sharma
B.Tech in Civil Engineering
Skills: AutoCAD, STAAD.Pro, Revit, Structural Analysis, RCC Design, Surveying, Total Station, Concrete Technology
Projects: Seismic structural analysis of G+10 residential apartment using ETABS and IS 456 standards.
`;

const civilDomains = detectDomains(civilResume, '');
assert(civilDomains.has('CIVIL'), 'Detects Civil domain accurately');

const civilProcessed = processDomainKeywords(civilResume, '', ['AutoCAD', 'Revit'], ['Kubernetes', 'Docker', 'BIM', 'Quantity Estimation']);
assert(civilProcessed.skillsAnalysis.matchingTechnicalSkills.includes('AutoCAD'), 'Matches AutoCAD');
assert(!civilProcessed.skillsAnalysis.missingTechnicalSkills.includes('Kubernetes'), 'Filters out Kubernetes from Civil missing skills');
assert(!civilProcessed.skillsAnalysis.missingTechnicalSkills.includes('Docker'), 'Filters out Docker from Civil missing skills');

// -------------------------------------------------------------
// Test 5: Cross-Domain Job Description (ECE candidate applying for IoT / Backend role)
// -------------------------------------------------------------
console.log('\nTest 5: Cross-Domain Job Description');
const crossJD = `
Target Role: IoT Software Engineer
Required Qualifications: Embedded C, Python, REST APIs, Microservices, MQTT, AWS IoT Core, Linux.
`;

const crossDomains = detectDomains(eceResume, crossJD);
assert(crossDomains.has('ECE') || crossDomains.has('CSE'), 'Supports cross-domain when target job description requires it');

const crossProcessed = processDomainKeywords(eceResume, crossJD, [], []);
assert(crossProcessed.skillsAnalysis.missingTechnicalSkills.some(s => ['Python', 'REST API', 'AWS'].includes(s)), 'Identifies role-relevant missing skills from the job description');

// -------------------------------------------------------------
// Test 6: Equivalency Verification
// -------------------------------------------------------------
console.log('\nTest 6: Equivalency and Variation Checks');
assert(isEquivalentPresentInResume('K8s', 'Hands-on experience with Kubernetes clusters in production', new Set()), 'Recognizes K8s equivalent to Kubernetes');
assert(isEquivalentPresentInResume('PostgreSQL', 'Built relational schema on Postgres database', new Set()), 'Recognizes Postgres equivalent to PostgreSQL');
assert(isEquivalentPresentInResume('DSA', 'Strong proficiency in Data Structures and Algorithms', new Set()), 'Recognizes DSA equivalent to Data Structures and Algorithms');

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
}
