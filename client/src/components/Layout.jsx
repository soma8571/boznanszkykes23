import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout( { content } ) {



  return (
    <div>
        <Header />
        <div className='main'>{content}</div>
        <Footer />
      
    </div>
  );
}

export default Layout;
