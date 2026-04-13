'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BlogContent } from '@/components/blog-content';
import profilePic from '../assets/profile.webp';

type SectionId = 'home' | 'projects' | 'certificates' | 'blogs';

type NavItem = {
  id: SectionId;
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
  title: string;
  eyebrow: string;
  surfaceCopy: string;
  description: string;
  technologies: string[];
  gradient: string;
  githubUrl?: string;
  demoUrl?: string;
};

type Certificate = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  focus: string;
  gradient: string;
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
  { id: 'home', label: 'Home', icon: User },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'blogs', label: 'Blogs', icon: FileText },
];

const SOCIAL_LINKS: SocialLink[] = [
  { href: 'https://github.com/nabilsaragih', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/nabilsaragih/', label: 'LinkedIn', icon: Linkedin },
];

const ROLE_LABEL = 'AI Engineer | Independent Researcher | AIoT & Robotics R&D | Idea-Driven Innovator';
const HERO_SKILLS = ['AI/ML', 'AIoT', 'Robotics', 'Computer Vision', 'Edge AI', 'LLM'];

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Smart Home Automation System',
    eyebrow: 'Connected intelligence',
    surfaceCopy: 'Automation, voice interaction, and predictive maintenance in one dependable platform.',
    description:
      'An IoT system that combines device orchestration, energy optimization, and AI-assisted monitoring to improve efficiency and day-to-day usability.',
    technologies: ['Python', 'TensorFlow', 'Arduino', 'MQTT'],
    gradient: 'bg-gradient-to-br from-navy-700 via-navy-600 to-sky-500',
  },
  {
    id: 2,
    title: 'AI-Powered Crop Monitoring',
    eyebrow: 'Precision agriculture',
    surfaceCopy: 'Sensor fusion and computer vision for healthier crops and better forecasting.',
    description:
      'A monitoring workflow that uses field sensors and machine learning models to track crop health, surface anomalies, and support yield planning.',
    technologies: ['PyTorch', 'Raspberry Pi', 'LoRaWAN', 'Computer Vision'],
    gradient: 'bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400',
  },
  {
    id: 3,
    title: 'Industrial Predictive Maintenance',
    eyebrow: 'Operational resilience',
    surfaceCopy: 'Edge-aware monitoring designed to spot failures early and protect uptime.',
    description:
      'A predictive maintenance stack that gathers machine telemetry, detects early warning signals, and improves maintenance decisions with better visibility.',
    technologies: ['Scikit-learn', 'Edge', 'InfluxDB', 'Grafana'],
    gradient: 'bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-500',
  },
];

const CERTIFICATES: Certificate[] = [
  {
    id: 1,
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    date: '2024',
    credentialId: 'TF-12345',
    focus: 'Model development, training workflows, and production-minded ML fundamentals.',
    gradient: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400',
  },
  {
    id: 2,
    title: 'AWS IoT Core Certification',
    issuer: 'Amazon Web Services',
    date: '2023',
    credentialId: 'AWS-67890',
    focus: 'Connected-device architecture, cloud messaging, and scalable IoT integration patterns.',
    gradient: 'bg-gradient-to-br from-sky-600 via-cyan-500 to-blue-400',
  },
  {
    id: 3,
    title: 'Machine Learning Engineering',
    issuer: 'Coursera',
    date: '2023',
    credentialId: 'COURSERA-11111',
    focus: 'Applied ML engineering, practical deployment concerns, and robust experimentation.',
    gradient: 'bg-gradient-to-br from-zinc-800 via-slate-700 to-violet-500',
  },
];

const shellClass = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8';
const surfaceClass =
  'rounded-[28px] border border-gray-200/70 bg-white/85 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.38)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_32px_80px_-56px_rgba(0,0,0,0.85)]';
const primaryButtonClass =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy-650 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(54,84,163,0.95)] transition hover:bg-navy-700 hover:shadow-[0_20px_44px_-18px_rgba(47,71,141,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950';
const secondaryButtonClass =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-100 dark:hover:bg-white/[0.08] dark:focus-visible:ring-offset-neutral-950';
const iconButtonClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:bg-white/[0.08] dark:hover:text-white dark:focus-visible:ring-offset-neutral-950';
const chipClass =
  'inline-flex items-center rounded-full border border-gray-200/80 bg-gray-50/80 px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300';

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

function SectionShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={cn(shellClass, className)}>{children}</section>;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function NavList({
  activeSection,
  onSectionChange,
}: {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}) {
  return (
    <nav className="space-y-1.5" aria-label="Primary">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950',
              active
                ? 'bg-navy-650 text-white shadow-[0_16px_36px_-24px_rgba(54,84,163,0.95)]'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.06]',
            )}
          >
            <Icon className={cn('h-4 w-4', active ? 'text-white' : 'text-gray-400 dark:text-gray-500')} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Header({
  onMenuOpen,
  onSectionChange,
  onToggleTheme,
}: {
  onMenuOpen: () => void;
  onSectionChange: (section: SectionId) => void;
  onToggleTheme: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/70">
      <div
        className={cn(
          shellClass,
          'flex h-[calc(var(--header-h)+var(--safe-top))] items-center justify-between gap-4 pt-[var(--safe-top)]',
        )}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            className={cn(iconButtonClass, 'xl:hidden')}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
              <Image
                src="/favicon.ico"
                alt="Nabil Saragih icon"
                width={20}
                height={20}
                className="h-5 w-5 rounded-sm object-contain"
                unoptimized
              />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-950 dark:text-white">Nabil Saragih</p>
              <p className="hidden max-w-[30rem] text-[11px] leading-4 text-gray-500 lg:block dark:text-gray-400">
                AI Engineer building real-world AI systems
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className={iconButtonClass}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <button type="button" onClick={onToggleTheme} className={iconButtonClass} aria-label="Toggle theme">
            <Moon className="h-4 w-4 dark:hidden" />
            <Sun className="hidden h-4 w-4 dark:block" />
          </button>

          <button
            type="button"
            onClick={() => onSectionChange('projects')}
            className={cn(primaryButtonClass, 'hidden sm:inline-flex')}
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  activeSection,
  currentYear,
  onSectionChange,
}: {
  activeSection: SectionId;
  currentYear: number;
  onSectionChange: (section: SectionId) => void;
}) {
  return (
    <aside className="fixed left-6 top-[calc(var(--header-h)+var(--safe-top)+1.5rem)] hidden h-[calc(100svh-var(--header-h)-var(--safe-top)-3rem)] w-60 xl:block">
      <div className={cn(surfaceClass, 'flex h-full flex-col p-5')}>
        <div className="space-y-5">
          <div className="rounded-3xl border border-gray-200/70 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <Image
                src={profilePic}
                alt="Nabil Saragih"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">
                  Nabil Saragih
                </p>
                <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                  AI Engineer
                </p>
                <p className="text-[11px] leading-4 text-gray-500 dark:text-gray-400">
                  AIoT & Robotics
                </p>
              </div>
            </div>
          </div>

          <NavList activeSection={activeSection} onSectionChange={onSectionChange} />
        </div>

        <div className="mt-auto border-t border-gray-200/70 pt-4 text-xs text-gray-400 dark:border-white/10 dark:text-gray-500">
          Nabil Saragih &copy; {currentYear}
        </div>
      </div>
    </aside>
  );
}

function MobileDrawer({
  activeSection,
  currentYear,
  onClose,
  onSectionChange,
  open,
}: {
  activeSection: SectionId;
  currentYear: number;
  onClose: () => void;
  onSectionChange: (section: SectionId) => void;
  open: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <motion.aside
            initial={{ x: -32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-4 left-4 w-[min(20rem,calc(100vw-2rem))]"
          >
            <div className={cn(surfaceClass, 'flex h-full flex-col p-5')}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-950 dark:text-white">Nabil Saragih</p>
                  <p className="text-[11px] leading-4 text-gray-500 dark:text-gray-400">{ROLE_LABEL}</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className={cn(iconButtonClass, 'shrink-0 aspect-square')}
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex-1">
                <NavList activeSection={activeSection} onSectionChange={onSectionChange} />
              </div>

              <div className="mt-auto border-t border-gray-200/70 pt-4 text-xs text-gray-400 dark:border-white/10 dark:text-gray-500">
                Nabil Saragih &copy; {currentYear}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function HomeSection({ onProjectsClick }: { onProjectsClick: () => void }) {
  return (
    <SectionShell className="flex items-start py-4 sm:py-6 lg:py-8 xl:h-[calc(100svh-var(--header-h)-var(--safe-top)-1.25rem)] xl:items-center xl:py-0">
      <div
        className={cn(
          surfaceClass,
          'relative w-full overflow-hidden px-6 py-5 sm:px-7 sm:py-6 lg:px-10 lg:py-7 xl:-translate-y-2',
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.14),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.12),transparent_28%)]" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.8fr)]">
          <div className="order-1 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy-200/80 bg-navy-50/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-700 dark:border-navy-500/20 dark:bg-navy-500/10 dark:text-navy-200">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome
            </div>

            <div className="space-y-3.5">
              <p className="max-w-xl text-sm font-medium leading-6 text-navy-700 dark:text-navy-200">
                {ROLE_LABEL}
              </p>
              <h1 className="max-w-[14ch] text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl dark:text-white">
                AI-focused engineer, exploring robotics and IoT.
              </h1>
              <p className="max-w-lg text-base leading-7 text-gray-700 dark:text-gray-200">
                I design and build intelligent systems that bridge research and real-world deployment across connected technologies.
              </p>
              <p className="max-w-lg text-sm leading-7 text-gray-500 dark:text-gray-400 sm:text-[15px]">
                My work focuses on AI, with hands-on experience in computer vision, edge AI, and LLM workflows—while actively exploring robotics and IoT to build integrated, real-world solutions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {HERO_SKILLS.map((skill) => (
                <span key={skill} className={cn(chipClass, 'px-2.5 py-1 text-[11px]')}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onProjectsClick} className={primaryButtonClass}>
                View Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href="mailto:mnabilsaragih@gmail.com" className={secondaryButtonClass}>
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </div>
          </div>

          <div className="order-2 hidden justify-center lg:flex lg:justify-end">
            <div className="relative w-full max-w-[250px] sm:max-w-[290px] lg:max-w-[320px]">
              <div className="absolute inset-6 rounded-full bg-navy-200/60 blur-3xl dark:bg-navy-800/30" />

              <div className={cn(surfaceClass, 'relative overflow-hidden rounded-[32px] p-3')}>
                <div className="rounded-[24px] bg-gradient-to-br from-navy-50 via-white to-slate-100 p-2 dark:from-navy-950 dark:via-neutral-900 dark:to-slate-950">
                  <Image
                    src={profilePic}
                    alt="Portrait of Nabil Saragih"
                    priority
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 320px, 280px"
                    className="aspect-[4/5] w-full rounded-[20px] object-cover object-center"
                  />
                </div>

                <div className="mt-4 flex flex-col items-start gap-2 rounded-2xl border border-gray-200/70 bg-gray-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-950 dark:text-white">Nabil Saragih</p>
                    <p className="mt-1 text-[11px] leading-4 text-gray-500 dark:text-gray-400">AI Engineer building real-world AI systems</p>
                  </div>
                  <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-semibold text-navy-700 dark:bg-navy-500/15 dark:text-navy-200">
                    AI/ML · Edge Computing · Robotics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ProjectsSection() {
  return (
    <SectionShell className="pb-10 pt-2 sm:pb-12 sm:pt-4 lg:pb-16 lg:pt-8">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Selected Work"
          title="AI projects with practical delivery in mind."
          description="A focused set of projects that show how I approach device connectivity, machine learning, and production-ready system design."
        />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className={cn(surfaceClass, 'overflow-hidden p-4 sm:p-5')}
            >
              <div className={cn(project.gradient, 'relative overflow-hidden rounded-[24px] p-5 text-white')}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_34%)]" />

                <div className="relative flex h-44 flex-col justify-between">
                  <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                    {project.eyebrow}
                  </span>

                  <div className="flex items-end justify-between gap-4">
                    <p className="max-w-[22ch] text-sm leading-6 text-white/80">{project.surfaceCopy}</p>
                    <Briefcase className="h-10 w-10 shrink-0 text-white/25" />
                  </div>
                </div>
              </div>

              <div className="px-1 pb-1 pt-5">
                <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span key={technology} className={chipClass}>
                      {technology}
                    </span>
                  ))}
                </div>

                {project.githubUrl || project.demoUrl ? (
                  <div className="mt-5 flex items-center gap-3">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(secondaryButtonClass, 'h-10 px-4 text-xs')}
                      >
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                    ) : null}
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(secondaryButtonClass, 'h-10 px-4 text-xs')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function CertificatesSection() {
  return (
    <SectionShell className="pb-10 pt-2 sm:pb-12 sm:pt-4 lg:pb-16 lg:pt-8">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications that support hands-on engineering work."
          description="A concise set of certifications covering machine learning, cloud-connected systems, and practical AI implementation."
        />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATES.map((certificate, index) => (
            <motion.article
              key={certificate.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className={cn(surfaceClass, 'overflow-hidden p-5')}
            >
              <div className={cn(certificate.gradient, 'relative overflow-hidden rounded-[24px] p-5 text-white')}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_34%)]" />

                <div className="relative flex h-36 flex-col justify-between">
                  <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                    {certificate.issuer}
                  </span>

                  <div className="flex items-end justify-between gap-4">
                    <p className="max-w-[22ch] text-sm leading-6 text-white/80">{certificate.focus}</p>
                    <Award className="h-10 w-10 shrink-0 text-white/25" />
                  </div>
                </div>
              </div>

              <div className="px-1 pb-1 pt-5">
                <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  {certificate.title}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {certificate.date}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span>{certificate.issuer}</span>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200/70 bg-gray-50/80 px-3.5 py-3 text-xs uppercase tracking-[0.16em] text-gray-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
                  Credential ID:{' '}
                  <span className="font-mono normal-case tracking-normal text-gray-700 dark:text-gray-200">
                    {certificate.credentialId}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

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
    <SectionShell className="pb-10 pt-2 sm:pb-12 sm:pt-4 lg:pb-16 lg:pt-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Writing"
            title="Thoughts on applied AI, edge systems, and practical engineering."
            description="A focused stream of notes on building intelligent systems with clarity, reliability, and real-world constraints in mind."
          />
        </div>

        {blogPosts.length ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -3 }}
                className={cn(surfaceClass, 'flex h-full flex-col p-5 sm:p-6')}
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.03]">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.03]">
                    <FileText className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>

                <div className="mt-5 flex-1 space-y-3">
                  <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
                    <button
                      type="button"
                      onClick={() => onOpenPost(post.slug)}
                      onMouseEnter={() => onPrefetchPost(post.slug)}
                      onFocus={() => onPrefetchPost(post.slug)}
                      className="text-left transition hover:text-navy-600 focus-visible:outline-none dark:hover:text-navy-300"
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={`${post.slug}-${tag}`} className={chipClass}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => onOpenPost(post.slug)}
                    onMouseEnter={() => onPrefetchPost(post.slug)}
                    onFocus={() => onPrefetchPost(post.slug)}
                    className={cn(secondaryButtonClass, 'h-10 px-4 text-sm')}
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className={cn(surfaceClass, 'p-8 text-center')}>
            <p className="text-base text-gray-600 dark:text-gray-300">Blog posts will appear here once published.</p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close article"
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[6px] dark:bg-black/70"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[32px] border border-gray-200/70 bg-white/92 shadow-[0_36px_110px_-52px_rgba(15,23,42,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/88 dark:shadow-[0_42px_120px_-56px_rgba(0,0,0,0.95)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(62,91,175,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.06),transparent_24%)]" />

            <div className="relative flex max-h-[min(90svh,940px)] flex-col">
              <div className="border-b border-gray-200/70 px-4 py-3 sm:px-6 lg:px-8 dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                      <FileText className="h-3.5 w-3.5" />
                      Article
                    </span>

                    {readerData ? (
                      <>
                        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatLongDate(readerData.meta.date)}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
                          <FileText className="h-3.5 w-3.5" />
                          {readerData.meta.readingTimeMinutes} min read
                        </span>
                      </>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {readerData ? (
                      <Link
                        href={`/blog/${readerData.meta.slug}`}
                        className={cn(
                          secondaryButtonClass,
                          'hidden h-9 px-3.5 text-xs font-medium sm:inline-flex',
                        )}
                      >
                        Open Page
                      </Link>
                    ) : null}

                    <button type="button" onClick={onClose} className={iconButtonClass} aria-label="Close article">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="gutter-balanced overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6 lg:px-8">
                {readerLoading && !readerData ? (
                  <div className="mx-auto max-w-3xl rounded-[28px] border border-gray-200/70 bg-white/85 px-6 py-8 text-sm text-gray-500 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400">
                    Loading article...
                  </div>
                ) : null}

                {readerError ? (
                  <div className="mx-auto max-w-3xl rounded-[28px] border border-red-200/80 bg-red-50/90 px-6 py-8 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                    {readerError}
                  </div>
                ) : null}

                {readerData ? (
                  <article className="relative mx-auto max-w-[78ch] overflow-hidden rounded-[30px] border border-gray-200/70 bg-white/92 px-5 py-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:px-8 sm:py-8 lg:px-10 lg:py-10 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_28px_72px_-56px_rgba(0,0,0,0.92)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-300/80 to-transparent dark:via-navy-500/40" />

                    <div className="mx-auto max-w-3xl">
                      <BlogContent html={readerData.html} />
                    </div>
                  </article>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogMeta[]>([]);
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerData, setReaderData] = useState<ReaderData | null>(null);
  const postCache = useRef<Map<string, ReaderData>>(new Map());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let mounted = true;

    fetch('/api/posts', { cache: 'no-store' })
      .then((response) => response.json() as Promise<unknown>)
      .then((data) => {
        if (!mounted) {
          return;
        }

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
    if (!drawerOpen && !readerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen, readerOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (readerOpen) {
        setReaderOpen(false);
        return;
      }

      if (drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen, readerOpen]);

  const handleSectionChange = (section: SectionId) => {
    setActiveSection(section);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');

    root.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const prefetchPost = (slug: string) => {
    if (postCache.current.has(slug)) {
      return;
    }

    fetch(`/api/posts/${slug}`, { cache: 'no-store' })
      .then((response) => (response.ok ? (response.json() as Promise<ReaderData>) : null))
      .then((data) => {
        if (data) {
          postCache.current.set(slug, data);
        }
      })
      .catch(() => {});
  };

  const openPostInModal = (slug: string) => {
    setReaderOpen(true);
    setReaderError(null);

    if (readerData?.meta.slug === slug) {
      return;
    }

    const cachedPost = postCache.current.get(slug);

    if (cachedPost) {
      setReaderData(cachedPost);
      setReaderLoading(false);
      prefetchPost(slug);
      return;
    }

    setReaderData(null);
    setReaderLoading(true);

    fetch(`/api/posts/${slug}`, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load article');
        }

        return response.json() as Promise<ReaderData>;
      })
      .then((data) => {
        postCache.current.set(slug, data);
        setReaderData(data);
      })
      .catch(() => {
        setReaderData(null);
        setReaderError('Unable to load the article.');
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
          <BlogsSection blogPosts={blogPosts} onOpenPost={openPostInModal} onPrefetchPost={prefetchPost} />
        );
      default:
        return <HomeSection onProjectsClick={() => handleSectionChange('projects')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.1),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(62,91,175,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.08),transparent_30%)]" />

      <Header
        onMenuOpen={() => setDrawerOpen(true)}
        onSectionChange={handleSectionChange}
        onToggleTheme={handleToggleTheme}
      />

      <Sidebar activeSection={activeSection} currentYear={currentYear} onSectionChange={handleSectionChange} />

      <MobileDrawer
        activeSection={activeSection}
        currentYear={currentYear}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSectionChange={handleSectionChange}
      />

      <BlogReaderModal
        open={readerOpen}
        readerData={readerData}
        readerError={readerError}
        readerLoading={readerLoading}
        onClose={() => setReaderOpen(false)}
      />

      <main className="pt-[calc(var(--header-h)+var(--safe-top)+1.25rem)] xl:pl-[18rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
