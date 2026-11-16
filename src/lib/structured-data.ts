import type { Post } from "./content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME, SITE_URL, SOCIAL_LINKS } from "./site";

/*
 * Structured data (schema.org JSON-LD) that tells search engines what a page
 * is: who the site belongs to, and which pages are blog posts with which
 * author and dates. Rendered with <JsonLd>.
 */

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const authorRef = { "@type": "Person", "@id": PERSON_ID, name: SITE_NAME, url: `${SITE_URL}/` };

/** Home page: the site itself and the person it belongs to. */
export function homeStructuredData({
  photoUrl,
  jobTitle,
  organization,
  alumniOf,
}: {
  photoUrl: string;
  jobTitle?: string;
  organization?: string;
  alumniOf: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: `${SITE_URL}/`,
        image: absolute(photoUrl),
        ...(jobTitle && { jobTitle }),
        ...(organization && { worksFor: { "@type": "Organization", name: organization } }),
        ...(alumniOf.length > 0 && {
          alumniOf: alumniOf.map((name) => ({ "@type": "CollegeOrUniversity", name })),
        }),
        sameAs: Object.values(SOCIAL_LINKS),
      },
    ],
  };
}

/** A blog post: what it is, who wrote it, when, plus its place in the site. */
export function postStructuredData(post: Post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.excerpt,
        image: [post.cover_image_url ? absolute(post.cover_image_url) : `${url}/opengraph-image`],
        ...(post.published_at && { datePublished: post.published_at }),
        dateModified: post.updated_at,
        author: authorRef,
        publisher: authorRef,
        ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID, url: `${SITE_URL}/`, name: SITE_NAME },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blogs` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

function absolute(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
