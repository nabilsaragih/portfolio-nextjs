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
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, '$1')
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

function createExcerpt(text: string, maxLength = 160) {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return '';
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const trimmed = normalized.slice(0, maxLength + 1);
  const safeCutoff = trimmed.lastIndexOf(' ');
  const excerpt = safeCutoff > Math.floor(maxLength * 0.6) ? trimmed.slice(0, safeCutoff) : normalized.slice(0, maxLength);

  return `${excerpt.trim()}...`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapCodeToken(token: string, className: string): string {
  return `<span class="${className}">${token}</span>`;
}

const PYTHON_KEYWORDS = new Set([
  'from', 'import', 'def', 'return', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except',
  'finally', 'with', 'as', 'pass', 'break', 'continue', 'in', 'is', 'not', 'and', 'or', 'lambda', 'yield',
  'None', 'True', 'False',
]);

function highlightPython(code: string): string {
  const safe = escapeHtml(code.trim());
  const tokenRegex =
    /(#.*$)|(@[A-Za-z_]\w*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(?:from|import|def|return|class|if|elif|else|for|while|try|except|finally|with|as|pass|break|continue|in|is|not|and|or|lambda|yield|None|True|False)\b|\b(?:print|len|range|sum|min|max|map|filter|list|dict|set|tuple|str|int|float|bool|enumerate|zip|open)\b|\b\d+(?:\.\d+)?\b/gm;

  return safe.replace(tokenRegex, (match, comment, decorator, quoted) => {
    if (comment) return wrapCodeToken(comment, 'code-comment');
    if (decorator) return wrapCodeToken(decorator, 'code-decorator');
    if (quoted) return wrapCodeToken(quoted, 'code-string');

    if (/^\d/.test(match)) {
      return wrapCodeToken(match, 'code-number');
    }

    if (PYTHON_KEYWORDS.has(match)) {
      return wrapCodeToken(match, 'code-keyword');
    }

    return wrapCodeToken(match, 'code-builtin');
  });
}

function highlightCode(code: string, language: string): string {
  switch (language) {
    case 'py':
    case 'python':
      return highlightPython(code);
    default:
      return escapeHtml(code.trim());
  }
}

function markdownToHtml(md: string): string {
  // 1) Extract fenced code blocks into placeholders to avoid double-escaping
  const codeBlocks: string[] = [];
  // Support CRLF/LF and optional trailing newline before closing fence
  let text = md.replace(/```(\w+)?[ \t]*\r?\n([\s\S]*?)\r?\n?```/g, (_m, lang, code) => {
    const language = (lang ?? '').toString().toLowerCase();
    // Treat plain text fences as callout instead of code block
    if (language === 'text' || language === 'plaintext' || language === 'txt') {
      const safe = escapeHtml(code.trim());
      const html = `<blockquote><p>${safe.replace(/\n/g, '<br/>')}</p></blockquote>`;
      const i = codeBlocks.push(html) - 1;
      return `:::CODE_BLOCK_${i}:::`;
    }

    const safe = highlightCode(code, language);
    const cls = language ? ` class="language-${language}"` : '';
    const dataLanguage = language ? ` data-language="${language}"` : '';
    const html = `<pre${dataLanguage}><code${cls}>${safe}</code></pre>`;
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

type ParsedPost = {
  content: string;
  meta: PostMeta;
};

function parsePostFile(file: string): ParsedPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { data, content } = parseFrontMatter(raw);
  const plain = stripMarkdown(content);
  const title = typeof data.title === 'string' ? data.title.trim() : path.parse(file).name;
  const date = typeof data.date === 'string' ? data.date : new Date().toISOString().slice(0, 10);
  const excerpt =
    typeof data.excerpt === 'string' && data.excerpt.trim() ? data.excerpt.trim() : createExcerpt(plain);
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const readingTimeMinutes = estimateReadingTimeMinutes(plain);
  const slugSource = typeof data.slug === 'string' ? data.slug : path.parse(file).name;
  const slug = slugify(slugSource);

  return {
    content,
    meta: { slug, title, date, excerpt, tags, readingTimeMinutes },
  };
}

function getAllParsedPosts(): ParsedPost[] {
  ensureBlogDir();
  const entries = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  return entries.map(parsePostFile).sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllParsedPosts().map((post) => post.meta);
}

export function getPostBySlug(slug: string): { meta: PostMeta; html: string } | null {
  const normalizedSlug = slugify(slug);
  const post = getAllParsedPosts().find((entry) => entry.meta.slug === normalizedSlug);

  if (!post) {
    return null;
  }

  return {
    meta: post.meta,
    html: markdownToHtml(post.content),
  };
}
