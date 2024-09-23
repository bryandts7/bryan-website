import React from 'react';

function Title({ children, id }: any) {
   return (
      <h1
         id={id && id}
         className="text-2xl font-bold  underline-offset-8 decoration-4 mb-5 text-stone-900 dark:text-black"
      >
         {children}
      </h1>
   )
}

export default Title;