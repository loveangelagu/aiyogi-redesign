import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { fetchStreamData, moduleConverseStream } from "../home.api";
import { v7 as uuidv7 } from 'uuid';
import backgroundImage from "../../../assets/images/homebackground.png";
import Navbar from "../components/navbar";
import userAvatar from "../../../assets/images/avatar.png";
import ansvector from "../../../assets/images/ans_vector.png";


const Chat = ({ chatQuestion }) => {
  
  const { state } = useLocation();
  const [input, setInput]= useState('');
  const [streamedData, setStreamedData] = useState('');
  const [fetching, setFetching] = useState(false);
  const [threadId, setThreadId] = useState(uuidv7());
  const [messages, setMessages] = useState([]);
  const scrollableRef = useRef(null);
  const [showQuestions, setShowQuestions] = useState(true); // Track whether to show predefined questions
  const [selectedQuestion, setSelectedQuestion] = useState(''); // Track the selected question
  const { refetch } = useQuery({
    queryKey: ['streamData'],
    queryFn: async () => {
      setFetching(true);

      const payload = {
        moduleId: state.id,
        threadId: threadId,
        message: input,
        stream: true
    };
     const reponse = await fetchStreamData(payload, setStreamedData);
      setFetching(false);
      return reponse;
    },
    enabled: false, // Disable automatic query execution
  });


  const onConverStart = () => {
    // find the last message by id and replace it with the streamed data
    setMessages(prev => [...prev, 
      { type: "question", text: input, id: uuidv7() },
      { type: "answer", text: "", id: uuidv7() },
    ]);
    
    refetch();
  }

  

  useEffect(() => {
    
    if(streamedData && streamedData !== "") {

      // find message with id and replace it with streamed data
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const lastMessageIndex = prev.findIndex(message => message.id === lastMessage.id);
        const updatedMessages = [...prev];
        updatedMessages[lastMessageIndex] = { ...lastMessage, text: streamedData };
        return updatedMessages;
      }); // Update last message

      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
      }
      setInput("");
    }

  }, [streamedData])

  useEffect(() => {
    if (state?.preQuestion) {
      setInput(state.preQuestion);
    }
  }, [state?.preQuestion]);
  useEffect(() => {
    if (input && state?.preQuestion) {
      onConverStart();
    }
  }, [input]);
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question); // Store the selected question
    setShowQuestions(false); // Hide the predefined questions
    // setInput(question); // Set the question as the input value
    onConverStart(question); // Start the conversation
  };

  
  return (<>
  {chatQuestion}
    <div className="bg-themeblack w-full min-h-screen">
    
      {/* Background Image Section */}
      <div
        className="min-h-screen bg-cover bg-center relative flex flex-col justify-center items-center w-full"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Navbar />
        <div className=" mt-3 bg-black/70 backdrop-blur-md w-[90vw] h-[80vh] rounded-xl flex flex-col justify-center items-center">
        
        <Link to="/" className="absolute top-4 left-4 text-white hover:text-gray-300 z-60" ><svg 
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
            </Link >
           <div className="pre-define-question-wrapper">
  {showQuestions && (
    <>
      <button className="pre-define-question-item" onClick={() => handleQuestionClick('Ready for a Unicorn? write my exit strategy!')}>
        Ready for a Unicorn? write my exit strategy!
      </button>
      <button className="pre-define-question-item" onClick={() => handleQuestionClick('what is your legacy, lol!?')}>
        what is your legacy, lol!?
      </button>
      <button className="pre-define-question-item" onClick={() => handleQuestionClick('WHO LOVES YA?!')}>
        WHO LOVES YA?!
      </button>
      <button className="pre-define-question-item" onClick={() => handleQuestionClick('Do you remember your dreams?')}>
        Do you remember your dreams?
      </button>
    </>
  )}
</div>
          <div className="grid md:w-[50%] md:h-[50%] w-[80%] h-[80%]">
          {/* <img src={backgroundImage} alt="Hero Journey" className="mx-auto w-20 h-20 mb-4" /> */}
          {/* <h2 className="text-textwhite text-center text-4xl font-bold mb-6">{state?.name || 'your hero journey'}</h2> */}

          {/* <div class="grid h-64 bg-gray-200 p-4">
  <div>Content Above</div>
  <div class="self-end bg-blue-500 p-4 text-white">Fixed at Bottom</div>
</div> */}
          {/* <div className="grid grid-cols-2 gap-4 mb-20 overflow-y-auto"> */}
          
          <div ref={scrollableRef} className="overflow-y-auto scrollbar-hide">
              {messages.length === 0 ? (
                <p className="text-gray-400 m-auto text-center mt-28">No messages yet...</p>
              ) : (
                messages.map((msg, index) => (
                  <>

                  {/* <img src={msg.type == "question" ? userAvatar: ansvector} className={`absolute ${msg.type == "question" ? 'translate-x-[-40px]': 'translate-x-[-40px] translate-y-3'} border border-yellow-500 text-white w-8 h-8 rounded-full object-cover " alt="User Avatar`} /> */}
                  <div
                    key={msg?.id || index}
                    className={` p-1 ${
                      msg.type === "question"
                        ? "border border-yellow-500 text-yellow-500 rounded-[1vw] self-start" // Question (Left side)
                        : "bg-[#71717914] backdrop-blur-[145px] mt-3 mb-3 text-white self-end rounded-[1vw]" // Answer (Right side)
                    }`}
                  >
                    {msg.text == "" ? (
                        <div class="loader"></div>
                    ) : 
                      msg.text
                    }
                  </div>
                  </>
                ))
              )}
            </div>

          <div className="mt-auto flex justify-evenly p-2">
              <input
                onKeyUp={(e) => {
                  if(e.key === "Enter") {
                    onConverStart();
                  }
                }}
                onChange={(e)=> setInput(e.target.value)}
                type="text"
                value={input || ""}
                placeholder="Enter questions"
                class=" border mr-1 border-yellow-500 bg-transparent grow pl-4 py-1 text-yellow-500 placeholder-yellow-500 placeholder-opacity-40 outline-none rounded-[1vw]"
              />
             <button 
                
                disabled={fetching || input == "" ? true : false }
                onClick={()=> onConverStart()}
                className="bg-white text-black rounded-full hover:bg-gray-200 whitespace-nowrap font-semibold" 
              >
                {fetching ? (
                  <div className="animate-spin border-t-2 border-b-2 border-gray-900 rounded-full w-5 h-5"></div>
                ) : (
                  <div className="flex items-center flex-nowrap gap-2">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-2xl"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path></svg>
                  </div>
              )}
              </button>    

              </div>
          </div>
        </div>
        {/* <div className="bg-black/70 backdrop-blur-md  w-[90vh]">
          <div className=" px-4 sm:px-6 lg:px-8  pb-11">
            <img src={backgroundImage} alt="Hero Journey" className="mx-auto w-20 h-20 mb-4" />
            <h2 className="text-textwhite text-center text-4xl font-bold mb-6">{state?.name || 'your hero journey'}</h2>
            <div className="grid grid-cols-2 gap-4 mb-20 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-400">No messages yet...</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 ${
                      msg.type === "question"
                        ? "border border-yellow-500 text-yellow-500 rounded-[1vw] self-start" // Question (Left side)
                        : "bg-black text-white self-end" // Answer (Right side)
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center flex-nowrap gap-4 mx-auto mb-4">
              <div class="flex items-center bg-transparent border border-yellow-500 text-yellow-500 w-full
              rounded-[1vw] pl-4 pr-2 py-2">
                <div class="shrink-0 select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 16 19" fill="none">
                    <path d="M2.50817 0.877014C2.03449 0.877014 1.58022 1.06518 1.24528 1.40012C0.910335 1.73506 0.722168 2.18934 0.722168 2.66301V16.951C0.722168 17.4247 0.910335 17.879 1.24528 18.2139C1.58022 18.5488 2.03449 18.737 2.50817 18.737H13.2242C13.6978 18.737 14.1521 18.5488 14.4871 18.2139C14.822 17.879 15.0102 17.4247 15.0102 16.951V6.23501L9.65217 0.877014H2.50817ZM2.50817 2.66301H8.75917V7.12801H13.2242V16.951H2.50817V2.66301ZM4.29417 9.80701V11.593H11.4382V9.80701H4.29417ZM4.29417 13.379V15.165H8.75917V13.379H4.29417Z" fill="#F6B60B"/>
                  </svg>
                </div>
                <input
                  onChange={(e)=> setInput(e.target.value)}
                  type="text"
                  value={input || ""}
                  placeholder="Enter questions"
                  class="block bg-transparent grow pl-4 py-1 text-yellow-500 placeholder-yellow-500 placeholder-opacity-40 outline-none rounded-[1vw]"
                />
              </div>
              <button 
                disabled={converseMutation.isPending}
                onClick={()=> onConverStart()}
                className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 whitespace-nowrap font-semibold" 
              >
                {converseMutation.isPending ? (
                  <div className="animate-spin border-t-2 border-b-2 border-gray-900 rounded-full w-5 h-5"></div>
                ) : (
                  <div className="flex items-center flex-nowrap gap-2">
                    Submit
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                    <path d="M0.873291 6.20199V7.98799H11.5893L6.67779 12.8995L7.94585 14.1676L15.0184 7.09499L7.94585 0.0224304L6.67779 1.29049L11.5893 6.20199H0.873291Z" fill="black"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  </>);
};

export default Chat;