import React, { useEffect, useRef } from 'react';

const TwinklingStars = () => {
  const starsRef = useRef(null);

  useEffect(() => {
    const createStars = () => {
      const starsContainer = starsRef.current;
      if (!starsContainer) return;

      // Clear existing stars
      starsContainer.innerHTML = '';
      
      const numStars = 80; // Reduced for better performance
      
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (3 + Math.random() * 2) + 's'; // Slower animation for better performance
        starsContainer.appendChild(star);
      }
    };

    createStars();

    // Recreate stars on window resize
    const handleResize = () => {
      createStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div className="stars" ref={starsRef}></div>;
};

export default TwinklingStars; 