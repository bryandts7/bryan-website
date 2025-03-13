import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import "./about.css";
import MyFace from "../assets/bryan_photo.jpg";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      {/* Main Title */}
      <h1 className="font-pixelify-sans main-title text-center text-sm md:text-8xl mt-10 hidden md:block">
        Bryan Delton
      </h1>

      {/* About Me Section */}
      <section id="aboutme" className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 my-8 sm:my-12 md:my-16 lg:my-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="about-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-left" data-aos="fade-up" data-aos-delay="0" data-aos-once>
            About Me
          </h1>
          
          <div className="relative">
            {/* Text content */}
            <div className="text-left md:pr-72">
              <p className="text-xs sm:text-sm md:text-base lg:text-base mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
                My name is <b>Bryan Delton Tawarikh Sibarani (Bryan)</b>. I am an <b>undergraduate student</b> from the Chinese University of Hong Kong Shenzhen, pursuing my final year for
                Bachelors of Science in <b>Data Science and Big Data Technology</b>.
              </p>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-base mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
                As an <b>aspiring Data Scientist and AI Researcher</b>, I am passionate about solving complex problems and uncovering
                valuable insights from data. I have hands-on experience with various machine learning tasks, including data
                preprocessing, feature engineering, model building, and evaluation.
              </p>
              
              {/* Mobile image - only shown on small screens */}
              <div className="block md:hidden w-full my-6">
                <div className="mx-auto img-container w-48 h-48 sm:w-56 sm:h-56">
                  <img
                    className="rounded-full w-full h-full object-cover"
                    src={MyFace}
                    alt="MyFace"
                  />
                </div>
              </div>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-base mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
                I am a dedicated team player, and I get along well with any team environment. I do well under pressure, which makes me
                a good addition to any team. I also have strong command over <b>Data Structures & Algorithms, Machine Learning,
                Gen-AI</b>, and many more Data & ML topics.
              </p>
              
              <p className="text-xs sm:text-sm md:text-base lg:text-base mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
                Outside of work, I enjoy myself in various sports, including football and basketball. 
                I am also interested in Public Policy, Finance, and Economics. Hit me up for any discussion.
              </p>
            </div>
            
            {/* Desktop image - absolutely positioned to align with middle of paragraphs */}
            <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2" data-aos="fade" data-aos-delay="500" data-aos-once>
              <div className="img-container w-64 h-64 lg:w-72 lg:h-72">
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={MyFace}
                  alt="MyFace"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;