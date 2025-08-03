import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { v7 as uuidv7 } from 'uuid';
import searchIcon from "../../../assets/images/plane-icon.svg";
import soultribeImg from "../../../assets/images/soultribe.jpeg";
import { fetchStreamData, moduleConverseStream } from "../home.api";
const SearchSoulTribe = ({ chatQuestion, data, relatedQuestions }) => {
  
let bannerImage;
let moduleId ;
if (data === null) {
    bannerImage = <img src={soultribeImg} alt="Default Banner" />;
    moduleId = '070b458f-fc28-403f-84c7-429b8bff1103';
} else {
    bannerImage = <img src={data.bannerImageUrl} alt="Banner" />;
    moduleId = data.id
}



    const { state } = useLocation();
    const [input, setInput] = useState('');
    const [streamedData, setStreamedData] = useState('');
    const [fetching, setFetching] = useState(false);
    const [threadId, setThreadId] = useState(uuidv7());
    const [messages, setMessages] = useState([]);
    const scrollableRef = useRef(null);
    const [showQuestions, setShowQuestions] = useState(true); // Track whether to show predefined questions
    const [selectedQuestion, setSelectedQuestion] = useState(''); // Track the selected question
    const [query, setQuery] = useState('');
    const [isActive, setIsActive] = useState(false);
    const { refetch } = useQuery({
        queryKey: ['streamData'],
        queryFn: async () => {
            
            setFetching(true);
            const payload = {
                moduleId: moduleId,
                threadId: threadId,
                message: input,
                stream: true
            };
            const response = await fetchStreamData(payload, setStreamedData);
            setFetching(false);
            return response;
        },
        enabled: false, // Disable automatic query execution
    });
    const onConverStart = () => {
        if (!input.trim()) return;
        setIsActive(true);
        // Add user and answer placeholder
        setMessages(prev => [
            ...prev,
            { type: "question", text: input, id: uuidv7() },
            { type: "answer", text: "", id: uuidv7() },
        ]);

        refetch().then(() => {
            setInput('');
          });
    
    };
    useEffect(() => {

        if (streamedData && streamedData !== "") {

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

        }

    }, [streamedData])
    const onSearch = (value) => {
        setQuery(value);
        
    };
    const handleQuestionClick = (question) => {
        // setInput(question); // Set the question as the input value
        onConverStart(question); // Start the conversation
        
    };
    return (
        
        <div className={`relative   flex items-center justify-center z-10 bannerSearch pt-5  ${isActive ? 'active' : ''}`}>
            <div class="chatname">
            {bannerImage}
                
            </div>
            <div class="predefineQuestion">
                
                <div class="predefineQues-item" onClick={() => handleQuestionClick('what is your legacy, lol!?')}>what is your legacy, lol!?</div>
                <div class="predefineQues-item" onClick={() => handleQuestionClick('Do you remember your dreams?')}>Do you remember your dreams?</div>
                <div class="predefineQues-item" onClick={() => handleQuestionClick('WHO LOVES YA?!')}>WHO LOVES YA?!</div>
            </div>
            <div ref={scrollableRef} className="overflow-y-auto scrollbar-hide chat-anwserScreen">
                {messages.map((msg, index) => (
                    <div
                        key={msg?.id || index}
                        className={`p-1 ${msg.type === "question"
                                ? "border border-yellow-500 text-yellow-500 rounded-[1vw] self-start ques"
                                : "bg-[#71717914] backdrop-blur-[145px] mt-3 mb-3 text-white self-end rounded-[1vw] awn"
                            }`}
                    >
                        {msg.text === "" ? <div className="loader"></div> : msg.text}
                    </div>
                ))}
            </div>
            <div className="relative  p-6 rounded-2xl flex items-center w-full  chatsearchbar">


                <input id="soutribeSearch"
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            onConverStart();
                        }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Type Here"
                    disabled={fetching}
                    value={input}
                    className="flex-1 bg-transparent text-white outline-none placeholder-gray-400 text-lg"
                />
                <button
                    disabled={fetching || input == "" ? true : false}
                    onClick={() => onConverStart()}
                    className="bg-white text-black py-2 px-2 rounded-full hover:bg-gray-100 transition-colors font-medium searchbtn"
                >

                    <span className="hidden sm:block">
                        {fetching ? (
                            <div className="animate-spin border-t-2 border-b-2 border-gray-900 rounded-full w-5 h-5"></div>
                        ) : (
                            <img src={searchIcon} alt="Search Icon" />
                        )}
                    </span>
                </button>
            </div>

        </div>
    );
};
export default SearchSoulTribe;