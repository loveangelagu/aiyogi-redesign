import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import SoulTribe from './pages/home/soul-tribe';
import Home3 from './pages/home/golden-key';
import Basic from './pages/home/basic';
import StartJourney from './pages/home/start-journey';
import Carousels from './pages/home/carousels';
import NotFound from './pages/notFound/notFound';
import Chat from './pages/home/components/chat';
import React, { useState } from "react";

const AppRoutes = () => {
  // Define the state inside the functional component
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Handle the click event and set selected questions
  const onClickItem = (chatQuestion) => {
    setSelectedQuestions(chatQuestion);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/soul-tribe" element={<SoulTribe />} />
        <Route path="/basic" element={<Basic />} />
        <Route path="/golden-key" element={<Home3 />} />
        <Route path="/start-journey/:carouselId" element={<StartJourney />} />
        <Route path="/carousels" element={<Carousels />} />
        {/* Pass chatQuestion (array) and callback (onClickItem function) to Chat component */}
        <Route path='/chat/:moduleId' element={<Chat chatQuestion={selectedQuestions} callback={onClickItem} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
