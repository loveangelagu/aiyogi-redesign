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
    const description = data?.description;

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
            <div className={`relative flex items-center justify-center z-10 bannerSearch pt-5 ${isActive ? 'active' : ''}`}>
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
            </div>
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
