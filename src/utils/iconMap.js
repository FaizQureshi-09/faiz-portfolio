import { FaJava, FaAws, FaGitAlt, FaSlack, FaDatabase, FaNetworkWired, FaCubes, FaBrain, FaMagic, FaInfinity, FaExchangeAlt, FaUsers, FaShieldAlt, FaBolt, FaLayerGroup, FaCoins, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { SiPython, SiNodedotjs, SiTerraform, SiSpring, SiFastapi, SiPostgresql, SiDocker, SiPostman, SiSwagger, SiOpentelemetry, SiGnubash } from 'react-icons/si';
import { TbBrandAzure } from 'react-icons/tb';

/**
 * Central registry mapping short, human-readable icon keys (used inside
 * data files) to the actual react-icons component that renders them.
 * Keeping this indirection means data files stay framework-agnostic and
 * swapping an icon library only requires changes in this one file.
 */
export const iconRegistry = {
  java: FaJava,
  python: SiPython,
  nodejs: SiNodedotjs,
  shell: SiGnubash,
  terraform: SiTerraform,
  springboot: SiSpring,
  fastapi: SiFastapi,
  postgresql: SiPostgresql,
  sql: FaDatabase,
  dynamodb: FaDatabase,
  aws: FaAws,
  azure: TbBrandAzure,
  docker: SiDocker,
  cicd: FaInfinity,
  sftp: FaExchangeAlt,
  microservices: FaCubes,
  restapi: FaNetworkWired,
  opentelemetry: SiOpentelemetry,
  git: FaGitAlt,
  postman: SiPostman,
  swagger: SiSwagger,
  genai: FaBrain,
  prompt: FaMagic,
  slack: FaSlack,
  people: FaUsers,
  shield: FaShieldAlt,
  automation: FaBolt,
  infrastructure: FaLayerGroup,
  availability: FaNetworkWired,
  cost: FaCoins,
  linkedin: FaLinkedin,
  github: FaGithub,
  email: FaEnvelope,
};

/**
 * Resolves an icon key to its component, falling back to a generic
 * bolt icon so an unmapped key never crashes the render tree.
 * @param {string} iconKey - key defined alongside a skill/achievement entry
 * @returns {React.ComponentType} icon component to render
 */
export function resolveIcon(iconKey) {
  return iconRegistry[iconKey] ?? FaBolt;
}
