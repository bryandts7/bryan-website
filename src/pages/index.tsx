import  NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Row, Col } from "antd";
import "./about.css"
import MyFace from "../assets/bryan_photo.jpg"

const Index = () => {
  return (
    <div>
      <NavBar />
      <h1 className="font-pixelify-sans main-title text-center text-sm md:text-9xl mt-10 hidden md:block">
        Bryan Delton
      </h1>

      
      <div id="aboutme" className="px-4">
        <Row className="my-16">
          {/* Empty left space (used for spacing on large screens) */}
          <Col xxl={5} xl={5} lg={3} xs={0} md={0} sm={0} />

          {/* Content section */}
          <Col
            xxl={6}
            xl={6}
            lg={14}
            xs={24}
            md={18}
            sm={20}
            className="text-left"
          >
            <h1 className="about-heading text-3xl md:text-4xl font-bold" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              About Me
            </h1>
            <br />
            <p className="about-first text-lg md:text-xl" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              I am an <b>undergraduate student</b> from the Chinese University of Hong Kong Shenzhen, pursuing my final year for
              Bachelors of Science in <b> Data Science and Big Data Technology</b>.
            </p>
            <br />
            <p className="about-second text-lg md:text-xl" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              As an <b>aspiring Data Scientist and AI Researcher</b>, I am passionate about solving complex problems and uncovering
              valuable insights from data. I have hands-on experience with various machine learning tasks, including data
              preprocessing, feature engineering, model building, and evaluation.
            </p>
            <br />
            <p className="about-third text-lg md:text-xl" data-aos="fade-up" data-aos-delay="0" data-aos-once>
              I am a dedicated team player, and I get along well with any team environment. I do well under pressure, which makes me
              a good addition to any team. I also have strong command over <b>Data Structures & Algorithms, Machine Learning,
              Gen-AI</b>, and many more Data & ML topics.
            </p>
            <br />
          </Col>

          {/* Empty middle column for spacing on larger screens */}
          <Col xxl={1} xl={1} lg={1} xs={0} />

          {/* Image Section */}
          <Col
            xxl={9}
            xl={9}
            lg={9}
            xs={24}
            className="flex justify-center items-center"
            data-aos="fade"
            data-aos-delay="500"
            data-aos-once
          >
            <section className="main">
              <div className="container">
                <div className="img-container mx-auto w-full max-w-xs md:max-w-sm lg:max-w-md">
                  <img className="rounded-full" src={MyFace} alt="MyFace" />
                </div>
              </div>
            </section>
          </Col>

          {/* Empty right space */}
          <Col lg={3} xs={0} />
        </Row>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;