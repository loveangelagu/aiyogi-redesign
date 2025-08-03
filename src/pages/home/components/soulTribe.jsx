import React, { useState, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; 
const BeginnerPath = ({ data, callback }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      setScrollPosition(scrollLeft);
    }
  };
  const dummyQuestion = [
    { question: [
      "what is your legacy, lol!?",
      "Do you remember your dreams?",
      "WHO LOVES YA?!"
    ] },
    { question: [
      "What happens when a Kundalini awakening goes wrong?",
      "How can I stay grounded during a kundalini crisis?",
      "How do I navigate the line between madness and enlightenment?"
    ] },
    { question: [
      "question 3?",
      "question 3?",
      "question 3?"
    ] },
    { question: [
      "Tell me of how your meditation practice is progressing?",
      "Describe your meditation sessions."
    ] },{ question: [
      "Superpowers to avoid using, & Shifts in consciousness from cleansing?",
      "Why cleanse and what does it mean?",
      "The Ultimate?"
    ] },{ question: [
      "question 6?",
      "question 6?",
      "question 6?"
    ] },{ question: [
      "I see my Ex everywhere!?",
      "I  can let go!",
      "Its so hard help me."
    ] },{ question: [
      "question 8?",
      "question 8?",
      "question 8?"
    ] },{ question: [
      "question 9?",
      "question 9?",
      "question 9?"
    ] },{ question: [
      "question 10?",
      "question 10?",
      "question 10?"
    ] }
  ];
  const settings = {
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 7,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    centerPadding: "0",
    autoplay: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "30",
        }
      }
    ]
  };

  return (
    <>
      <p className="text-textwhite text-center m-2 font-bold">BEGINNER'S PATH</p>
      <div className="bottom-0 left-0 right-0 overflow-x-auto relative">
        <div
          ref={containerRef}
          className="head-slide-lists"
          onScroll={handleScroll}
        >
          <Slider {...settings}>
          {data.map((item, index) => {
             const relatedQuestions = dummyQuestion[index] || [];
            // if (!item?.bannerImageUrl) return null;

            // // Calculate the item's position relative to the center
            // const itemWidth = 160; // Adjust based on your item's width (w-40 = 160px)
            // const itemOffset = index * (itemWidth + 16); // 16px is the margin (m-2 = 8px on each side)
            // const containerCenter = (containerRef.current?.clientWidth || 0) / 2;
            // const distanceFromCenter = Math.abs(
            //   itemOffset - scrollPosition + itemWidth / 2 - containerCenter
            // );

            // // Calculate scale based on distance from center
            // const maxScale = 1.2; // Maximum scale for the center item
            // const minScale = 0.8; // Minimum scale for the side items
            // const scale = Math.max(
            //   minScale,
            //   maxScale - (distanceFromCenter / containerCenter) * (maxScale - minScale)
            // );

            return (
              <div
                key={index}
                className="head-slide-item"
                onClick={() => callback(item, relatedQuestions)}
              >
                <img
                  src={item.bannerImageUrl}
                  alt={`Avatar ${index}`}
                  className="w-full h-full object-cover rounded-lg shadow-2xl shadow-white/90"
                />
              </div>
            );
          })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default BeginnerPath;