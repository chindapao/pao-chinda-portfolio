import {
  Activity,
  Atom,
  Bot,
  Boxes,
  Braces,
  Cloud,
  Container,
  Coffee,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  HardDrive,
  Hexagon,
  Landmark,
  Layers,
  Leaf,
  Palette,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

import type { StackCategory, Tech } from "@/types";

export const STACK_CATEGORIES: { id: StackCategory; label: string; blurb: string }[] = [
  { id: "frontend", label: "Frontend", blurb: "Server-first React that stays fast on a mid-range phone." },
  { id: "backend", label: "Backend", blurb: "Typed APIs with the business rules on the server, never the client." },
  { id: "data", label: "Data & messaging", blurb: "PostgreSQL as the source of truth; queues where work can wait." },
  { id: "infra", label: "Infra & delivery", blurb: "Containers, CI gates and dashboards that page before users do." },
];

export const STACK: Tech[] = [
  // Frontend
  { id: "nextjs", name: "Next.js", category: "frontend", icon: Layers, note: "App Router, server components, ISR" },
  { id: "react", name: "React", category: "frontend", icon: Atom, note: "Hooks, suspense, accessible UI" },
  { id: "typescript", name: "TypeScript", category: "frontend", icon: FileCode2, note: "Strict mode end to end" },
  { id: "tailwind", name: "Tailwind CSS", category: "frontend", icon: Wind, note: "Token-driven design systems" },
  { id: "tanstack", name: "TanStack Query", category: "frontend", icon: RefreshCw, note: "Server state, cache keys, retries" },
  { id: "shadcn", name: "shadcn/ui", category: "frontend", icon: Palette, note: "Radix primitives, own the code" },
  { id: "motion", name: "Motion", category: "frontend", icon: Sparkles, note: "Purposeful, reduced-motion aware" },

  // Backend
  { id: "spring", name: "Spring Boot", category: "backend", icon: Leaf, note: "Modular monoliths, Security, JPA" },
  { id: "java", name: "Java", category: "backend", icon: Coffee, note: "Java 17 / 21, Gradle multi-module" },
  { id: "node", name: "Node.js · Fastify", category: "backend", icon: Server, note: "Stateless REST APIs and workers" },
  { id: "rest", name: "REST · OpenAPI", category: "backend", icon: Braces, note: "Contract-first, RFC 9457 errors" },
  { id: "security", name: "AuthN / AuthZ", category: "backend", icon: ShieldCheck, note: "JWT rotation, TOTP 2FA, AES-GCM" },
  { id: "payments", name: "KHQR · ABA PayWay", category: "backend", icon: Landmark, note: "Signed webhooks, exact-amount checks" },
  { id: "ai", name: "Claude API", category: "backend", icon: Bot, note: "Queued, redacted, human-approved AI" },
  { id: "python", name: "Python", category: "backend", icon: Cpu, note: "Speech / ML worker services" },

  // Data & messaging
  { id: "postgres", name: "PostgreSQL", category: "data", icon: Database, note: "Flyway / Prisma migrations, row locks" },
  { id: "redis", name: "Redis", category: "data", icon: Zap, note: "Rate limits, idempotency, BullMQ" },
  { id: "queues", name: "Kafka · RabbitMQ", category: "data", icon: Radio, note: "Events and background jobs" },
  { id: "prisma", name: "Prisma", category: "data", icon: Boxes, note: "Typed schema and migrations" },
  { id: "storage", name: "S3 · MinIO", category: "data", icon: HardDrive, note: "Signed URLs, scanned uploads" },

  // Infra & delivery
  { id: "docker", name: "Docker", category: "infra", icon: Container, note: "Compose stacks for every project" },
  { id: "kubernetes", name: "Kubernetes", category: "infra", icon: Hexagon, note: "Kustomize manifests" },
  { id: "aws", name: "AWS", category: "infra", icon: Cloud, note: "CloudFront, WAF, ALB, S3" },
  { id: "ci", name: "CI/CD", category: "infra", icon: GitBranch, note: "GitHub Actions, GitLab CI gates" },
  { id: "observability", name: "Observability", category: "infra", icon: Activity, note: "Prometheus, Grafana, OpenTelemetry" },
];

const BY_ID = new Map(STACK.map((tech) => [tech.id, tech]));

export function getTech(id: string): Tech {
  const tech = BY_ID.get(id);
  if (!tech) throw new Error(`Unknown tech id "${id}" — add it to src/content/stack.ts`);
  return tech;
}
