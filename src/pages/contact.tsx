import  NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Contact_ANTD from '../components/contact_antd';
import Title from '../components/title';


const contacts = () => {

    return(
        <div>
            <NavBar/>
            <div className='contact-container'>
            <Title className="text-2xl">Contact Me!</Title>
            <br />
                <div className="form-wrapper">
                    <Contact_ANTD/>
                </div>
            </div>
            <Footer/>
        </div>
    );

}

export default contacts