/**
 * Comprehensive Domain-Aware Keyword Database for ResumeGrader.AI
 * Supports engineering domains: CSE, AI/ML, Data Science, Cybersecurity, ECE, EEE, Mechanical, Civil
 * plus professional job-specific soft & methodology skills.
 */

const DOMAINS = {
  CSE: {
    id: 'CSE',
    name: 'Computer Science & Software Engineering',
    identifiers: [
      'computer science', 'cse', 'software engineer', 'software developer', 'web developer',
      'full stack', 'frontend', 'backend', 'information technology', 'it engineering',
      'computer engineering', 'systems engineer', 'devops', 'cloud engineer', 'app developer'
    ]
  },
  AI_ML: {
    id: 'AI_ML',
    name: 'Artificial Intelligence & Machine Learning',
    identifiers: [
      'machine learning', 'artificial intelligence', 'ai/ml', 'deep learning', 'nlp',
      'computer vision', 'ai engineer', 'ml engineer', 'data science & ai', 'llm', 'generative ai'
    ]
  },
  DATA_SCIENCE: {
    id: 'DATA_SCIENCE',
    name: 'Data Science & Data Analytics',
    identifiers: [
      'data science', 'data scientist', 'data analyst', 'business analyst', 'data engineering',
      'big data', 'analytics', 'statistics', 'bi analyst', 'business intelligence'
    ]
  },
  CYBERSECURITY: {
    id: 'CYBERSECURITY',
    name: 'Cybersecurity & Information Security',
    identifiers: [
      'cybersecurity', 'cyber security', 'information security', 'infosec', 'soc analyst',
      'penetration tester', 'ethical hacker', 'network security', 'security engineer', 'vulnerability'
    ]
  },
  ECE: {
    id: 'ECE',
    name: 'Electronics & Communication Engineering',
    identifiers: [
      'electronics and communication', 'electronics & communication', 'ece', 'electronics engineering',
      'vlsi', 'embedded systems', 'telecommunication', 'signal processing', 'microelectronics'
    ]
  },
  EEE: {
    id: 'EEE',
    name: 'Electrical & Electronics Engineering',
    identifiers: [
      'electrical and electronics', 'electrical & electronics', 'eee', 'electrical engineering',
      'power systems', 'power electronics', 'electrical machines', 'control systems', 'smart grid'
    ]
  },
  MECHANICAL: {
    id: 'MECHANICAL',
    name: 'Mechanical Engineering',
    identifiers: [
      'mechanical engineering', 'mechanical engineer', 'mechatronics', 'automobile engineering',
      'automotive engineer', 'thermal engineering', 'cad/cam', 'solidworks', 'ansys', 'manufacturing'
    ]
  },
  CIVIL: {
    id: 'CIVIL',
    name: 'Civil Engineering',
    identifiers: [
      'civil engineering', 'civil engineer', 'structural engineering', 'structural engineer',
      'construction engineering', 'transportation engineering', 'geotechnical', 'surveying', 'bim'
    ]
  }
};

/**
 * Keyword definitions with canonical name, category, domain(s), type, and matching variations.
 */
const KEYWORDS = [
  // =========================================================================
  // 1. CSE / SOFTWARE ENGINEERING
  // =========================================================================
  // Programming Languages
  {
    canonical: 'C',
    category: 'Programming',
    domains: ['CSE', 'ECE'],
    type: 'technical',
    variations: [/\bC\b(?!#|\+\+|[a-zA-Z0-9_])/i, /\bC Programming\b/i],
    exactWord: true
  },
  {
    canonical: 'C++',
    category: 'Programming',
    domains: ['CSE', 'ECE'],
    type: 'technical',
    variations: [/\bC\+\+\b/i, /\bCPP\b/i, /\bC Plus Plus\b/i]
  },
  {
    canonical: 'Java',
    category: 'Programming',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bJava\b(?!script)/i, /\bCore Java\b/i, /\bAdvanced Java\b/i]
  },
  {
    canonical: 'Python',
    category: 'Programming',
    domains: ['CSE', 'AI_ML', 'DATA_SCIENCE', 'CYBERSECURITY', 'ECE'],
    type: 'technical',
    variations: [/\bPython\b/i, /\bPython3\b/i, /\bPython 3\b/i]
  },
  {
    canonical: 'JavaScript',
    category: 'Programming',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bJavaScript\b/i, /\bJS\b/i, /\bES6\+?\b/i, /\bECMAScript\b/i]
  },
  {
    canonical: 'TypeScript',
    category: 'Programming',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bTypeScript\b/i, /\bTS\b/i]
  },
  {
    canonical: 'C#',
    category: 'Programming',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bC#\b/i, /\bC-Sharp\b/i, /\bCSharp\b/i, /\b\.NET C#\b/i]
  },

  // Core CS
  {
    canonical: 'DSA',
    category: 'Core CS',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bDSA\b/i, /\bData Structures and Algorithms\b/i, /\bData Structures & Algorithms\b/i, /\bData Structures\b/i, /\bAlgorithms\b/i]
  },
  {
    canonical: 'OOP',
    category: 'Core CS',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bOOPs?\b/i, /\bObject[- ]Oriented Programming\b/i, /\bObject Oriented Concepts\b/i]
  },
  {
    canonical: 'DBMS',
    category: 'Core CS',
    domains: ['CSE', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bDBMS\b/i, /\bDatabase Management Systems?\b/i, /\bRDBMS\b/i]
  },
  {
    canonical: 'Operating Systems',
    category: 'Core CS',
    domains: ['CSE', 'ECE'],
    type: 'technical',
    variations: [/\bOperating Systems?\b/i, /\bOS Concepts\b/i, /\bUnix\/Linux OS\b/i]
  },
  {
    canonical: 'Computer Networks',
    category: 'Core CS',
    domains: ['CSE', 'CYBERSECURITY', 'ECE'],
    type: 'technical',
    variations: [/\bComputer Networks?\b/i, /\bTCP\/IP\b/i, /\bNetwork Protocols\b/i, /\bOSI Model\b/i]
  },
  {
    canonical: 'Software Engineering',
    category: 'Core CS',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bSoftware Engineering\b/i, /\bSDLC\b/i, /\bSoftware Development Life Cycle\b/i, /\bDesign Patterns\b/i]
  },

  // Web Technologies
  {
    canonical: 'HTML',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bHTML5?\b/i, /\bHypertext Markup Language\b/i]
  },
  {
    canonical: 'CSS',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bCSS3?\b/i, /\bCascading Style Sheets\b/i, /\bSass\b/i, /\bSCSS\b/i, /\bTailwind\b/i, /\bBootstrap\b/i]
  },
  {
    canonical: 'React.js',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bReact\.js\b/i, /\bReactjs\b/i, /\bReact\b/i, /\bNext\.?js\b/i]
  },
  {
    canonical: 'Angular',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bAngular\b/i, /\bAngularJS\b/i, /\bAngular 2\+?\b/i]
  },
  {
    canonical: 'Vue.js',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bVue\.?js\b/i, /\bVueJS\b/i, /\bVue\b/i, /\bNuxt\.?js\b/i]
  },
  {
    canonical: 'Node.js',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bNode\.?js\b/i, /\bNodeJS\b/i, /\bNode\b/i]
  },
  {
    canonical: 'Express.js',
    category: 'Web',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bExpress\.?js\b/i, /\bExpressJS\b/i, /\bExpress\b/i]
  },

  // Databases
  {
    canonical: 'MySQL',
    category: 'Database',
    domains: ['CSE', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bMySQL\b/i, /\bMy-SQL\b/i]
  },
  {
    canonical: 'PostgreSQL',
    category: 'Database',
    domains: ['CSE', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bPostgreSQL\b/i, /\bPostgres\b/i, /\bPostgres DB\b/i]
  },
  {
    canonical: 'MongoDB',
    category: 'Database',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bMongoDB\b/i, /\bMongo\b/i, /\bNoSQL MongoDB\b/i]
  },
  {
    canonical: 'Redis',
    category: 'Database',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bRedis\b/i, /\bRedis Cache\b/i]
  },
  {
    canonical: 'Oracle',
    category: 'Database',
    domains: ['CSE', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bOracle Database\b/i, /\bOracle DB\b/i, /\bPL\/SQL\b/i, /\bOracle\b/i]
  },

  // Tools
  {
    canonical: 'Git',
    category: 'Tools',
    domains: ['CSE', 'AI_ML', 'DATA_SCIENCE', 'ECE'],
    type: 'tool',
    variations: [/\bGit\b(?!hub|lab)/i, /\bVersion Control \(Git\)\b/i]
  },
  {
    canonical: 'GitHub',
    category: 'Tools',
    domains: ['CSE', 'AI_ML', 'DATA_SCIENCE', 'ECE'],
    type: 'tool',
    variations: [/\bGitHub\b/i, /\bGitLab\b/i, /\bBitbucket\b/i]
  },
  {
    canonical: 'Docker',
    category: 'Tools',
    domains: ['CSE', 'AI_ML', 'CYBERSECURITY'],
    type: 'tool',
    variations: [/\bDocker\b/i, /\bContainerization\b/i, /\bDocker Compose\b/i]
  },
  {
    canonical: 'Kubernetes',
    category: 'Tools',
    domains: ['CSE', 'CYBERSECURITY'],
    type: 'tool',
    variations: [/\bKubernetes\b/i, /\bK8s\b/i]
  },
  {
    canonical: 'Postman',
    category: 'Tools',
    domains: ['CSE'],
    type: 'tool',
    variations: [/\bPostman\b/i, /\bAPI Testing \(Postman\)\b/i, /\bSwagger\b/i]
  },
  {
    canonical: 'Linux',
    category: 'Tools',
    domains: ['CSE', 'CYBERSECURITY', 'ECE'],
    type: 'tool',
    variations: [/\bLinux\b/i, /\bUbuntu\b/i, /\bBash Scripting\b/i, /\bShell Scripting\b/i, /\bUnix\b/i]
  },

  // Backend
  {
    canonical: 'REST API',
    category: 'Backend',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bREST API\b/i, /\bRESTful APIs?\b/i, /\bREST\b/i, /\bWeb APIs?\b/i]
  },
  {
    canonical: 'GraphQL',
    category: 'Backend',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bGraphQL\b/i, /\bApollo GraphQL\b/i]
  },
  {
    canonical: 'Microservices',
    category: 'Backend',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bMicroservices\b/i, /\bMicroservice Architecture\b/i, /\bDistributed Systems\b/i]
  },
  {
    canonical: 'Authentication',
    category: 'Backend',
    domains: ['CSE', 'CYBERSECURITY'],
    type: 'technical',
    variations: [/\bAuthentication\b/i, /\bAuth0\b/i, /\bOAuth2?\.0?\b/i, /\bSSO\b/i, /\bAuthorization\b/i]
  },
  {
    canonical: 'JWT',
    category: 'Backend',
    domains: ['CSE', 'CYBERSECURITY'],
    type: 'technical',
    variations: [/\bJWT\b/i, /\bJSON Web Tokens?\b/i]
  },

  // Cloud & DevOps
  {
    canonical: 'AWS',
    category: 'Cloud',
    domains: ['CSE', 'AI_ML', 'DATA_SCIENCE', 'CYBERSECURITY'],
    type: 'technical',
    variations: [/\bAWS\b/i, /\bAmazon Web Services\b/i, /\bEC2\b/i, /\bS3\b/i, /\bLambda\b/i]
  },
  {
    canonical: 'Azure',
    category: 'Cloud',
    domains: ['CSE', 'CYBERSECURITY', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bAzure\b/i, /\bMicrosoft Azure\b/i]
  },
  {
    canonical: 'Google Cloud',
    category: 'Cloud',
    domains: ['CSE', 'DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bGoogle Cloud Platform\b/i, /\bGoogle Cloud\b/i, /\bGCP\b/i]
  },
  {
    canonical: 'CI/CD',
    category: 'Cloud',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bCI\/CD\b/i, /\bContinuous Integration\b/i, /\bGitHub Actions\b/i, /\bGitlab CI\b/i]
  },
  {
    canonical: 'DevOps',
    category: 'Cloud',
    domains: ['CSE'],
    type: 'technical',
    variations: [/\bDevOps\b/i, /\bInfrastructure as Code\b/i, /\bTerraform\b/i, /\bAnsible\b/i]
  },

  // =========================================================================
  // 2. ARTIFICIAL INTELLIGENCE / MACHINE LEARNING
  // =========================================================================
  {
    canonical: 'Machine Learning',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE', 'CSE'],
    type: 'technical',
    variations: [/\bMachine Learning\b/i, /\bML\b/i, /\bStatistical Learning\b/i]
  },
  {
    canonical: 'Deep Learning',
    category: 'AI / Machine Learning',
    domains: ['AI_ML'],
    type: 'technical',
    variations: [/\bDeep Learning\b/i, /\bDL\b/i]
  },
  {
    canonical: 'Neural Networks',
    category: 'AI / Machine Learning',
    domains: ['AI_ML'],
    type: 'technical',
    variations: [/\bNeural Networks?\b/i, /\bANN\b/i, /\bCNN\b/i, /\bRNN\b/i, /\bLSTM\b/i, /\bTransformers\b/i]
  },
  {
    canonical: 'NLP',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bNLP\b/i, /\bNatural Language Processing\b/i, /\bText Processing\b/i, /\bNLTK\b/i, /\bSpacy\b/i]
  },
  {
    canonical: 'Computer Vision',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'ECE'],
    type: 'technical',
    variations: [/\bComputer Vision\b/i, /\bImage Processing\b/i, /\bOpenCV\b/i, /\bObject Detection\b/i]
  },
  {
    canonical: 'TensorFlow',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'tool',
    variations: [/\bTensorFlow\b/i, /\bTF\b/i]
  },
  {
    canonical: 'PyTorch',
    category: 'AI / Machine Learning',
    domains: ['AI_ML'],
    type: 'tool',
    variations: [/\bPyTorch\b/i, /\bTorch\b/i]
  },
  {
    canonical: 'Scikit-learn',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'tool',
    variations: [/\bScikit[- ]learn\b/i, /\bSklearn\b/i]
  },
  {
    canonical: 'Keras',
    category: 'AI / Machine Learning',
    domains: ['AI_ML'],
    type: 'tool',
    variations: [/\bKeras\b/i]
  },
  {
    canonical: 'Supervised Learning',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bSupervised Learning\b/i]
  },
  {
    canonical: 'Unsupervised Learning',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bUnsupervised Learning\b/i]
  },
  {
    canonical: 'Reinforcement Learning',
    category: 'AI / Machine Learning',
    domains: ['AI_ML'],
    type: 'technical',
    variations: [/\bReinforcement Learning\b/i, /\bQ-learning\b/i, /\bRL\b/i]
  },
  {
    canonical: 'Feature Engineering',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bFeature Engineering\b/i, /\bFeature Selection\b/i, /\bDimensionality Reduction\b/i, /\bPCA\b/i]
  },
  {
    canonical: 'Model Training',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bModel Training\b/i, /\bModel Fitting\b/i, /\bTransfer Learning\b/i, /\bFine[- ]Tuning\b/i]
  },
  {
    canonical: 'Model Evaluation',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bModel Evaluation\b/i, /\bCross-Validation\b/i, /\bConfusion Matrix\b/i, /\bROC[- ]AUC\b/i, /\bF1[- ]Score\b/i]
  },
  {
    canonical: 'Generative AI',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'CSE'],
    type: 'technical',
    variations: [/\bGenerative AI\b/i, /\bGenAI\b/i, /\bDiffusion Models\b/i, /\bGANs?\b/i]
  },
  {
    canonical: 'LLM',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'CSE'],
    type: 'technical',
    variations: [/\bLLMs?\b/i, /\bLarge Language Models?\b/i, /\bLlama\b/i, /\bGPT\b/i, /\bMistral\b/i]
  },
  {
    canonical: 'RAG',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'CSE'],
    type: 'technical',
    variations: [/\bRAG\b/i, /\bRetrieval[- ]Augmented Generation\b/i, /\bVector Databases?\b/i, /\bPinecone\b/i, /\bChromaDB\b/i]
  },
  {
    canonical: 'Prompt Engineering',
    category: 'AI / Machine Learning',
    domains: ['AI_ML', 'CSE'],
    type: 'technical',
    variations: [/\bPrompt Engineering\b/i, /\bPrompt Design\b/i, /\bFew-Shot Prompting\b/i]
  },

  // =========================================================================
  // 3. DATA SCIENCE / DATA ANALYTICS
  // =========================================================================
  {
    canonical: 'R',
    category: 'Data Science',
    domains: ['DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bR Programming\b/i, /\bR Language\b/i, /\bRStudio\b/i]
  },
  {
    canonical: 'SQL',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'CSE'],
    type: 'technical',
    variations: [/\bSQL\b/i, /\bStructured Query Language\b/i, /\bComplex SQL Queries\b/i]
  },
  {
    canonical: 'Statistics',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bStatistics\b/i, /\bStatistical Analysis\b/i, /\bInferential Statistics\b/i, /\bHypothesis Testing\b/i]
  },
  {
    canonical: 'Probability',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bProbability\b/i, /\bBayesian Probability\b/i, /\bProbability Distributions\b/i]
  },
  {
    canonical: 'NumPy',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'tool',
    variations: [/\bNumPy\b/i]
  },
  {
    canonical: 'Pandas',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'tool',
    variations: [/\bPandas\b/i, /\bDataFrames\b/i]
  },
  {
    canonical: 'Matplotlib',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'tool',
    variations: [/\bMatplotlib\b/i]
  },
  {
    canonical: 'Seaborn',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'tool',
    variations: [/\bSeaborn\b/i]
  },
  {
    canonical: 'Power BI',
    category: 'Data Analytics',
    domains: ['DATA_SCIENCE'],
    type: 'tool',
    variations: [/\bPower BI\b/i, /\bPowerBI\b/i, /\bDAX\b/i]
  },
  {
    canonical: 'Tableau',
    category: 'Data Analytics',
    domains: ['DATA_SCIENCE'],
    type: 'tool',
    variations: [/\bTableau\b/i, /\bTableau Desktop\b/i]
  },
  {
    canonical: 'Excel',
    category: 'Data Analytics',
    domains: ['DATA_SCIENCE', 'CIVIL', 'MECHANICAL', 'EEE'],
    type: 'tool',
    variations: [/\bMicrosoft Excel\b/i, /\bAdvanced Excel\b/i, /\bVLOOKUP\b/i, /\bPivot Tables\b/i, /\bExcel\b/i]
  },
  {
    canonical: 'Data Cleaning',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bData Cleaning\b/i, /\bData Wrangling\b/i, /\bData Cleansing\b/i]
  },
  {
    canonical: 'Data Preprocessing',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bData Preprocessing\b/i, /\bData Transformation\b/i, /\bNormalization\b/i]
  },
  {
    canonical: 'EDA',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bEDA\b/i, /\bExploratory Data Analysis\b/i]
  },
  {
    canonical: 'Data Visualization',
    category: 'Data Science',
    domains: ['DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bData Visualization\b/i, /\bVisual Analytics\b/i, /\bDashboard Design\b/i]
  },
  {
    canonical: 'Predictive Analytics',
    category: 'Data Science',
    domains: ['DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bPredictive Analytics\b/i, /\bPredictive Modeling\b/i, /\bForecasting\b/i]
  },
  {
    canonical: 'Data Mining',
    category: 'Data Science',
    domains: ['DATA_SCIENCE'],
    type: 'technical',
    variations: [/\bData Mining\b/i, /\bPattern Recognition\b/i]
  },
  {
    canonical: 'Regression',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bLinear Regression\b/i, /\bLogistic Regression\b/i, /\bRegression Models?\b/i, /\bRegression\b/i]
  },
  {
    canonical: 'Classification',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bClassification\b/i, /\bBinary Classification\b/i, /\bMulti-class Classification\b/i, /\bDecision Trees\b/i, /\bRandom Forest\b/i]
  },
  {
    canonical: 'Clustering',
    category: 'Data Science',
    domains: ['DATA_SCIENCE', 'AI_ML'],
    type: 'technical',
    variations: [/\bClustering\b/i, /\bK-Means\b/i, /\bHierarchical Clustering\b/i, /\bDBSCAN\b/i]
  },

  // =========================================================================
  // 4. CYBERSECURITY
  // =========================================================================
  {
    canonical: 'Network Security',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY', 'CSE'],
    type: 'technical',
    variations: [/\bNetwork Security\b/i, /\bVPN\b/i, /\bNetwork Hardening\b/i]
  },
  {
    canonical: 'Information Security',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bInformation Security\b/i, /\bInfoSec\b/i, /\bData Protection\b/i]
  },
  {
    canonical: 'Application Security',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY', 'CSE'],
    type: 'technical',
    variations: [/\bApplication Security\b/i, /\bAppSec\b/i, /\bSecure Code Review\b/i]
  },
  {
    canonical: 'Ethical Hacking',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bEthical Hacking\b/i, /\bWhite Hat Hacking\b/i, /\bCEH\b/i]
  },
  {
    canonical: 'Penetration Testing',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bPenetration Testing\b/i, /\bPen Testing\b/i, /\bPentest\b/i]
  },
  {
    canonical: 'Vulnerability Assessment',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bVulnerability Assessment\b/i, /\bVAPT\b/i, /\bNessus\b/i, /\bCVE\b/i]
  },
  {
    canonical: 'Cryptography',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY', 'CSE'],
    type: 'technical',
    variations: [/\bCryptography\b/i, /\bCryptographic Algorithms\b/i, /\bRSA\b/i, /\bAES\b/i, /\bHashing\b/i]
  },
  {
    canonical: 'Encryption',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY', 'CSE'],
    type: 'technical',
    variations: [/\bEncryption\b/i, /\bDecryption\b/i, /\bSSL\/TLS\b/i, /\bEnd-to-End Encryption\b/i]
  },
  {
    canonical: 'Firewall',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bFirewalls?\b/i, /\bWAF\b/i, /\bNext-Gen Firewall\b/i, /\bPalo Alto\b/i]
  },
  {
    canonical: 'IDS',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bIDS\b/i, /\bIntrusion Detection Systems?\b/i, /\bSnort\b/i, /\bSuricata\b/i]
  },
  {
    canonical: 'IPS',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bIPS\b/i, /\bIntrusion Prevention Systems?\b/i]
  },
  {
    canonical: 'SIEM',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bSIEM\b/i, /\bSplunk\b/i, /\bQRadar\b/i, /\bLog Analysis\b/i]
  },
  {
    canonical: 'SOC',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bSOC\b/i, /\bSecurity Operations Center\b/i, /\bSOC Analyst\b/i]
  },
  {
    canonical: 'Incident Response',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bIncident Response\b/i, /\bThreat Hunting\b/i, /\bSecurity Incident\b/i]
  },
  {
    canonical: 'OWASP',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY', 'CSE'],
    type: 'technical',
    variations: [/\bOWASP\b/i, /\bOWASP Top 10\b/i, /\bXSS\b/i, /\bSQL Injection\b/i, /\bCSRF\b/i]
  },
  {
    canonical: 'Kali Linux',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'tool',
    variations: [/\bKali Linux\b/i, /\bKali\b/i]
  },
  {
    canonical: 'Wireshark',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY', 'CSE', 'ECE'],
    type: 'tool',
    variations: [/\bWireshark\b/i, /\bPacket Capture\b/i, /\bPacket Analysis\b/i]
  },
  {
    canonical: 'Nmap',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'tool',
    variations: [/\bNmap\b/i, /\bPort Scanning\b/i, /\bNetwork Scanning\b/i]
  },
  {
    canonical: 'Digital Forensics',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bDigital Forensics\b/i, /\bComputer Forensics\b/i, /\bEnCase\b/i, /\bAutopsy\b/i]
  },
  {
    canonical: 'Risk Assessment',
    category: 'Cybersecurity',
    domains: ['CYBERSECURITY'],
    type: 'technical',
    variations: [/\bRisk Assessment\b/i, /\bThreat Assessment\b/i, /\bISO 27001\b/i, /\bNIST Framework\b/i]
  },

  // =========================================================================
  // 5. ECE (ELECTRONICS & COMMUNICATION ENGINEERING)
  // =========================================================================
  {
    canonical: 'Digital Electronics',
    category: 'ECE',
    domains: ['ECE', 'EEE'],
    type: 'technical',
    variations: [/\bDigital Electronics\b/i, /\bDigital Logic Design\b/i, /\bCombinational Circuits\b/i, /\bSequential Circuits\b/i]
  },
  {
    canonical: 'Analog Electronics',
    category: 'ECE',
    domains: ['ECE', 'EEE'],
    type: 'technical',
    variations: [/\bAnalog Electronics\b/i, /\bOp-Amps?\b/i, /\bOperational Amplifiers?\b/i, /\bTransistors\b/i, /\bBJT\b/i, /\bMOSFET\b/i]
  },
  {
    canonical: 'VLSI Design',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bVLSI Design\b/i, /\bVLSI\b/i, /\bASIC Design\b/i, /\bCMOS\b/i, /\bRTL Design\b/i, /\bCadence\b/i, /\bSynopsys\b/i]
  },
  {
    canonical: 'Embedded Systems',
    category: 'ECE',
    domains: ['ECE', 'EEE', 'MECHANICAL'],
    type: 'technical',
    variations: [/\bEmbedded Systems?\b/i, /\bEmbedded C\b/i, /\bRTOS\b/i, /\bFirmware Development\b/i]
  },
  {
    canonical: 'Microcontrollers',
    category: 'ECE',
    domains: ['ECE', 'EEE'],
    type: 'technical',
    variations: [/\bMicrocontrollers?\b/i, /\bMCU\b/i, /\b8051\b/i, /\bPIC Microcontroller\b/i, /\bAVR\b/i, /\bArduino\b/i, /\bESP32\b/i, /\bSTM32\b/i]
  },
  {
    canonical: 'Microprocessors',
    category: 'ECE',
    domains: ['ECE', 'CSE'],
    type: 'technical',
    variations: [/\bMicroprocessors?\b/i, /\b8086\b/i, /\b8085\b/i, /\bx86 Architecture\b/i]
  },
  {
    canonical: 'Verilog',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bVerilog\b/i, /\bSystemVerilog\b/i]
  },
  {
    canonical: 'VHDL',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bVHDL\b/i, /\bHDL\b/i]
  },
  {
    canonical: 'FPGA',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bFPGA\b/i, /\bXilinx\b/i, /\bVivado\b/i, /\bAltera\b/i]
  },
  {
    canonical: 'PCB Design',
    category: 'ECE',
    domains: ['ECE', 'EEE'],
    type: 'technical',
    variations: [/\bPCB Design\b/i, /\bPrinted Circuit Board\b/i, /\bAltium Designer\b/i, /\bEagle PCB\b/i, /\bKiCAD\b/i]
  },
  {
    canonical: 'Signal Processing',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bSignal Processing\b/i, /\bDigital Signal Processing\b/i, /\bDSP\b/i, /\bFFT\b/i]
  },
  {
    canonical: 'Communication Systems',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bCommunication Systems?\b/i, /\bWireless Communication\b/i, /\b5G\/4G\b/i, /\bModulation\b/i, /\bOptical Communication\b/i]
  },
  {
    canonical: 'MATLAB',
    category: 'ECE',
    domains: ['ECE', 'EEE', 'MECHANICAL'],
    type: 'tool',
    variations: [/\bMATLAB\b/i]
  },
  {
    canonical: 'Simulink',
    category: 'ECE',
    domains: ['ECE', 'EEE', 'MECHANICAL'],
    type: 'tool',
    variations: [/\bSimulink\b/i]
  },
  {
    canonical: 'IoT',
    category: 'ECE',
    domains: ['ECE', 'CSE', 'EEE'],
    type: 'technical',
    variations: [/\bIoT\b/i, /\bInternet of Things\b/i, /\bMQTT\b/i, /\bSensors and Actuators\b/i]
  },
  {
    canonical: 'ARM Architecture',
    category: 'ECE',
    domains: ['ECE'],
    type: 'technical',
    variations: [/\bARM Architecture\b/i, /\bARM Cortex\b/i, /\bARM Processor\b/i]
  },

  // =========================================================================
  // 6. EEE (ELECTRICAL & ELECTRONICS ENGINEERING)
  // =========================================================================
  {
    canonical: 'Electrical Machines',
    category: 'EEE',
    domains: ['EEE'],
    type: 'technical',
    variations: [/\bElectrical Machines\b/i, /\bTransformers\b/i, /\bInduction Motors?\b/i, /\bSynchronous Machines?\b/i, /\bDC Machines?\b/i]
  },
  {
    canonical: 'Power Systems',
    category: 'EEE',
    domains: ['EEE'],
    type: 'technical',
    variations: [/\bPower Systems?\b/i, /\bLoad Flow Analysis\b/i, /\bFault Analysis\b/i, /\bTransmission & Distribution\b/i]
  },
  {
    canonical: 'Power Electronics',
    category: 'EEE',
    domains: ['EEE', 'ECE'],
    type: 'technical',
    variations: [/\bPower Electronics\b/i, /\bInverters?\b/i, /\bConverters?\b/i, /\bChoppers\b/i, /\bSMPS\b/i, /\bRectifiers\b/i]
  },
  {
    canonical: 'Electrical Circuits',
    category: 'EEE',
    domains: ['EEE', 'ECE'],
    type: 'technical',
    variations: [/\bElectrical Circuits\b/i, /\bCircuit Theory\b/i, /\bNetwork Analysis\b/i, /\bKCL\/KVL\b/i]
  },
  {
    canonical: 'Control Systems',
    category: 'EEE',
    domains: ['EEE', 'ECE', 'MECHANICAL'],
    type: 'technical',
    variations: [/\bControl Systems?\b/i, /\bPID Controllers?\b/i, /\bBode Plot\b/i, /\bState Space\b/i, /\bFeedback Control\b/i]
  },
  {
    canonical: 'PLC',
    category: 'EEE',
    domains: ['EEE', 'MECHANICAL'],
    type: 'technical',
    variations: [/\bPLC\b/i, /\bProgrammable Logic Controllers?\b/i, /\bLadder Logic\b/i, /\bSiemens PLC\b/i]
  },
  {
    canonical: 'SCADA',
    category: 'EEE',
    domains: ['EEE', 'MECHANICAL'],
    type: 'technical',
    variations: [/\bSCADA\b/i, /\bIndustrial Automation\b/i, /\bHMI\b/i]
  },
  {
    canonical: 'Power Distribution',
    category: 'EEE',
    domains: ['EEE'],
    type: 'technical',
    variations: [/\bPower Distribution\b/i, /\bSubstation\b/i, /\bSwitchgear\b/i, /\bCircuit Breakers\b/i, /\bRelay Protection\b/i]
  },
  {
    canonical: 'Renewable Energy',
    category: 'EEE',
    domains: ['EEE', 'MECHANICAL'],
    type: 'technical',
    variations: [/\bRenewable Energy\b/i, /\bSolar Energy\b/i, /\bSolar PV\b/i, /\bWind Energy\b/i, /\bGreen Energy\b/i]
  },
  {
    canonical: 'Smart Grid',
    category: 'EEE',
    domains: ['EEE'],
    type: 'technical',
    variations: [/\bSmart Grid\b/i, /\bMicrogrid\b/i, /\bEnergy Management Systems?\b/i, /\bAMI\b/i]
  },
  {
    canonical: 'Electrical Drives',
    category: 'EEE',
    domains: ['EEE'],
    type: 'technical',
    variations: [/\bElectrical Drives\b/i, /\bVFD\b/i, /\bVariable Frequency Drives\b/i, /\bMotor Control\b/i]
  },
  {
    canonical: 'ETAP',
    category: 'EEE',
    domains: ['EEE'],
    type: 'tool',
    variations: [/\bETAP\b/i, /\bElectrical Transient Analyzer Program\b/i, /\bPSCAD\b/i]
  },

  // =========================================================================
  // 7. MECHANICAL ENGINEERING
  // =========================================================================
  {
    canonical: 'CAD',
    category: 'Mechanical',
    domains: ['MECHANICAL', 'CIVIL'],
    type: 'technical',
    variations: [/\bCAD\b/i, /\bComputer Aided Design\b/i, /\b3D Modeling\b/i]
  },
  {
    canonical: 'CAM',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bCAM\b/i, /\bComputer Aided Manufacturing\b/i]
  },
  {
    canonical: 'CAE',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bCAE\b/i, /\bComputer Aided Engineering\b/i, /\bFEA\b/i, /\bFinite Element Analysis\b/i]
  },
  {
    canonical: 'SolidWorks',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'tool',
    variations: [/\bSolidWorks\b/i, /\bSolid Works\b/i]
  },
  {
    canonical: 'AutoCAD',
    category: 'Mechanical / Civil',
    domains: ['MECHANICAL', 'CIVIL', 'EEE'],
    type: 'tool',
    variations: [/\bAutoCAD\b/i, /\bAuto-CAD\b/i, /\b2D Drafting\b/i]
  },
  {
    canonical: 'CATIA',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'tool',
    variations: [/\bCATIA\b/i, /\bCATIA V5\b/i]
  },
  {
    canonical: 'ANSYS',
    category: 'Mechanical',
    domains: ['MECHANICAL', 'CIVIL'],
    type: 'tool',
    variations: [/\bANSYS\b/i, /\bANSYS Fluent\b/i, /\bANSYS Workbench\b/i, /\bCFD\b/i, /\bComputational Fluid Dynamics\b/i]
  },
  {
    canonical: 'CNC',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bCNC\b/i, /\bCNC Machining\b/i, /\bG-Code\b/i, /\bM-Code\b/i, /\bLathe Operations\b/i]
  },
  {
    canonical: 'Manufacturing Processes',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bManufacturing Processes\b/i, /\bCasting\b/i, /\bWelding\b/i, /\bForging\b/i, /\bAdditive Manufacturing\b/i, /\b3D Printing\b/i]
  },
  {
    canonical: 'Thermodynamics',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bThermodynamics\b/i, /\bThermal Engineering\b/i, /\bHeat Transfer\b/i, /\bRAC\b/i, /\bHVAC\b/i]
  },
  {
    canonical: 'Fluid Mechanics',
    category: 'Mechanical',
    domains: ['MECHANICAL', 'CIVIL'],
    type: 'technical',
    variations: [/\bFluid Mechanics\b/i, /\bFluid Dynamics\b/i, /\bHydraulics\b/i, /\bPneumatics\b/i]
  },
  {
    canonical: 'Machine Design',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bMachine Design\b/i, /\bDesign of Machine Elements\b/i, /\bKinematics\b/i, /\bDynamics of Machinery\b/i]
  },
  {
    canonical: 'Robotics',
    category: 'Mechanical',
    domains: ['MECHANICAL', 'ECE', 'CSE'],
    type: 'technical',
    variations: [/\bRobotics\b/i, /\bRobot Kinematics\b/i, /\bROS\b/i, /\bIndustrial Robots\b/i]
  },
  {
    canonical: 'GD&T',
    category: 'Mechanical',
    domains: ['MECHANICAL'],
    type: 'technical',
    variations: [/\bGD&T\b/i, /\bGeometric Dimensioning & Tolerancing\b/i, /\bTolerancing\b/i]
  },

  // =========================================================================
  // 8. CIVIL ENGINEERING
  // =========================================================================
  {
    canonical: 'STAAD Pro',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'tool',
    variations: [/\bSTAAD\.?Pro\b/i, /\bSTAAD Pro\b/i, /\bSTAAD\b/i]
  },
  {
    canonical: 'ETABS',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'tool',
    variations: [/\bETABS\b/i, /\bCSI ETABS\b/i]
  },
  {
    canonical: 'Revit',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'tool',
    variations: [/\bRevit\b/i, /\bAutodesk Revit\b/i, /\bRevit Architecture\b/i, /\bRevit Structure\b/i]
  },
  {
    canonical: 'Structural Analysis',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bStructural Analysis\b/i, /\bStructural Design\b/i, /\bStress Analysis\b/i, /\bFinite Element Analysis \(Civil\)\b/i]
  },
  {
    canonical: 'RCC Design',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bRCC Design\b/i, /\bReinforced Concrete Design\b/i, /\bSteel Structures\b/i, /\bIS 456\b/i]
  },
  {
    canonical: 'Surveying',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bSurveying\b/i, /\bTotal Station\b/i, /\bGIS\b/i, /\bGeographic Information Systems?\b/i, /\bLeveling\b/i]
  },
  {
    canonical: 'Construction Management',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bConstruction Management\b/i, /\bSite Engineering\b/i, /\bProject Planning \(Civil\)\b/i, /\bPrimavera\b/i, /\bMS Project\b/i]
  },
  {
    canonical: 'Quantity Estimation',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bQuantity Estimation\b/i, /\bBOQ\b/i, /\bBill of Quantities\b/i, /\bCost Estimation\b/i, /\bRate Analysis\b/i]
  },
  {
    canonical: 'BIM',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bBIM\b/i, /\bBuilding Information Modeling\b/i]
  },
  {
    canonical: 'Geotechnical Engineering',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bGeotechnical Engineering\b/i, /\bSoil Mechanics\b/i, /\bFoundation Engineering\b/i]
  },
  {
    canonical: 'Transportation Engineering',
    category: 'Civil',
    domains: ['CIVIL'],
    type: 'technical',
    variations: [/\bTransportation Engineering\b/i, /\bHighway Engineering\b/i, /\bPavement Design\b/i, /\bTraffic Engineering\b/i]
  },

  // =========================================================================
  // 9. RELEVANT JOB-SPECIFIC & PROFESSIONAL SKILLS (Soft & Methodologies)
  // =========================================================================
  {
    canonical: 'Problem Solving',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bProblem Solving\b/i, /\bAnalytical Problem Solving\b/i, /\bComplex Problem Resolution\b/i]
  },
  {
    canonical: 'Analytical Thinking',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bAnalytical Thinking\b/i, /\bAnalytical Skills\b/i, /\bData-Driven Decision Making\b/i]
  },
  {
    canonical: 'Communication',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bCommunication\b/i, /\bWritten and Verbal Communication\b/i, /\bPresentation Skills\b/i, /\bInterpersonal Communication\b/i]
  },
  {
    canonical: 'Team Collaboration',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bTeam Collaboration\b/i, /\bCross-Functional Collaboration\b/i, /\bTeamwork\b/i, /\bPair Programming\b/i]
  },
  {
    canonical: 'Project Management',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bProject Management\b/i, /\bSprint Planning\b/i, /\bMilestone Tracking\b/i, /\bResource Allocation\b/i]
  },
  {
    canonical: 'Agile Methodology',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bAgile Methodology\b/i, /\bAgile\b/i, /\bKanban\b/i, /\bSprint Execution\b/i]
  },
  {
    canonical: 'Scrum',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bScrum\b/i, /\bDaily Standups\b/i, /\bSprint Retrospectives\b/i]
  },
  {
    canonical: 'Technical Documentation',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bTechnical Documentation\b/i, /\bAPI Documentation\b/i, /\bSystem Architecture Documentation\b/i, /\bStandard Operating Procedures\b/i]
  },
  {
    canonical: 'Leadership',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bLeadership\b/i, /\bMentorship\b/i, /\bTeam Lead\b/i, /\bInitiative\b/i]
  },
  {
    canonical: 'Critical Thinking',
    category: 'Professional Skills',
    domains: ['ALL'],
    type: 'soft',
    variations: [/\bCritical Thinking\b/i, /\bStrategic Thinking\b/i, /\bRoot Cause Analysis\b/i]
  }
];

module.exports = {
  DOMAINS,
  KEYWORDS
};
