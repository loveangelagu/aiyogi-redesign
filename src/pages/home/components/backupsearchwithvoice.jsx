import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { v7 as uuidv7 } from 'uuid';
import searchIcon from "../../../assets/images/plane-icon.svg";
import soultribeImg from "../../../assets/images/soultribe.jpeg";
import { fetchStreamData } from "../home.api";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SearchSoulTribe = ({ chatQuestion, data, relatedQuestions }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

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

  let bannerImage;
  let moduleId;
  if (data === null) {
    bannerImage = <img src={soultribeImg} alt="Default Banner" />;
    moduleId = '070b458f-fc28-403f-84c7-429b8bff1103';
  } else {
    bannerImage = <img src={data.bannerImageUrl} alt="Banner" />;
    moduleId = data.id;
  }

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
      onConverStart(transcript); // ✅ use transcript directly
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
  
      // ✅ Speak only if last message came from voice
      if (lastSentByVoice) {
        const timeoutId = setTimeout(() => {
          speakResponse(streamedData);
          setLastSentByVoice(false); // reset the flag
        }, 1000);
  
        return () => clearTimeout(timeoutId);
      }
    }
  }, [streamedData]);
  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
  
    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
  
      // Try to select a more expressive female voice
      const femaleVoice = voices.find(
        (v) =>
          v.lang === "en-US" &&
          (v.name.toLowerCase().includes("female") ||
           v.name.toLowerCase().includes("zira") || // Microsoft
           v.name.toLowerCase().includes("samantha") || // macOS
           v.name.toLowerCase().includes("google us english"))
      );
  
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
  
      // Add emotional effect via pitch and rate
      utterance.pitch = 15;   // Higher pitch for more emotion
      utterance.rate = 0.90;   // Slightly slower for more drama
      utterance.volume = 1;
  
      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
  
      window.speechSynthesis.speak(utterance);
    };
  
    if (window.speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = speak;
    }
  };

  useEffect(() => {
    // Listen for changes in transcript and handle sending the message when done
    if (!listening && transcript.trim() && transcript.trim() !== input.trim()) {
      setInput(transcript); // Set the transcribed input
      setTimeout(() => {
       // onConverStart(); // Automatically trigger conversation start
        resetTranscript(); // Reset the transcript after message is sent
      }, 1000); // Slight delay to ensure that speech ends
    }
    
  }, [listening, transcript]);

  const handleVoiceToggle = () => {
  if (listening) {
    SpeechRecognition.stopListening();
  } else {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });

    // Preload voices (helps Safari)
    window.speechSynthesis.getVoices(); // triggers onvoiceschanged
  }
};

  const handleQuestionClick = (question) => {
    // setInput(question); // Set the question as the input value
    onConverStart(question); // Start the conversation
  };

  return (
    <div className={`relative flex items-center justify-center z-10 bannerSearch pt-5 ${isActive ? 'active' : ''}`}>
      <div className="chatname">
        {bannerImage}
      </div>
      <div className="predefineQuestion">
        <div className="predefineQues-item" onClick={() => handleQuestionClick('what is your legacy, lol!?')}>what is your legacy, lol!?</div>
        <div className="predefineQues-item" onClick={() => handleQuestionClick('Do you remember your dreams?')}>Do you remember your dreams?</div>
        <div className="predefineQues-item" onClick={() => handleQuestionClick('WHO LOVES YA?!')}>WHO LOVES YA?!</div>
      </div>
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
          placeholder="Type Here"
          disabled={fetching}
          value={input}
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-400 text-lg"
        />
       
       {!isSpeaking ? (
  <button
    type="button"
    onClick={handleVoiceToggle}
    className={`ml-2 p-2 rounded-full ${listening ? 'bg-green-500' : 'bg-white'} text-black`}
  >
    🎤
  </button>
) : (
  <button
    onClick={() => {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }}
    className="ml-2 p-2 rounded-full bg-red-500 text-white"
  >
    ⏹️
  </button>
)}
        <button
          disabled={fetching || input === "" ? true : false}
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
  );
};

export default SearchSoulTribe;
