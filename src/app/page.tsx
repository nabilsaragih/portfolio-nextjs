'use client';
import Image from 'next/image';
import {
  ChevronDown, Github, Linkedin, Mail, ExternalLink, Award, Calendar,
  User, Briefcase, FileText, Menu, Moon, Sun, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect, useRef, type ReactNode } from 'react';
import profilePic from '../assets/profile.jpg';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = useMemo(() => ([
    { id: 'home', label: 'Home', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'blog', label: 'Blogs', icon: FileText },
  ]), []);

  const projects = [
    { id: 1, title: 'Smart Home Automation System',
      description: 'IoT platform featuring AI-driven energy optimization, voice control, and predictive maintenance.',
      technologies: ['Python','TensorFlow','Arduino','MQTT'],
      image: 'https://via.placeholder.com/800x500/6366f1/ffffff?text=Smart+Home+IoT', github: '#', demo: '#'
    },
    { id: 2, title: 'AI-Powered Crop Monitoring',
      description: 'Sensor network plus ML models for precision agriculture: monitor crop health and forecast yields.',
      technologies: ['PyTorch','Raspberry Pi','LoRaWAN','Computer Vision'],
      image: 'https://via.placeholder.com/800x500/8b5cf6/ffffff?text=AI+Agriculture', github: '#', demo: '#'
    },
    { id: 3, title: 'Industrial Predictive Maintenance',
      description: 'Predictive maintenance system using IoT sensors to detect potential failures early.',
      technologies: ['Scikit-learn','Edge','InfluxDB','Grafana'],
      image: 'https://via.placeholder.com/800x500/06b6d4/ffffff?text=Industrial+AI', github: '#', demo: '#'
    },
  ];

  const certificates = [
    { id: 1, title: 'TensorFlow Developer Certificate', issuer: 'Google', date: '2024',
      image:'https://via.placeholder.com/600x400/ff6b35/ffffff?text=TensorFlow+Certified', credentialId:'TF-12345' },
    { id: 2, title: 'AWS IoT Core Certification', issuer: 'Amazon Web Services', date: '2023',
      image:'https://via.placeholder.com/600x400/61dafb/ffffff?text=AWS+IoT+Certified', credentialId:'AWS-67890' },
    { id: 3, title: 'Machine Learning Engineering', issuer: 'Coursera', date: '2023',
      image:'https://via.placeholder.com/600x400/0a0a23/ffffff?text=ML+Engineering', credentialId:'COURSERA-11111' },
  ];

  // Tech stack chips for hero scroller
  const techStack = useMemo(() => (
    ['AI','IoT','Computer Vision','Edge AI','LLM','MLOps']
  ), []);

  type BlogMeta = { slug: string; title: string; excerpt: string; date: string; readTime: string; tags: string[] };
  const [blogPosts, setBlogPosts] = useState<BlogMeta[]>([]);
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerData, setReaderData] = useState<null | { meta: { slug: string; title: string; date: string; excerpt: string; tags: string[]; readingTimeMinutes: number }; html: string }>(null);
  const postCache = useRef(new Map<string, { meta: { slug: string; title: string; date: string; excerpt: string; tags: string[]; readingTimeMinutes: number }; html: string }>());
  useEffect(() => {
    let mounted = true;
    fetch('/api/posts', { cache: 'no-store' })
      .then((r) => r.json() as Promise<unknown>)
      .then((data) => {
        if (!mounted) return;
        const mapped: BlogMeta[] = Array.isArray(data)
          ? data.map((d) => {
              const obj = d as Record<string, unknown>;
              const tags = Array.isArray(obj.tags) ? (obj.tags as unknown[]).map(String) : [];
              return {
                slug: String(obj.slug ?? ''),
                title: String(obj.title ?? ''),
                excerpt: String(obj.excerpt ?? ''),
                date: String(obj.date ?? ''),
                readTime: `${Number(obj.readingTimeMinutes ?? 0)} min read`,
                tags,
              };
            })
          : [];
        setBlogPosts(mapped);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const prefetchPost = (slug: string) => {
    if (postCache.current.has(slug)) return;
    fetch(`/api/posts/${slug}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) postCache.current.set(slug, data);
      })
      .catch(() => {});
  };

  const openPostInModal = (slug: string) => {
    // Open modal immediately
    setReaderOpen(true);
    setReaderError(null);

    // If already showing this post, do nothing
    if (readerData?.meta?.slug === slug) return;

    const cached = postCache.current.get(slug);
    if (cached) {
      setReaderData(cached);
      setReaderLoading(false);
      // Optionally revalidate in background
      prefetchPost(slug);
      return;
    }

    // Keep previous content while loading new
    setReaderLoading(true);
    fetch(`/api/posts/${slug}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then((data) => {
        postCache.current.set(slug, data);
        setReaderData(data);
      })
      .catch(() => setReaderError('Gagal memuat artikel'))
      .finally(() => setReaderLoading(false));
  };

  // Lock background scroll when modal open (better UX, avoids jumpiness)
  useEffect(() => {
    if (readerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [readerOpen]);

  // Animasi
  const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
  const springy = { whileHover: { y: -4, scale: 1.01 }, whileTap: { scale: 0.98 } };

  const Section = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <motion.section variants={fade} initial="hidden" animate="show"
      className={`mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</motion.section>
  );

  const Pill = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <span className={`inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 ${className}`}>{children}</span>
  );

  const NavButtons = ({ orientation = 'vertical' }: {orientation?: 'vertical'|'horizontal'}) => (
    <div className={orientation === 'vertical' ? 'flex flex-col space-y-2' : 'grid grid-cols-4 w-full h-full'}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        const base = 'transition-all focus:outline-none focus:ring-2 focus:ring-navy-500';
        const verticalBtn = 'flex items-center gap-2 rounded-xl px-4 py-3 focus:ring-offset-2';
        const horizontalBtn = 'flex h-full w-full min-w-0 flex-col items-center justify-center gap-1 rounded-none px-0 py-1 focus:ring-offset-0';
        const cls = orientation === 'vertical'
          ? `${verticalBtn} ${base} ${active ? 'bg-navy-650 text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`
          : `${horizontalBtn} ${base} ${active ? 'text-navy-600' : 'text-gray-600 dark:text-gray-300'}`;
        return (
          <motion.button key={item.id} {...springy} className={cls}
            onClick={() => { setActiveSection(item.id); setDrawerOpen(false); }} aria-current={active ? 'page' : undefined}>
            <Icon className="h-5 w-5" />
            <span className={orientation === 'vertical' ? 'font-medium' : 'text-[11px] leading-none truncate max-w-[5rem]'}>{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );

  // Toggle tema TANPA state React → tidak ada mismatch
  const handleToggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const Header = () => (
    <header className="fixed inset-x-0 top-0 z-40 h-[calc(var(--header-h)+var(--safe-top))] border-b border-gray-200/80 dark:border-gray-800/80 bg-white/75 dark:bg-neutral-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Section className="flex h-[calc(var(--header-h)+var(--safe-top))] items-center justify-between gap-3 pt-[var(--safe-top)]">
        <div className="flex items-center gap-2">
          <button
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-navy-500"
            onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-navy-600" />
            <span className="font-semibold tracking-tight">Nabil Saragih</span>
            <Pill className="ml-1 hidden sm:inline-flex">AI & IoT Engineer</Pill>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="https://github.com/nabilsaragih" target="_blank"
             className="hidden sm:inline-flex h-11 items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Github className="h-4 w-4" /><span className="text-sm">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/nabilsaragih/" target="_blank"
             className="hidden sm:inline-flex h-11 items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Linkedin className="h-4 w-4" /><span className="text-sm">LinkedIn</span>
          </a>

          {/* TOMBOL THEME: render kedua ikon, sembunyikan via class → anti-hydration mismatch */}
          <motion.button
            {...springy}
            onClick={handleToggleTheme}
            className="h-11 w-11 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {/* Light icon (tampil di light) */}
            <Moon className="h-4 w-4 inline dark:hidden" />
            {/* Dark icon (tampil di dark) */}
            <Sun className="h-4 w-4 hidden dark:inline" />
          </motion.button>

          <motion.button
            {...springy}
            onClick={() => setActiveSection('projects')}
            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-navy-650 px-4 py-2 text-white shadow-lg hover:shadow-xl">
            View My Work <ChevronDown className="h-4 w-4" />
          </motion.button>
        </div>
      </Section>
    </header>
  );

  const Sidebar = () => (
    <aside className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-72 xl:flex-col xl:border-r xl:border-gray-200 dark:xl:border-gray-800 xl:bg-white/60 dark:xl:bg-neutral-950/60 xl:backdrop-blur xl:pt-[calc(var(--header-h)+var(--safe-top))]">
      <div className="flex flex-col p-6 gap-6">
        <div className="flex items-center gap-3">
          <Image src={profilePic} alt="Profile" width={56} height={56} className="rounded-full border-[0.25px] border-white/25 shadow" />
          <div>
            <p className="font-semibold">Nabil Saragih</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI & IoT Engineer</p>
          </div>
        </div>
        <NavButtons orientation="vertical" />
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <a href="mailto:mnabilsaragih@gmail.com" className="rounded-lg border border-gray-200 dark:border-gray-800 px-2 py-2 text-center hover:bg-gray-50 dark:hover:bg-gray-800">Email</a>
          <a href="https://github.com/nabilsaragih" target="_blank" className="rounded-lg border border-gray-200 dark:border-gray-800 px-2 py-2 text-center hover:bg-gray-50 dark:hover:bg-gray-800">GitHub</a>
          <a href="https://www.linkedin.com/in/nabilsaragih/" target="_blank" className="rounded-lg border border-gray-200 dark:border-gray-800 px-2 py-2 text-center hover:bg-gray-50 dark:hover:bg-gray-800">LinkedIn</a>
        </div>
      </div>
    </aside>
  );

  const Drawer = () => (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div className="fixed inset-0 z-50 xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
          <motion.div
            className="absolute left-0 top-0 h-full w-80 max-w-[80%] bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-gray-800 p-6"
            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            <div className="mb-6 flex items-center gap-3">
              <Image src={profilePic} alt="Profile" width={48} height={48} className="rounded-full" />
              <div>
                <p className="font-semibold">Nabil Saragih</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI & IoT Engineer</p>
              </div>
            </div>
            <NavButtons orientation="vertical" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ====== Sections (sama seperti sebelumnya, tidak diubah) ======
  const Home = () => (
    <div className="relative overflow-visible">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-navy-50 via-white to-navy-100 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900" />
      <Section className="vh-tight py-6 sm:py-8 lg:py-10 min-h-[calc(100svh-var(--header-h)-var(--safe-top)-var(--bottom-nav-h)-var(--safe-bottom))] xl:min-h-[calc(100svh-var(--header-h)-var(--safe-top))] flex items-start xl:items-center">
        <div className="grid hero-gap items-center gap-8 lg:gap-10 lg:grid-cols-2 min-w-0">
          {/* Text */}
          <motion.div variants={fade} className="order-2 lg:order-1 min-w-0">
            <Pill className="mb-4">Welcome 👋</Pill>
            <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white break-words hyphens-auto max-w-full">
              Hi, I’m <span className="text-navy-600">Nabil</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-prose">
              I design and build end‑to‑end AI and IoT solutions — from data acquisition and architecture, through Computer Vision and LLM modeling, to deployment across edge and cloud — with a strong focus on reliability, security, and measurable business impact.
            </p>
            {/* Tech stack: wrap on larger screens; on small screens auto-scroll if many */}
            {techStack.length > 6 ? (
              <div className="mt-4 sm:hidden">
                <div className="marquee" aria-label="Tech stack auto scroll">
                  <div className="marquee-track">
                    <div className="marquee-group">
                      {techStack.map((s) => (<Pill key={`m1-${s}`}>{s}</Pill>))}
                    </div>
                    <div className="marquee-group" aria-hidden="true">
                      {techStack.map((s) => (<Pill key={`m2-${s}`}>{s}</Pill>))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 sm:hidden flex flex-wrap gap-2">
                {techStack.map((s) => (<Pill key={s}>{s}</Pill>))}
              </div>
            )}
            <div className="mt-4 hidden sm:flex flex-wrap gap-2">
              {techStack.map((s) => (<Pill key={`lg-${s}`}>{s}</Pill>))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 cta-group">
              <motion.button {...springy} onClick={() => setActiveSection('projects')}
                className="inline-flex items-center gap-2 rounded-xl bg-navy-650 px-5 py-3 text-white shadow-lg hover:shadow-xl">
                View Projects <ChevronDown className="h-4 w-4" />
              </motion.button>
              <a href="mailto:mnabilsaragih@gmail.com"
                 className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-800 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Mail className="h-4 w-4" /> Contact
              </a>
            </div>
          </motion.div>

          {/* Photo (on top for mobile, smaller). Hidden on ultra-narrow screens and short viewports */}
          <motion.div className="hero-photo relative order-1 lg:order-2 mx-auto w-full hidden min-[400px]:block max-w-[160px] sm:max-w-[240px] md:max-w-md min-w-0"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="relative rounded-3xl border-[0.25px] border-white/25 dark:border-white/5 bg-white/40 dark:bg-white/[0.04] shadow-2xl p-1.5 sm:p-2 backdrop-blur">
              <Image src={profilePic} alt="Profile" width={800} height={800}
                     className="h-auto w-full rounded-2xl object-cover" priority />
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );

  const Projects = () => (
    <Section className="pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Featured Projects</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Selected recent work highlighting AI & IoT capabilities.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, idx) => (
          <motion.article key={p.id} {...springy}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 shadow hover:shadow-xl">
            <div className="aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.title}
                   className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <Pill key={t} className="bg-navy-50 dark:bg-navy-500/10 border-navy-200/60 dark:border-navy-900/40 text-navy-700 dark:text-navy-300">{t}</Pill>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4">
                <a href={p.github} className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-navy-600">
                  <Github className="h-4 w-4" /> Code
                </a>
                <a href={p.demo} className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-navy-600">
                  <ExternalLink className="h-4 w-4" /> Demo
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );

  const Certificates = () => (
    <Section className="pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Certifications</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Professional certifications validating expertise.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {certificates.map((c, idx) => (
          <motion.div key={c.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 shadow hover:shadow-xl">
            <div className="aspect-[16/10] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{c.issuer}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{c.date}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500 font-mono">Credential ID: {c.credentialId}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );

  const Blog = () => (
    <Section className="pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
      <div className="mb-8 sm:mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Blogs</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Insights on AI engineering, IoT, and emerging technology.</p>
      </div>
      <div className="space-y-6">
        {blogPosts.map((post, idx) => (
          <motion.article key={post.slug}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 p-6 shadow hover:shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                <button
                  type="button"
                  onClick={() => openPostInModal(post.slug)}
                  onMouseEnter={() => prefetchPost(post.slug)}
                  onFocus={() => prefetchPost(post.slug)}
                  className="text-left hover:text-navy-600 focus:outline-none">
                  {post.title}
                </button>
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span><span>{post.readTime}</span>
              </div>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (<Pill key={`${post.slug}-${tag}`}>{tag}</Pill>))}
            </div>
            <button
              type="button"
              onClick={() => openPostInModal(post.slug)}
              onMouseEnter={() => prefetchPost(post.slug)}
              onFocus={() => prefetchPost(post.slug)}
              className="mt-4 inline-flex items-center gap-2 text-navy-600 hover:text-navy-800 font-medium">
              Read More <ExternalLink className="h-4 w-4" />
            </button>
          </motion.article>
        ))}
      </div>
    </Section>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return <Home />;
      case 'projects': return <Projects />;
      case 'certificates': return <Certificates />;
      case 'blog': return <Blog />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      <Drawer />

      {/* Blog Reader Modal (root view) */}
      <AnimatePresence>
        {readerOpen && (
          <motion.div className="fixed inset-0 z-50 w-[100svw] h-[100svh] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="fixed inset-0 bg-black/50" onClick={() => setReaderOpen(false)} />
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="relative w-full max-w-[880px] mx-4 my-4 sm:mx-6 sm:my-6 max-h-[calc(100svh-var(--safe-top)-var(--safe-bottom)-2rem)] sm:max-h-[calc(100svh-var(--safe-top)-var(--safe-bottom)-3rem)] overflow-y-auto gutter-balanced rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-500">{readerData?.meta?.date ? new Date(readerData.meta.date).toLocaleDateString() : ''}</p>
                  <h3 className="truncate text-base sm:text-lg font-semibold">{readerData?.meta?.title ?? 'Loading…'}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {readerData?.meta?.slug && (
                    <a href={`/blog/${readerData.meta.slug}`} className="text-xs sm:text-sm text-navy-600 hover:text-navy-800">Open page</a>
                  )}
                  <button onClick={() => setReaderOpen(false)} className="inline-flex h-9 items-center rounded-lg border border-gray-200 dark:border-gray-800 px-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Close
                  </button>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-5">
                {readerLoading && <p className="text-sm text-gray-500">Loading…</p>}
                {readerError && <p className="text-sm text-red-600">{readerError}</p>}
                {readerData && (
                  <div className="mx-auto max-w-[75ch]">
                    {readerData.meta.tags?.length ? (
                      <div className="mb-4 flex flex-wrap gap-2 text-xs">
                        {readerData.meta.tags.map((t) => (
                          <span key={`${readerData.meta.slug}-${t}`} className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-white/5 px-2 py-1 text-gray-700 dark:text-gray-200">{t}</span>
                        ))}
                      </div>
                    ) : null}
                    <div className="prose prose-sm sm:prose prose-neutral dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: readerData.html }} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offsets: header (+safe-top) and mobile bottom nav (+safe-bottom). Sidebar offset via xl:ml-72 */}
      <main className="pt-[calc(var(--header-h)+var(--safe-top))] pb-[calc(var(--bottom-nav-h)+var(--safe-bottom))] xl:pb-0 xl:ml-72">
        {renderContent()}
      </main>

      {/* Bottom tab bar (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 h-[var(--bottom-nav-h)] border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-neutral-950/80 backdrop-blur xl:hidden">
        <div className="mx-auto h-full w-full max-w-[1200px] px-2 pb-[var(--safe-bottom)]">
          <NavButtons orientation="horizontal" />
        </div>
      </nav>
    </div>
  );
}
