import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

export interface BlogPost {
  metadata: BlogPostMetadata;
  content: string;
}

export function getSortedPostsData(): BlogPostMetadata[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || "Untitled",
        date: matterResult.data.date || new Date().toISOString(),
        description: matterResult.data.description || "",
        tags: matterResult.data.tags || [],
      } as BlogPostMetadata;
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostData(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  return {
    metadata: {
      slug,
      title: matterResult.data.title || "Untitled",
      date: matterResult.data.date || new Date().toISOString(),
      description: matterResult.data.description || "",
      tags: matterResult.data.tags || [],
    },
    content: matterResult.content,
  };
}
