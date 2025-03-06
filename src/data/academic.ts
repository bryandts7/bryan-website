import cuhkLogo from '../assets/cuhk_logo_2.png';

interface ExperienceProps {
    year: string;
    title: string;
    duration: string;
    logo?: string; // Optional since it might not always be provided
    details: string;
 }
 

export const acExp: ExperienceProps[] = [
    {
       year: '2021 - Today',
       title: 'Bachelor of Science in Data Science, The Chinese University of Hong Kong Shenzhen',
       duration: '4 years',
       logo: cuhkLogo,
       details: 
          '18, we were undergrads, stayed out late, never made it to class, uh ',
    },
    {
        year: 'Jan 2024 - May 2024',
        title: 'Research Assistant, The Chinese University of Hong Kong Shenzhen',
        duration: '5 months',
        logo: cuhkLogo,
        details: 
           'Building Indonesian Text-to-Speech Research Project in Amphion',
     },


 ]