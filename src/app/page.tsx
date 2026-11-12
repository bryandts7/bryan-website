import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import MyFace from "@/assets/bryan_photo_new.jpg";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import PostCard from "@/components/PostCard";
import ProjectGrid from "@/components/ProjectGrid";
import { buttonPrimary, buttonSecondary, Container, SectionHeading } from "@/components/ui";
import { getExperiences, getPosts, getProjects, getSiteContent } from "@/lib/content";
import { SITE_DESCRIPTION, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [aboutMe, posts, projects, experiences] = await Promise.all([
    getSiteContent("about_me"),
    getPosts(),
    getProjects(),
    getExperiences(),
  ]);

  // The headline role is the first "Industry experience" entry (edit it in the admin console).
  const current = experiences.find((entry) => entry.kind === "work");
  const organization = current?.organization.replace(/\s*\(.*\)\s*$/, "");

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="grid items-center gap-10 py-16 sm:py-20 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">Hi, I&apos;m</p>
            <h1 className="mt-2 font-pixel text-4xl leading-tight text-ink sm:text-6xl lg:text-7xl">
              <span className="typewriter">Bryan Delton</span>
            </h1>
            {current && (
              <p className="mt-4 text-xl text-muted">
                {current.title}
                {organization && (
                  <>
                    {" "}at <span className="font-semibold text-ink">{organization}</span>
                  </>
                )}
              </p>
            )}
            <p className="mt-3 max-w-xl text-muted">
              Machine learning, fraud detection and quant. I also write about the mathematics behind them.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/blogs" className={buttonPrimary}>
                Read the blog
              </Link>
              <Link href="/portfolio" className={buttonSecondary}>
                See projects
              </Link>
              <span className="flex items-center">
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="rounded-lg p-2.5 text-muted transition-colors hover:text-ink">
                  <GitHubIcon />
                </a>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-lg p-2.5 text-muted transition-colors hover:text-ink">
                  <LinkedInIcon />
                </a>
              </span>
            </div>
          </div>
          {/* Photo first on phones, beside the text on wider screens. */}
          <div className="order-first md:order-none">
            <Image
              src={MyFace}
              alt="Bryan Delton"
              priority
              sizes="(min-width: 1024px) 288px, (min-width: 768px) 224px, 128px"
              className="h-32 w-32 rounded-full object-cover shadow-xl ring-4 ring-surface md:h-56 md:w-56 lg:h-72 lg:w-72"
            />
          </div>
        </Container>
      </section>

      {/* About (edited in the admin console) */}
      <Container className="py-16">
        <SectionHeading title="About me" />
        <div className="prose prose-zinc max-w-3xl dark:prose-invert prose-a:text-accent">
          <Markdown>{aboutMe}</Markdown>
        </div>
      </Container>

      {posts.length > 0 && (
        <Container className="pb-16">
          <SectionHeading title="Latest writing" href="/blogs" linkLabel="All posts" />
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} headingLevel="h3" />
            ))}
          </div>
        </Container>
      )}

      {projects.length > 0 && (
        <Container className="pb-8">
          <SectionHeading title="Selected projects" href="/portfolio" linkLabel="All projects" />
          <ProjectGrid projects={projects.slice(0, 3)} headingLevel="h3" />
        </Container>
      )}
    </>
  );
}
