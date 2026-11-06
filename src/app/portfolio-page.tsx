'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  Check,
  Copy,
  Cpu,
  ExternalLink,
  FileText,
  Github,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Radio,
  Sun,
  Terminal,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BlogContent } from '@/components/blog-content';
import profilePic from '../assets/profile.webp';

type SectionId = 'home' | 'projects' | 'certificates' | 'blogs';

type NavItem = {
  id: SectionId;
  code: string;
  label: string;
  icon: LucideIcon;
};

type SocialLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type Project = {
  id: number;
  code: string;
  title: string;
  category: string;
  pipeline: string;
  surfaceCopy: string;
  description: string;
  technologies: string[];
  metrics?: string;
  githubUrl?: string;
  demoUrl?: string;
};

type Certificate = {
  id: number;
  code: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  focus: string;
};

type BlogMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
};

type ReaderMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTimeMinutes: number;
};

type ReaderData = {
  meta: ReaderMeta;
  html: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', code: '00', label: 'Overview', icon: User },
  { id: 'projects', code: '01', label: 'Projects', icon: Briefcase },
  { id: 'certificates', code: '02', label: 'Credentials', icon: Award },
  { id: 'blogs', code: '03', label: 'Writing', icon: FileText },
];

const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://github.com/nabilsaragih', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/nabilsaragih/', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:mnabilsaragih@gmail.com', label: 'Email', icon: Mail },
];

const CAPABILITIES = [
  'PyTorch',
  'TensorFlow',
  'Computer Vision',
  'Edge AI Inference',
  'AIoT Systems',
  'Robotics & ROS',
  'LLM Architecture',
  'C++ / Python',
];

const SYSTEM_PILLARS = [
  {
    code: 'SPEC_01',
    title: 'Computer Vision & Deep Learning',
    spec: 'Object detection, spatial perception, and low-latency neural inference optimized for edge silicon.',
    icon: Cpu,
  },
  {
    code: 'SPEC_02',
    title: 'Physical Systems & Robotics R&D',
    spec: 'Sensor fusion, microcontroller telemetry, and ROS-integrated actuation pipelines for real-world robotics.',
    icon: Radio,
  },
  {
    code: 'SPEC_03',
    title: 'Production Engineering & Fault Tolerance',
    spec: 'Industrial telemetry, automated monitoring, low-power protocols (MQTT/LoRaWAN), and resilient deployment.',
    icon: Layers,
  },
];

const PROJECTS: Project[] = [
  {
    id: 1,
    code: 'SYS_01',
    title: 'Smart Home Automation System',
    category: 'AIoT & Edge Systems',
    pipeline: 'Sensor Array → Local ML Inference → Device Actuation',
    surfaceCopy: 'Device orchestration, voice interaction, and predictive maintenance in a unified local framework.',
    description:
      'An IoT architecture combining edge device orchestration, energy optimization, and AI-assisted telemetry to guarantee offline reliability and sub-second response times.',
    technologies: ['Python', 'TensorFlow', 'Arduino', 'MQTT', 'Edge Computing'],
    metrics: '< 120ms Latency · 99.8% Uptime',
    githubUrl: 'https://github.com/nabilsaragih',
    demoUrl: '#',
  },
  {
    id: 2,
    code: 'SYS_02',
    title: 'AI-Powered Crop Monitoring',
    category: 'Agricultural Computer Vision',
    pipeline: 'Multispectral Camera → CNN Classifier → LoRaWAN Mesh',
    surfaceCopy: 'Sensor fusion and computer vision for crop health tracking and yield anomaly detection.',
    description:
      'A field monitoring system combining distributed environmental telemetry with computer vision models to assess crop stress, surface anomalies, and automate predictive agricultural yield reports.',
    technologies: ['PyTorch', 'Raspberry Pi', 'LoRaWAN', 'Computer Vision', 'OpenCV'],
    metrics: '94.2% Anomaly Accuracy · Solar Powered',
    githubUrl: 'https://github.com/nabilsaragih',
    demoUrl: '#',
  },
  {
    id: 3,
    code: 'SYS_03',
    title: 'Industrial Predictive Maintenance',
    category: 'Industrial Telemetry & ML',
    pipeline: 'Vibration & Thermal Telemetry → Isolation Forest → InfluxDB',
    surfaceCopy: 'Edge-aware telemetry monitoring engineered to detect machine anomalies and protect uptime.',
    description:
      'A predictive maintenance framework analyzing vibration, thermal, and electrical telemetry from industrial machinery to identify wear patterns prior to catastrophic component failure.',
    technologies: ['Scikit-learn', 'Edge Computing', 'InfluxDB', 'Grafana', 'Python'],
    metrics: 'Early Anomaly Detection · Zero Data Loss',
    githubUrl: 'https://github.com/nabilsaragih',
  },
];

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    code: 'VAL_01',
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    date: '2024',
    credentialId: 'TF-12345',
    focus: 'Model development, deep learning architectures, transfer learning, and production-minded ML fundamentals.',
  },
  {
    id: 2,
    code: 'VAL_02',
    title: 'AWS IoT Core Certification',
    issuer: 'Amazon Web Services',
    date: '2023',
    credentialId: 'AWS-67890',
    focus: 'Connected-device topology, MQTT security policies, device shadows, and scalable IoT telemetry ingestion.',
  },
  {
    id: 3,
    code: 'VAL_03',
    title: 'Machine Learning Engineering',
    issuer: 'Coursera',
    date: '2023',
    credentialId: 'COURSERA-11111',
    focus: 'Applied ML engineering, data pipeline validation, experiment tracking, and robust deployment concerns.',
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatDate(date: string) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) {
    return date;
  }
  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatLongDate(date: string) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) {
    return date;
  }
  return value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/* Fauna-inspired Technical Buttons & Badges (Preserving Navy Palette) */
const primaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-navy-650 px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase shadow-sm transition-all duration-200 hover:bg-navy-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950';

const secondaryBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300/80 bg-white px-4 py-2 text-xs font-medium text-neutral-800 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-950 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-offset-neutral-950';

const iconBtnClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white';

const techTagClass =
  'inline-flex items-center font-mono text-[11px] rounded-md border border-neutral-200/90 bg-neutral-100/70 px-2 py-0.5 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300';

/* Section Header in Fauna Technical Specification Style */
function SectionHeading({
  code,
  eyebrow,
  title,
  description,
}: {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3 mb-10 border-b border-neutral-200/80 pb-6 dark:border-neutral-800/80">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs font-semibold text-navy-650 dark:text-navy-400">
          [{code}]
        </span>
        <span className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          {"//"} {eyebrow}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
        {title}
      </h2>
      <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}

/* Header in Fauna-style Editorial Specs Bar */
function Header({
  activeSection,
  onSectionChange,
  onToggleTheme,
}: {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  onToggleTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand System Status */}
        <button
          type="button"
          onClick={() => onSectionChange('home')}
          className="group flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 rounded-lg p-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-navy-200/90 bg-navy-50 text-xs font-mono font-semibold text-navy-700 transition-colors group-hover:bg-navy-100 dark:border-navy-500/20 dark:bg-navy-950/60 dark:text-navy-300 dark:group-hover:bg-navy-900/60">
            NS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
                Nabil Saragih
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              AI & Robotics Engineer
            </p>
          </div>
        </button>

        {/* Desktop Technical Navigation Index */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-xl border border-neutral-200/80 bg-neutral-100/60 p-1 dark:border-neutral-800 dark:bg-neutral-900/60"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map(({ id, code, label }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSectionChange(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500',
                  active
                    ? 'bg-white text-navy-700 font-semibold shadow-xs dark:bg-neutral-800 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white',
                )}
              >
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{code}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Socials */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={iconBtnClass}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={iconBtnClass}
            aria-label="Toggle color theme"
          >
            <Moon className="h-4 w-4 dark:hidden" />
            <Sun className="hidden h-4 w-4 dark:block" />
          </button>

          <a
            href="mailto:mnabilsaragih@gmail.com"
            className={cn(primaryBtnClass, 'hidden sm:inline-flex text-[11px] h-9 px-3.5')}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* Mobile Floating Navigation Pill */
function MobileBottomNav({
  activeSection,
  onSectionChange,
}: {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}) {
  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-3 sm:px-4 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-neutral-200/90 bg-white/95 p-1.5 shadow-lg shadow-neutral-950/10 backdrop-blur-lg dark:border-neutral-800/90 dark:bg-neutral-900/95 dark:shadow-black/50"
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSectionChange(id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
                active
                  ? 'bg-navy-650 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white',
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* Fauna-style Hero Layout: Asymmetric Architecture (Photo hidden on mobile) */
function HomeSection({ onProjectsClick }: { onProjectsClick: () => void }) {
  return (
    <section className="space-y-10 sm:space-y-16">
      {/* Top Engineering Focus Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 border-b border-neutral-200/80 pb-3 sm:pb-4 text-xs font-mono text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-navy-650 dark:text-navy-400 shrink-0" />
          <span className="truncate">Applied AI · Edge Inference · Robotics Systems</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span>Yogyakarta, Indonesia</span>
          <span>·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Open to Collaborations</span>
        </div>
      </div>

      {/* Core Layout (Left side full-width on mobile/tablet, 7 cols on desktop; photo hidden on mobile) */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-start">
        {/* Left Column (Full width on mobile/tablet, 7 cols on lg) */}
        <div className="space-y-5 sm:space-y-6 lg:col-span-7">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-[1.18] sm:leading-[1.12]">
              Building intelligent systems that perceive, reason, and act in the physical world.
            </h1>
            <p className="text-xs sm:text-sm font-mono text-navy-700 dark:text-navy-300">
              AI Engineer // AIoT & Robotics Researcher // Idea-Driven Innovator
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-xl">
              I bridge theoretical machine learning models with physical hardware reality. My work spans deep neural networks, low-latency computer vision, edge inferencing micro-architectures, and autonomous robotics telemetry.
            </p>
          </div>

          {/* Technical Stack Tags */}
          <div className="space-y-2 pt-1">
            <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              {"//"} Core Technical Capabilities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CAPABILITIES.map((skill) => (
                <span key={skill} className={techTagClass}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs: full width on mobile for easy thumb tapping */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
            <button type="button" onClick={onProjectsClick} className={cn(primaryBtnClass, 'w-full sm:w-auto justify-center h-10 sm:h-9')}>
              <span>Explore Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a href="mailto:mnabilsaragih@gmail.com" className={cn(secondaryBtnClass, 'w-full sm:w-auto justify-center h-10 sm:h-9')}>
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Me</span>
            </a>
            <a
              href="https://github.com/nabilsaragih"
              target="_blank"
              rel="noreferrer"
              className={cn(secondaryBtnClass, 'w-full sm:w-auto justify-center h-10 sm:h-9')}
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Right Column: Profile Presentation (Hidden on mobile & tablet; visible only on desktop lg+) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
            <Image
              src={profilePic}
              alt="Portrait of Nabil Saragih"
              priority
              sizes="380px"
              className="aspect-[4/5] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>

      {/* Fauna-style 3-Column System Pillars */}
      <div className="space-y-4 pt-6 sm:pt-8 border-t border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 font-mono text-xs text-neutral-500">
          <span>{"//"} CORE SUBSYSTEMS & CAPABILITY MATRIX</span>
          <span className="text-[11px] sm:text-xs text-neutral-400">THREE-PILLAR ARCHITECTURE</span>
        </div>

        <div className="grid gap-3.5 sm:gap-5 sm:grid-cols-3">
          {SYSTEM_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-navy-400 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:border-navy-600"
              >
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-navy-650 dark:text-navy-400">
                      {item.code}
                    </span>
                    <Icon className="h-4 w-4 text-neutral-400 group-hover:text-navy-650 dark:group-hover:text-navy-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.spec}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Projects Section in Fauna "Engineering Spec Sheet" Layout */
function ProjectsSection() {
  return (
    <section>
      <SectionHeading
        code="INDEX_01"
        eyebrow="ENGINEERING DEPLOYMENTS"
        title="Featured Systems & Projects"
        description="Applied machine learning, sensor fusion, and hardware telemetry architectures engineered for dependable physical-world operation."
      />

      <div className="space-y-6">
        {PROJECTS.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.25 }}
            className="group rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-8 transition-all duration-200 hover:border-navy-400 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-navy-600"
          >
            {/* Spec Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3 sm:pb-4 dark:border-neutral-800/80 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-navy-650 dark:text-navy-400">{project.code}</span>
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-600 dark:text-neutral-300">{project.category}</span>
              </div>
              {project.metrics ? (
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] sm:text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                  {project.metrics}
                </span>
              ) : null}
            </div>

            {/* Spec Content & Architecture Pipeline */}
            <div className="mt-5 grid gap-5 lg:grid-cols-12 lg:items-start">
              <div className="space-y-3 lg:col-span-8">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white group-hover:text-navy-650 dark:group-hover:text-navy-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {project.surfaceCopy}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>

                {/* Pipeline Block */}
                <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-2.5 sm:p-3 font-mono text-[11px] sm:text-xs text-neutral-600 dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:text-neutral-300">
                  <span className="font-semibold text-neutral-400">PIPELINE // </span>
                  <span>{project.pipeline}</span>
                </div>
              </div>

              {/* Technologies & Actions (4 cols) */}
              <div className="space-y-4 border-t border-neutral-100 pt-4 lg:border-t-0 lg:pt-0 lg:col-span-4 lg:border-l lg:border-neutral-100 lg:pl-6 dark:border-neutral-800">
                <div className="space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                    {"//"} Stack & Tools
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className={techTagClass}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(secondaryBtnClass, 'h-9 px-3.5 text-xs')}
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>
                  ) : null}
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(secondaryBtnClass, 'h-9 px-3.5 text-xs')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* Certificates in Fauna Validation Spec Layout */
function CertificatesSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <section>
      <SectionHeading
        code="INDEX_02"
        eyebrow="TECHNICAL VALIDATION"
        title="Certifications & Qualifications"
        description="Certified competencies in model development, cloud edge integration, and scalable machine learning workflows."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((cert, index) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.25 }}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all duration-200 hover:border-navy-400 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-navy-600"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-navy-650 dark:text-navy-400">{cert.code}</span>
                <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  {cert.date}
                </span>
              </div>

              <div>
                <span className="inline-block rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] uppercase font-semibold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                  {cert.issuer}
                </span>
                <h3 className="mt-2 text-base font-semibold tracking-tight text-neutral-950 dark:text-white">
                  {cert.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {cert.focus}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-200/70 bg-neutral-50/80 px-3 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-900/80 font-mono">
              <span className="text-neutral-500">
                ID: <span className="text-neutral-800 dark:text-neutral-200">{cert.credentialId}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(cert.credentialId)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-navy-650 hover:text-navy-800 dark:text-navy-400 dark:hover:text-navy-300 focus-visible:outline-none"
              >
                {copiedId === cert.credentialId ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* Writing / Research Logs Section in Fauna Layout */
function BlogsSection({
  blogPosts,
  onOpenPost,
  onPrefetchPost,
}: {
  blogPosts: BlogMeta[];
  onOpenPost: (slug: string) => void;
  onPrefetchPost: (slug: string) => void;
}) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <SectionHeading
          code="INDEX_03"
          eyebrow="TECHNICAL ARCHIVE"
          title="Research Logs & Insights"
          description="Technical writeups, architectural teardowns, and engineering notes on deploying intelligent algorithms to real machines."
        />
        <Link
          href="/blog"
          className={cn(secondaryBtnClass, 'shrink-0 self-start sm:self-auto text-xs h-9 mb-8 font-mono')}
        >
          <span>All Logs ({blogPosts.length})</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {blogPosts.length ? (
        <div className="space-y-4">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              className="group rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all duration-200 hover:border-navy-400 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-navy-600"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{formatDate(post.date)}</span>
                    <span>{"//"}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white group-hover:text-navy-650 dark:group-hover:text-navy-300 transition-colors">
                    <button
                      type="button"
                      onClick={() => onOpenPost(post.slug)}
                      onMouseEnter={() => onPrefetchPost(post.slug)}
                      onFocus={() => onPrefetchPost(post.slug)}
                      className="text-left focus-visible:outline-none"
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <span key={`${post.slug}-${tag}`} className={techTagClass}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPost(post.slug)}
                  onMouseEnter={() => onPrefetchPost(post.slug)}
                  onFocus={() => onPrefetchPost(post.slug)}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-navy-650 transition hover:bg-neutral-50 hover:text-navy-800 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-navy-300 dark:hover:bg-neutral-800"
                >
                  <span>Open Log</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-10 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">NO RESEARCH LOGS FOUND</p>
        </div>
      )}
    </section>
  );
}

/* Technical Article Reader Modal */
function BlogReaderModal({
  open,
  readerData,
  readerError,
  readerLoading,
  onClose,
}: {
  open: boolean;
  readerData: ReaderData | null;
  readerError: string | null;
  readerLoading: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close article modal"
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5 dark:border-neutral-800 font-mono text-xs">
              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-navy-650 dark:text-navy-400">RESEARCH LOG //</span>
                {readerData ? (
                  <span>
                    {formatLongDate(readerData.meta.date)} · {readerData.meta.readingTimeMinutes} MIN
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {readerData ? (
                  <Link
                    href={`/blog/${readerData.meta.slug}`}
                    className={cn(secondaryBtnClass, 'h-7 px-2.5 text-xs font-mono')}
                  >
                    <span>Full Log</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(iconBtnClass, 'h-7 w-7 rounded-lg')}
                  aria-label="Close article"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 sm:p-8">
              {readerLoading && !readerData ? (
                <div className="py-12 text-center font-mono text-sm text-neutral-500">
                  LOADING LOG DATA...
                </div>
              ) : null}

              {readerError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 font-mono text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {readerError}
                </div>
              ) : null}

              {readerData ? (
                <article>
                  <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white mb-6">
                    {readerData.meta.title}
                  </h1>
                  <BlogContent html={readerData.html} />
                </article>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-neutral-200/80 bg-neutral-50/50 py-10 transition-colors dark:border-neutral-800/80 dark:bg-neutral-950">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
            Nabil Saragih
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            AI Engineer & Researcher · Applied Machine Learning, Edge AI & Robotics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={iconBtnClass}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className={cn(secondaryBtnClass, 'h-9 px-3 text-xs')}
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to top</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-4 text-xs text-neutral-400 sm:px-6 lg:px-8">
        &copy; {year} Nabil Saragih. All rights reserved.
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [blogPosts, setBlogPosts] = useState<BlogMeta[]>([]);
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerData, setReaderData] = useState<ReaderData | null>(null);
  const postCache = useRef<Map<string, ReaderData>>(new Map());

  useEffect(() => {
    let mounted = true;

    fetch('/api/posts', { cache: 'no-store' })
      .then((res) => res.json() as Promise<unknown>)
      .then((data) => {
        if (!mounted) return;
        const mappedPosts: BlogMeta[] = Array.isArray(data)
          ? data.map((entry) => {
              const record = entry as Record<string, unknown>;
              const tags = Array.isArray(record.tags) ? record.tags.map(String) : [];
              return {
                slug: String(record.slug ?? ''),
                title: String(record.title ?? ''),
                excerpt: String(record.excerpt ?? ''),
                date: String(record.date ?? ''),
                readTime: `${Number(record.readingTimeMinutes ?? 0)} min read`,
                tags,
              };
            })
          : [];
        setBlogPosts(mappedPosts);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!readerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [readerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && readerOpen) {
        setReaderOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readerOpen]);

  const handleSectionChange = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    root.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const prefetchPost = (slug: string) => {
    if (postCache.current.has(slug)) return;
    fetch(`/api/posts/${slug}`, { cache: 'no-store' })
      .then((res) => (res.ok ? (res.json() as Promise<ReaderData>) : null))
      .then((data) => {
        if (data) postCache.current.set(slug, data);
      })
      .catch(() => {});
  };

  const openPostInModal = (slug: string) => {
    setReaderOpen(true);
    setReaderError(null);

    if (readerData?.meta.slug === slug) return;

    const cached = postCache.current.get(slug);
    if (cached) {
      setReaderData(cached);
      setReaderLoading(false);
      prefetchPost(slug);
      return;
    }

    setReaderData(null);
    setReaderLoading(true);

    fetch(`/api/posts/${slug}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load log');
        return res.json() as Promise<ReaderData>;
      })
      .then((data) => {
        postCache.current.set(slug, data);
        setReaderData(data);
      })
      .catch(() => {
        setReaderData(null);
        setReaderError('Unable to load research log content.');
      })
      .finally(() => {
        setReaderLoading(false);
      });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection onProjectsClick={() => handleSectionChange('projects')} />;
      case 'projects':
        return <ProjectsSection />;
      case 'certificates':
        return <CertificatesSection />;
      case 'blogs':
        return (
          <BlogsSection
            blogPosts={blogPosts}
            onOpenPost={openPostInModal}
            onPrefetchPost={prefetchPost}
          />
        );
      default:
        return <HomeSection onProjectsClick={() => handleSectionChange('projects')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 transition-colors selection:bg-navy-100 selection:text-navy-800 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-navy-900 dark:selection:text-navy-200">
      <Header
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onToggleTheme={handleToggleTheme}
      />

      <MobileBottomNav
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <BlogReaderModal
        open={readerOpen}
        readerData={readerData}
        readerError={readerError}
        readerLoading={readerLoading}
        onClose={() => setReaderOpen(false)}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-12 lg:px-8 pb-28 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
