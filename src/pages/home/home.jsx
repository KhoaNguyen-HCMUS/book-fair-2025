import React, { useEffect, useState } from 'react';
import HomePage from '/HomePage.png';
import './home.scss';

const Home = () => {
  const [trail, setTrail] = useState(Array.from({ length: 10 }, () => ({ x: 0, y: 0 })));

  // Cập nhật vị trí chuột và tạo hiệu ứng đuôi sao băng
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setTrail((prevTrail) => {
        const newTrail = [...prevTrail];
        newTrail.unshift({ x: clientX, y: clientY });
        newTrail.pop();
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {trail.map((pos, index) => (
        <React.Fragment key={index}>
          <div
            className='trail-shadow'
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              opacity: (1 - index / trail.length) * 0.5,
            }}
          />
          {/* Đuôi sáng phía trên */}
          <div
            className='trail'
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              opacity: 1 - index / trail.length,
            }}
          />
        </React.Fragment>
      ))}

      <div
        className='home'
        style={{
          backgroundImage: `url(${HomePage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {/* Nội dung của bạn ở đây */}
      </div>
    </>
  );
};

export default Home;
