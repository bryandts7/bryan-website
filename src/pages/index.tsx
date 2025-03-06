import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Row, Col } from "antd";
import "./about.css";
import MyFace from "../assets/bryan_photo.jpg";

const Index = () => {
  return (
    <div>
      <NavBar />
      
      {/* Main Title */}
      <h1 className="font-pixelify-sans main-title text-center text-sm md:text-8xl mt-10 hidden md:block">
        Bryan Delton
      </h1>

      {/* About Me Section */}
      <div id="aboutme" className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Row className="my-8 sm:my-12 md:my-16 lg:my-20">
          {/* Left Spacing (Hidden on smaller screens) */}
          <Col xxl={4} xl={4} lg={2} md={1} sm={0} xs={0} />

          {/* Content Section */}
          <Col
            xxl={12}
            xl={12}
            lg={16}
            md={22}
            sm={24}
            xs={24}
            className="text-left"
          >
            <h1 className="about-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              About Me
            </h1>
            <p className="about-first text-base sm:text-lg md:text-xl lg:text-xl mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              I am an <b>undergraduate student</b> from the Chinese University of Hong Kong Shenzhen, pursuing my final year for
              Bachelors of Science in <b>Data Science and Big Data Technology</b>.
            </p>
            <p className="about-second text-base sm:text-lg md:text-xl lg:text-xl mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              As an <b>aspiring Data Scientist and AI Researcher</b>, I am passionate about solving complex problems and uncovering
              valuable insights from data. I have hands-on experience with various machine learning tasks, including data
              preprocessing, feature engineering, model building, and evaluation.
            </p>
            <p className="about-third text-base sm:text-lg md:text-xl lg:text-xl mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              I am a dedicated team player, and I get along well with any team environment. I do well under pressure, which makes me
              a good addition to any team. I also have strong command over <b>Data Structures & Algorithms, Machine Learning,
              Gen-AI</b>, and many more Data & ML topics.
            </p>
            <p className="about-third text-base sm:text-lg md:text-xl lg:text-xl mb-4" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              Outside of work, I enjoy myself in various sports, including football and basketball. 
              I am also interested in Public Policy, Finance, and Economics. Hit me up for any discussion.
            </p>
          </Col>

          {/* Image Section */}
          <Col
            xxl={6}
            xl={6}
            lg={6}
            md={24}
            sm={24}
            xs={24}
            className="flex justify-center items-center mt-8 sm:mt-10 md:mt-12 lg:mt-0"
            data-aos="fade"
            data-aos-delay="500"
            data-aos-once
          >
            <div className="img-container w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
              <img
                className="rounded-full w-full h-full object-cover"
                src={MyFace}
                alt="MyFace"
              />
            </div>
          </Col>

          {/* Right Spacing (Hidden on smaller screens) */}
          <Col xxl={4} xl={4} lg={2} md={1} sm={0} xs={0} />
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default Index;