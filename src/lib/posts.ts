import fs from 'fs';
import path from 'path';

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  tags: string[];
  readingTimeMinutes: number;
};

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type FrontMatter = Record<string, string | string[] | undefined>;

function parseFrontMatter(raw: string): { data: FrontMatter; content: string } {
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    return { data: {}, content: raw };
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end === -1) return { data: {}, content: raw };
  const fmLines = lines.slice(1, end);
  const content = lines.slice(end + 1).join('\n');

  const data: FrontMatter = {};
  let currentKey: string | null = null;
  for (const line of fmLines) {
    const m = line.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/);
    if (m) {
      const key = m[1];
      const value = m[2];
      currentKey = key;
      if (value === '' || value === null || value === undefined) {
        // Possible multi-line array to follow
        data[key] = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Try JSON-style array
        try {
          const parsed = JSON.parse(value.replace(/'(.*?)'/g, '"$1"')) as unknown;
          data[key] = Array.isArray(parsed) ? parsed.map(String) : String(parsed);
        } catch {
          data[key] = value as string;
        }
      } else {
        const unquoted = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        data[key] = unquoted;
      }
      continue;
    }
    const arr = line.match(/^\s*-\s*(.*)$/);
    if (arr && currentKey && Array.isArray(data[currentKey])) {
      const v = arr[1].replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      (data[currentKey] as string[]).push(v);
      continue;
    }
    // Ignore other YAML complexity for simplicity
  }
  return { data, content };
}

function stripMarkdown(md: string): string {
  return md
    // code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // inline code
    .replace(/`[^`]*`/g, ' ')
    // images ![alt](url)
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
    // links [text](url)
    .replace(/\[[^\]]*\]\([^\)]*\)/g, (m) => m.replace(/\[[^\]]*\]\([^\)]*\)/g, ''))
    // headings and emphasis
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/[_]{1,2}([^_]+)[_]{1,2}/g, '$1')
    // html tags
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateReadingTimeMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function markdownToHtml(md: string): string {
  // 1) Extract fenced code blocks into placeholders to avoid double-escaping
  const codeBlocks: string[] = [];
  // Support CRLF/LF and optional trailing newline before closing fence
  let text = md.replace(/```(\w+)?[ \t]*\r?\n([\s\S]*?)\r?\n?```/g, (_m, lang, code) => {
    const language = (lang ?? '').toString().toLowerCase();
    const safe = escapeHtml(code.trim());
    // Treat plain text fences as callout instead of code block
    if (language === 'text' || language === 'plaintext' || language === 'txt') {
      const html = `<blockquote><p>${safe.replace(/\n/g, '<br/>')}</p></blockquote>`;
      const i = codeBlocks.push(html) - 1;
      return `:::CODE_BLOCK_${i}:::`;
    }
    const cls = language ? ` class="language-${language}"` : '';
    const html = `<pre><code${cls}>${safe}</code></pre>`;
    const i = codeBlocks.push(html) - 1;
    return `:::CODE_BLOCK_${i}:::`;
  });

  // 2) Escape remaining content to neutralize raw HTML
  text = escapeHtml(text);

  // 3) Basic markdown replacements (headings, bold, italic, links, images, inline code)
  text = text
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  // 4) Restore code blocks
  text = text.replace(/:::CODE_BLOCK_(\d+):::/g, (_m, idx) => codeBlocks[Number(idx)] ?? '');

  // 5) Paragraphs: split on blank lines and wrap non-block elements
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const html = blocks
    .map((b) => (/^<\/?(h1|h2|h3|pre|ul|ol|li|img|blockquote)/.test(b) ? b : `<p>${b.replace(/\n/g, '<br/>')}</p>`))
    .join('\n');

  return html;
}

export function getAllPostsMeta(): PostMeta[] {
  ensureBlogDir();
  const entries = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const items: PostMeta[] = entries.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data, content } = parseFrontMatter(raw);
    const title: string = typeof data.title === 'string' ? data.title : path.parse(file).name;
    const date: string = typeof data.date === 'string' ? data.date : new Date().toISOString().slice(0, 10);
    const excerpt: string = typeof data.excerpt === 'string' ? data.excerpt : '';
    const tags: string[] = Array.isArray(data.tags) ? data.tags.map(String) : [];
    const plain = stripMarkdown(content);
    const readingTimeMinutes = estimateReadingTimeMinutes(plain);
    const slug = typeof data.slug === 'string' ? data.slug : slugify(path.parse(file).name);
    return { slug, title, date, excerpt, tags, readingTimeMinutes };
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): { meta: PostMeta; html: string } | null {
  ensureBlogDir();
  const file = fs.readdirSync(BLOG_DIR).find((f) => slugify(path.parse(f).name) === slug);
  if (!file) return null;
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { data, content } = parseFrontMatter(raw);
  const metaList = getAllPostsMeta();
  const meta = metaList.find((m) => m.slug === slug);
  if (!meta) return null;
  const html = markdownToHtml(content);
  return { meta, html };
}
