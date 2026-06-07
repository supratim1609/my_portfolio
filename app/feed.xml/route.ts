import { getSortedPostsData } from "@/lib/blog";

export async function GET() {
  const posts = getSortedPostsData();
  const siteUrl = "https://supratimdev.qzz.io";

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Supratim Dhara | Notes</title>
    <link>${siteUrl}</link>
    <description>Deep dives into software engineering, system architecture, and building high-performance apps.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        return `
    <item>
      <title><![CDATA[${post.metadata.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.description}]]></description>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
