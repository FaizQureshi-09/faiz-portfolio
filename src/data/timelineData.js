/**
 * Unified, chronologically-ordered career timeline combining education,
 * the umbrella professional role, and every project from the resume.
 * Rendered by the Timeline section as an animated vertical journey.
 *
 * `type` drives the card's accent color and badge icon:
 *   'education' | 'experience' | 'project'
 */
export const timelineEntries = [
  {
    id: 'education-medicaps',
    type: 'education',
    duration: 'Aug 2019 – May 2023',
    title: 'B.Tech in Computer Science',
    organization: 'Medi-Caps University, Indore, M.P.',
    description: 'Graduated with a GPA of 8.57/10.0.',
    bullets: ['GPA: 8.57/10.0'],
    techStack: [],
  },
  {
    id: 'experience-everestek',
    type: 'experience',
    duration: 'June 2023 – Present',
    title: 'Software Engineer',
    organization: 'Everestek Technosoft Solutions Pvt. Ltd, Indore, India',
    description:
      'Umbrella role spanning 5+ client and internal engagements, delivering backend and DevOps solutions end-to-end.',
    bullets: [
      'Delivered Backend and DevOps solutions across 5+ client and internal engagements.',
      'Adopted new technologies quickly, applying them directly to production systems.',
      'Owned end-to-end feature delivery, from design through deployment.',
    ],
    techStack: [],
  },
  {
    id: 'project-resource-management',
    type: 'project',
    duration: 'June 2023 – Dec 2023',
    title: 'Internal Resource Management System',
    organization: 'Product · Backend Engineer',
    description:
      'FastAPI-based internal platform for resource allocation, timesheets, and task management.',
    bullets: [
      'Built a Python FastAPI backend for resource allocation, timesheets, and task tracking.',
      'Created "Code Accelerators" — shell scripts auto-generating Java/Python microservice scaffolds with Terraform IaC.',
      'Automated daily status emails via AWS SES.',
      'Achievement: cut new-service setup time via reusable scaffolding accelerators and automated daily reporting for managers and stakeholders.',
    ],
    techStack: ['Python', 'FastAPI', 'Shell Scripting', 'Terraform', 'AWS SES', 'API Gateway', 'S3'],
  },
  {
    id: 'project-legacy-modernization',
    type: 'project',
    duration: 'Jan 2024 – March 2024',
    title: 'Legacy Insurance System Modernization',
    organization: 'Client Project · Backend Engineer',
    description:
      'Modernization of legacy Java services to improve performance, reliability, and code quality.',
    bullets: [
      'Migrated 4+ legacy services from Java 8 to Java 21 and upgraded AWS SDK v1 to v2.',
      'Optimized 50+ APIs via multi-threading, indexing, and SQL tuning.',
      'Resolved static analysis violations across PMD, Checkstyle, and SpotBugs.',
      'Achievement: cut API latency 90%+ (from >10s to <1s) across 50+ endpoints; reduced 7,000+ static analysis violations to near zero; raised unit test coverage from 10% to 80%+ (8x).',
    ],
    techStack: ['Java 21', 'SQL', 'Multi-threading', 'Performance Tuning', 'Unit Testing'],
  },
  {
    id: 'project-enterprise-insurance-platform',
    type: 'project',
    duration: 'April 2024 – Sept 2025',
    title: 'Enterprise Insurance Platform',
    organization: 'Client Project · Backend & DevOps Engineer',
    description:
      'Secure middleware and data-migration platform connecting multiple proprietary insurance products.',
    bullets: [
      'Led a 5-member Agile pod covering architecture, deployment strategy, and client communication.',
      'Designed token-authorized middleware via AWS API Gateway.',
      'Migrated data from AWS S3 to Azure Blob Storage.',
      'Built high-traffic REST APIs.',
      'Achievement: delivered secure cross-product API integration for a 5-member pod; completed full data migration with zero data loss.',
    ],
    techStack: ['Java', 'Python', 'Node.js', 'API Gateway', 'Lambda', 'S3', 'IAM', 'Azure Blob Storage'],
  },
  {
    id: 'project-microservice-generation-tool',
    type: 'project',
    duration: 'Oct 2025 – May 2026',
    title: 'AI Automated Microservice Generation Tool',
    organization: 'Product · DevOps Engineer',
    description:
      'Self-service product for one-click microservice scaffolding with production-ready AWS infrastructure and CI/CD.',
    bullets: [
      'Architected AWS infrastructure per microservices and SRP standards.',
      'Built CI/CD pipelines via AWS CodeBuild and CodePipeline.',
      'Secured environments with private VPCs, least-privilege IAM, encryption at rest/in transit, and SSM-based secrets.',
      'Deployed a multi-account AWS strategy.',
      'Achievement: enabled full-stack observability via access logging and OpenTelemetry/X-Ray tracing; reduced cloud spend through a scheduled off-hours shutdown mechanism.',
    ],
    techStack: [
      'Java',
      'Python',
      'VPC',
      'ALB',
      'ECS',
      'Lambda',
      'IAM',
      'S3',
      'RDS',
      'EC2',
      'SSM',
      'ECR',
      'CodeBuild',
      'CodePipeline',
      'DynamoDB',
      'EFS',
      'SES',
      'CloudFront',
    ],
  },
  {
    id: 'project-ai-insurance-platform',
    type: 'project',
    duration: 'June 2026 – Present',
    title: 'AI Based Insurance Platform',
    organization: 'Client Project · Backend & DevOps Engineer',
    description:
      'Multi-agent GenAI platform automating insurance operations (e.g., enrollment) via orchestrated, task-specific AI agents.',
    bullets: [
      'Built an AI agent automating file transfers from AWS S3 to a custom SFTP server, integrated into production orchestration.',
      'Monitor agent performance and perform RCA on failures; optimize prompts to improve accuracy.',
      'Built Lambda automations for manual tasks.',
      'Implemented Slack alerts for orchestration failures across Prod, UAT, and Dev.',
      'Achievement: delivered a production AI agent within an active orchestration pipeline; enabled real-time, cross-environment failure visibility (3 environments) via automated Slack alerting; collaborated within a 15+ member Agile team across multiple time zones.',
    ],
    techStack: ['Python', 'AWS S3', 'Lambda', 'PostgreSQL', 'Generative AI/LLMs', 'Slack API', 'SFTP'],
  },
];
