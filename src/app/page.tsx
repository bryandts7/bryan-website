import Image from "next/image";
import Markdown from "react-markdown";
import MyFace from "@/assets/bryan_photo_new.jpg";
import { getSiteContent } from "@/lib/content";

export default async function HomePage() {
  const aboutMe = await getSiteContent("about_me");

  return (
    <>
      {/* Main Title */}
      <h1 className="font-pixelify-sans main-title text-center text-sm md:text-8xl mt-10 hidden md:block">
        Bryan Delton
      </h1>

      {/* About Me Section */}
      <section
        id="aboutme"
        className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 my-8 sm:my-12 md:my-16 lg:my-20"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="about-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-left">
            About Me
          </h1>

          <div className="relative">
            {/* Mobile image - only shown on small screens */}
            <div className="block md:hidden w-full my-6">
              <div className="mx-auto w-48 h-48 sm:w-56 sm:h-56">
                <Image
                  className="rounded-full w-full h-full object-cover"
                  src={MyFace}
                  alt="Bryan Delton"
                  sizes="224px"
                />
              </div>
            </div>

            {/* Text content (edited in the admin console, stored as Markdown) */}
            <div className="text-left md:pr-72">
              <Markdown
                components={{
                  p: ({ children }) => (
                    <p className="text-xs sm:text-sm md:text-base lg:text-base mb-4">{children}</p>
                  ),
                  strong: ({ children }) => <b>{children}</b>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-600 hover:underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {aboutMe}
              </Markdown>
            </div>

            {/* Desktop image - absolutely positioned to align with middle of paragraphs */}
            <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2">
              <div className="w-64 h-64 lg:w-72 lg:h-72">
                <Image
                  className="rounded-full w-full h-full object-cover"
                  src={MyFace}
                  alt="Bryan Delton"
                  sizes="288px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
