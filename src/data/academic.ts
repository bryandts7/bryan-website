import cuhkLogo from '../assets/cuhk_logo_2.png';
import rabbitLogo from '../assets/rabbit_fund_logo.png';

interface ExperienceProps {
    year: string;
    title: string;
    company: string;
    logo?: string; // Optional since it might not always be provided
    details: string;
 }
 

export const acExp: ExperienceProps[] = [
    {
       year: '2021 - 2025',
       title: 'B.Sc in Data Science',
       company: 'The Chinese University of Hong Kong Shenzhen',
       logo: cuhkLogo,
       details: 
          '18, we were undergrads, stayed out late, never made it to class, uh ',
    },
    {
        year: 'Jan 2025 - May 2025',
        title: 'Quantitative Research (Capstone)',
        company: 'Rabbit Fund (中欧瑞博投资管理)',
        logo: rabbitLogo,
        details: 
           'Research on nonlinear high-frequency time series model of derivative index asset.',
     },
    {
        year: 'Jan 2024 - May 2024',
        title: 'Research Assistant',
        company: 'The Chinese University of Hong Kong Shenzhen',
        logo: cuhkLogo,
        details: 
           'Building Indonesian Text-to-Speech Research Project in Amphion',
     },


 ]