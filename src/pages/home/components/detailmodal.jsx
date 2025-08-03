import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DetailModal = ({ isOpen, onClose, data, relatedQuestions }) => {
  const navigate = useNavigate(); 
  const callback = (relatedQuestions) => {
   
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  const chatQuestion = relatedQuestions.chatPageQuestion
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg text-center w-4/5 h-[95vh] transform transition-transform duration-300 ease-out translate-y-10 opacity-0 animate-slide-up relative flex flex-col">
          {/* Back arrow button */}
          <button
            className="absolute top-4 left-4 text-white hover:text-gray-300 z-60"
            onClick={() => onClose(false)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
          </button>
          
          {/* Content container */}
          <div className={`flex-1 flex flex-col overflow-y-hidden hover:overflow-y-auto scrollbar-hide pt-8
            ${data.description.length > 300 ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>
            <div className="flex flex-col h-full">
              {/* Optimized image container */}
              <div className="flex justify-center mb-6">
                <div className="w-[250px] h-[250px] min-w-[250px] min-h-[250px] flex items-center justify-center">
                  <img 
                    src={data.bannerImageUrl} 
                    alt="Modal Image" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
              </div>
              <div class="pre-define-question-wrapper">
              {relatedQuestions.question.map((question, index) => (
                <button  onClick={() => navigate(`/chat/${data.id}`, { state: { ...data, preQuestion: question } })}  class="pre-define-question-item">
                    {question}
                </button>
              ))}
              </div>
              <h2 className="text-xl font-semibold mb-4 text-white">{data.name}</h2>
              <p className="mb-4 px-4 flex-1 text-white">{data.description}</p>
              {/* Sticky Join Button */}
              <div className="sticky bottom-0 bg-gray-800 z-10 pt-3 pb-3">
                <button
                  onClick={() => {
                    navigate(`/chat/${data.id}`, { state: data });
                    callback(chatQuestion);
                  }} className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 font-semibold"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;