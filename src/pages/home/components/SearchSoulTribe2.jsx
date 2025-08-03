import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v7 as uuidv7 } from 'uuid';
import searchIcon from "../../../assets/images/plane-icon.svg";
import yogaImg from "../../../assets/images/yoga.png";
import soultribeImg from "../../../assets/images/imgpsh_fullsize.jpg";
import { fetchStreamData } from "../home.api";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SearchSoulTribe2 = ({ chatQuestion, data, relatedQuestions, defaultDataId = true, fontClass = "" }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [streamedData, setStreamedData] = useState('');
    const [fetching, setFetching] = useState(false);
    const [threadId, setThreadId] = useState(uuidv7());
    const [messages, setMessages] = useState([]);
    const scrollableRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [streamedChunks, setStreamedChunks] = useState([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastSentByVoice, setLastSentByVoice] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const description = data?.shortDescription;

    let bannerImage;
    let moduleId;
    if (data === null) {
        bannerImage = <img src={soultribeImg} alt="Default Banner" className="rounded-lg" />;
        moduleId = '070b458f-fc28-403f-84c7-429b8bff1103';
    } else {
        bannerImage = <img src={data.bannerImageUrl} alt="Banner" className="rounded-lg" />;
        moduleId = data.id;
    }

    const { refetch } = useQuery({
        queryKey: ['streamData'],
        queryFn: async () => {
            // setFetching(true);
            // const response = await fetchConvDataGrok(input, setStreamedData);
            // setFetching(false);
            // return response;


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
        enabled: false,
    });

    const onConverStart = (customInput = null) => {
        const messageToSend = customInput ?? input;
        if (!messageToSend.trim()) return;

        setIsActive(true);
        setMessages(prev => [
            ...prev,
            { type: "question", text: messageToSend, id: uuidv7() },
            { type: "answer", text: "", id: uuidv7() },
        ]);
        refetch().then(() => {
            setInput('');
        });
    };

    useEffect(() => {
        if (!listening && transcript.trim()) {
            setLastSentByVoice(true);
            onConverStart(transcript);
            resetTranscript();
        }
    }, [listening, transcript]);

    useEffect(() => {
        if (streamedData && streamedData !== "") {
            setMessages((prev) => {
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    text: streamedData,
                };
                return updatedMessages;
            });

            if (scrollableRef.current) {
                scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
            }

            if (lastSentByVoice) {
                const timeoutId = setTimeout(() => {
                    speakResponse(streamedData);
                    setLastSentByVoice(false);
                }, 1000);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [streamedData]);

    // 🔥 Updated speakResponse function (uses OpenAI TTS)
    const speakResponse = async (text) => {
        try {
            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "tts-1", // correct model
                    input: text,
                    voice: "coral"
                }),
            });

            if (!response.ok) {
                throw new Error('TTS API request failed');
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            const audio = new Audio(audioUrl);
            audio.play();
            setIsSpeaking(true);

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl); // cleanup
            };
        } catch (error) {
            console.error('Error during TTS:', error);
            setIsSpeaking(false);
        }
    };
    // console.log(data);

    const handleVoiceToggle = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: false });
        }
    };

    const handleQuestionClick = (question) => {
        // setInput(question);
        onConverStart(question);
    };

    return (
        <>
            <div className={`relative flex items-center justify-center z-10 bannerSearch pt-5 md:mt-40 mt-20 ${isActive ? 'active' : ''}`}>
                {/* <div className="flex justify-center text-center text-white w-full mb-2">
                    <p className="flex items-center">You practiced <img src={yogaImg} className="h-5 mx-1" /> and prayed 🙏 alone.</p>
                </div>
                <div className="flex justify-center text-center text-white w-full mb-2">
                    <p>Now step into the tribe that heard you.</p>
                </div> */}
                {isActive ?
                    <BannerImg
                        bannerImage={bannerImage}
                    />
                    :
                    <>
                        <p className={`predefineQuestion description lg:mb-20 mb-10 ${fontClass}`}>{description}</p>
                        <BannerImg
                            bannerImage={bannerImage}
                        />
                        {data?.iceBreakers &&
                            <div className="predefineQuestion">
                                {data?.iceBreakers.map((starter, index) => (
                                    <div className="predefineQues-item" onClick={() => handleQuestionClick(starter)}>{starter}</div>
                                ))}
                            </div>
                        }
                    </>
                }
                <div ref={scrollableRef} className="overflow-y-auto scrollbar-hide chat-anwserScreen">
                    {messages.map((msg, index) => (
                        <div
                            key={msg?.id || index}
                            className={`p-1 ${msg.type === "question" ? "border border-yellow-500 text-yellow-500 rounded-[1vw] self-start ques" : "bg-[#71717914] backdrop-blur-[145px] mt-3 mb-3 text-white self-end rounded-[1vw] awn"}`}
                        >
                            {msg.text === "" ? <div className="loader"></div> : msg.text}
                        </div>
                    ))}
                </div>
                <div className="relative p-6 rounded-2xl flex items-center w-full chatsearchbar">
                    <input
                        id="soutribeSearch"
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                onConverStart();
                            }
                        }}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="How is your practice?"
                        disabled={fetching}
                        value={input}
                        className="flex-1 bg-transparent text-white outline-none placeholder-gray-400 text-lg"
                    />
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)} // Open the popup
                        className={`ml-2 p-2 rounded-full  ${listening ? 'bg-green-500' : 'bg-white'} text-black`}
                    >
                        🎤
                    </button>
                    <button
                        disabled={fetching || input === ""}
                        onClick={() => onConverStart()}
                        className="bg-white text-black py-2 px-2 rounded-full hover:bg-gray-100 transition-colors font-medium searchbtn"
                    >
                        {fetching ? (
                            <div className="animate-spin border-t-2 border-b-2 border-gray-900 rounded-full w-5 h-5"></div>
                        ) : (
                            <img src={searchIcon} alt="Search Icon" />
                        )}
                    </button>
                </div>


                <div className="flex items-center justify-center items-center w-full mb-8">
                    <div className="w-100 flex justify-center items-center cursor-pointer">
                        <div className="relative group">
                            <div className="mr-2 text-3xl animate-spin-pause">
                                🔑
                            </div>
                            {/* <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark text-white text-sm rounded py-1 px-2 w-40 text-center">
                                STOP PLAYING AND ENTER THE CODE "initiation"
                            </div> */}
                        </div>
                        <div>
                            <input type="text" id="msg" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="ml-2">
                            <button
                                type="button"
                                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                onClick={() => {
                                    const msg = document.getElementById('msg').value;
                                    if (msg.toLowerCase() === 'cave') {
                                        // navigate('/');
                                        window.open('https://aiyogi-b7adf.web.app/start-journey/b9a7a66a-d599-4f5f-a632-6c9d4181724a', '_blank');
                                    }
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Feature is Premium
                        </h2>
                        <p className="text-gray-700 mb-6">
                            This feature is part of our premium plan. Upgrade your subscription to unlock all premium features and enjoy exclusive benefits.
                        </p>
                        <button
                            onClick={() => setIsOpen(false)} // Corrected to use a function reference
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                            aria-label="Close popup"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )
            }
        </>
    );
};

function BannerImg({ bannerImage }) {
    if (!bannerImage) {
        return null;
    }
    return <div className="flex justify-center text-center w-full">
        <div className="w-40 mb-2">
            {bannerImage}
        </div>
    </div>;
}

export default SearchSoulTribe2;
