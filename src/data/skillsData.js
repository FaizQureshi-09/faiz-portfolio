/**
 * Technology/skills catalogue from the resume's "Technologies" section,
 * grouped by category. `iconKey` is resolved to a brand icon component
 * by `src/utils/iconMap.js`.
 */
export const skillCategories = [
  {
    id: 'languages',
    title: 'Programming Languages',
    skills: [
      { name: 'Java', iconKey: 'java' },
      { name: 'Python', iconKey: 'python' },
      { name: 'Node.js', iconKey: 'nodejs' },
      { name: 'Shell Scripting', iconKey: 'shell' },
      { name: 'Terraform', iconKey: 'terraform' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    skills: [
      { name: 'Spring Boot', iconKey: 'springboot' },
      { name: 'FastAPI', iconKey: 'fastapi' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    skills: [
      { name: 'PostgreSQL', iconKey: 'postgresql' },
      { name: 'SQL', iconKey: 'sql' },
      { name: 'AWS DynamoDB', iconKey: 'dynamodb' },
    ],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS ECS', iconKey: 'aws' },
      { name: 'AWS Lambda', iconKey: 'aws' },
      { name: 'API Gateway', iconKey: 'aws' },
      { name: 'AWS S3', iconKey: 'aws' },
      { name: 'VPC', iconKey: 'aws' },
      { name: 'ALB', iconKey: 'aws' },
      { name: 'IAM', iconKey: 'aws' },
      { name: 'RDS', iconKey: 'aws' },
      { name: 'EC2', iconKey: 'aws' },
      { name: 'SSM', iconKey: 'aws' },
      { name: 'ECR', iconKey: 'aws' },
      { name: 'CodeBuild', iconKey: 'aws' },
      { name: 'CodePipeline', iconKey: 'aws' },
      { name: 'EFS', iconKey: 'aws' },
      { name: 'SES', iconKey: 'aws' },
      { name: 'CloudFront', iconKey: 'aws' },
      { name: 'X-Ray', iconKey: 'aws' },
      { name: 'Azure Blob Storage', iconKey: 'azure' },
      { name: 'Docker', iconKey: 'docker' },
      { name: 'CI/CD', iconKey: 'cicd' },
      { name: 'SFTP', iconKey: 'sftp' },
    ],
  },
  {
    id: 'tools-architecture',
    title: 'Tools & Architecture',
    skills: [
      { name: 'Microservices', iconKey: 'microservices' },
      { name: 'RESTful APIs', iconKey: 'restapi' },
      { name: 'OpenTelemetry', iconKey: 'opentelemetry' },
      { name: 'Git', iconKey: 'git' },
      { name: 'Postman', iconKey: 'postman' },
      { name: 'Swagger', iconKey: 'swagger' },
    ],
  },
  {
    id: 'ai-collaboration',
    title: 'AI & Collaboration',
    skills: [
      { name: 'Generative AI/LLMs', iconKey: 'genai' },
      { name: 'Prompt Optimization', iconKey: 'prompt' },
      { name: 'Slack API', iconKey: 'slack' },
    ],
  },
];
