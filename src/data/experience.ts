import tiktokLogo from '../assets/tiktok_logo.png';
import ocbcLogo from '../assets/ocbc_logo.png'
import finkuLogo from '../assets/finku_logo.png'
import pixalateLogo from '../assets/pixalate_logo.png'

interface ExperienceProps {
    year: string;
    title: string;
    company: string;
    logo?: string; // Optional since it might not always be provided
    details: string;
 }

export const indExp: ExperienceProps[] = [
    {
        year: 'Mar 2025 - Current',
        title: 'Data Scientist',
        company: 'Pixalate (Virginia, United States)',
        logo: pixalateLogo,
        details: 
           'Excited to contribute ASAP!',
     },
    {
       year: 'Jun 2024 - Oct 2024',
       title: 'Data Scientist Intern',
       company: 'OCBC (Jakarta, Indonesia)',
       logo: ocbcLogo,
       details: 
          'End-to-end RAG Development for Bank Compliance Chatbot',
    },
    {
         year: 'Jun 2023 - Oct 2023',
         title: 'Business Analyst Intern',
         company: 'TikTok / ByteDance (Jakarta, Indonesia)',
         logo: tiktokLogo,
         details:
             "Strategy, Decision-Making, & Business Analytics for TikTok Shop Indonesia. Directly managed under Shanghai Office.",
     },
     {
         year: 'Aug 2022 - Apr 2023',
         title: 'Data Analyst Intern ',
         company: 'Finku (Jakarta, Indonesia)',
         logo: finkuLogo,
         details:
             'End-to-end Sentiment Analysis using NLP, Product Analytics, and Dashboard Automation ',
     },

 ];