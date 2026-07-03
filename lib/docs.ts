import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface DocPageMeta {
  slug: string;
  title: string;
  order: number;
}

export interface DocPage {
  meta: DocPageMeta;
  content: string;
}

const docsDirectory = path.join(process.cwd(), 'content', 'flockml');

export function getSidebarNavigation(): DocPageMeta[] {
  if (!fs.existsSync(docsDirectory)) return [];
  
  const fileNames = fs.readdirSync(docsDirectory);
  const allDocs = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(docsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        order: data.order || 99,
      };
    });

  // Sort docs by order
  return allDocs.sort((a, b) => a.order - b.order);
}

export function getDocBySlug(slug: string): DocPage | null {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      meta: {
        slug,
        title: data.title || slug,
        order: data.order || 99,
      },
      content,
    };
  } catch (err) {
    return null;
  }
}
