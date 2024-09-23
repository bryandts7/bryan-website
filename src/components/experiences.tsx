import React from 'react';
import indExp from '../data/experience.js';
import acExp from '../data/academic.js';
import Experience from '../components/experience';
import Title from '../components/title';

function Experiences() {
   return (
    <div className="flex flex-col md:flex-row justify-center my-20 space-y-10 md:space-y-0 md:space-x-10">
         <div className="w-full md:w-1/2 px-20">
            <Title>Industry Experience</Title>
            {indExp.map((item, index) => (
               <Experience 
                  key={index}
                  year={item.year}
                  title={item.title}
                  duration={item.duration}
                  logo={item.logo}
                  details={item.details}
               />
            ))}
         </div>
         <div className="w-full md:w-1/2 px-20">
            <Title>Academia Experience</Title>
            {acExp.map((item, index) => (
               <Experience 
                  key={index}
                  year={item.year}
                  title={item.title}
                  duration={item.duration}
                  logo={item.logo}
                  details={item.details}
               />
            ))}
         </div>
      </div>
    
   )
}

export default Experiences;