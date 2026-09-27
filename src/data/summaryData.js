/**
 * Professional summary paragraph shown in the About section,
 * taken verbatim from the resume's "Summary" section.
 */
export const professionalSummary =
  'Software Engineer with 3+ years building Java and Python backend systems, AWS cloud infrastructure, and CI/CD automation across 5+ client and product engagements. Modernized legacy systems from Java 8 to Java 21 across 4 microservices, cut API latency 90%+ (10s to under 1s) on 50+ endpoints, and raised unit-test coverage 8x (10% to 80%+). Architected multi-account AWS environments (VPC, ECS, Lambda, IAM) with Terraform and CodePipeline/CodeBuild automation, and built AI-agent/GenAI automation using LangGraph and prompt engineering.';

/**
 * Headline stats extracted from the resume, rendered as animated
 * counters in the About section.
 *
 * "Total Experience" isn't listed here — it's fetched live from the
 * /experience API (see useExperience) and prepended by About.jsx, since
 * it changes every month rather than being a fixed resume fact.
 */
export const highlightStats = [
  { id: 'latency', value: 90, suffix: '%+', label: 'API Latency Reduced' },
  { id: 'coverage', value: 8, suffix: 'x', label: 'Test Coverage Increase' },
  { id: 'engagements', value: 5, suffix: '+', label: 'Client & Product Engagements' },
];
