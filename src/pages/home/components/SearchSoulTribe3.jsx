import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { v7 as uuidv7 } from 'uuid';
import searchIcon from "../../../assets/images/plane-icon.svg";
import soultribeImg from "../../../assets/images/media.jpg";
import { fetchStreamData } from "../home.api";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { createClient } from "@supabase/supabase-js";

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
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const [carouselId, setCarouselId] = useState("153714af-4a4d-4d6e-900c-9aae53206523");
  const [modules, setModules] = useState([]);

  let bannerImage;
  let moduleId;
  if (data === null) {
    bannerImage = <img src={soultribeImg} alt="Default Banner" />;
    moduleId = '070b458f-fc28-403f-84c7-429b8bff1103';
  } else {
    bannerImage = <img src={data.posterImageUrl} alt="Banner" />;
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
    useEffect(() => {
      if (!carouselId) {
        return;
      }
  
      const fetchModules = async (moduleIds) => {
        if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
          return;
        }
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .in('id', moduleIds);
  
        if (error) {
            return
        } else {
          const transformedModules = data?.map(item => ({
            CreatedAt: item.created_at,
            bannerImageUrl: item.banner_image_url,
            description: item.description,
            id: item.id,
            isActive: item.is_active,
            name: item.name,
            posterImageUrl: item.poster_image_url,
            shortDescription: item.short_description,
            iceBreakers: item.ice_breakers,
          })) || [];
          // setActiveIndex(index);        
        //   callback(transformedModules[0], []);
        //   setActiveIndex(transformedModules[0].id);
          setModules(transformedModules[0].iceBreakers);
        }
      };
  
      const fetchCarousel = async () => {
        const { data, error } = await supabase
          .from('carousels')
          .select('*')
          .eq('id', carouselId)
          .single();
  
        if (error) {
          return;
        }
        // Defensive: assume modules as array or JSON string
        let moduleIds = [];
        if (Array.isArray(data.modules)) {
          moduleIds = data.modules;
        } else if (typeof data.modules === 'string') {
          try { moduleIds = JSON.parse(data.modules); } catch { moduleIds = []; }
        }
        await fetchModules(moduleIds);
      };
  
      fetchCarousel();
    }, [carouselId]);

  return (
    <div style={{marginTop: "10rem"}} className={`relative flex items-center justify-center z-10 bannerSearch pt-2 ${isActive ? 'active' : ''} mt-20`}>
      <div className="chatname mb-2">
        {bannerImage}
      </div>
      <div className="predefineQuestion">
        {modules.map((item, key) => 
            <div className="predefineQues-item" key={key} onClick={() => handleQuestionClick(item)}>{item}</div>
        )}
        {/* <div className="predefineQues-item" onClick={() => handleQuestionClick('what is your legacy, lol!?')}>what is your legacy, lol!?</div>
        <div className="predefineQues-item" onClick={() => handleQuestionClick('Do you remember your dreams?')}>Do you remember your dreams?</div>
        <div className="predefineQues-item" onClick={() => handleQuestionClick('WHO LOVES YA?!')}>WHO LOVES YA?!</div> */}
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
            className={`ml-2 p-2 rounded-full hidden  ${listening ? 'bg-green-500' : 'bg-white'} text-black`}
          >
            🎤
          </button>
        ) : (
          <button
            onClick={() => setIsSpeaking(false)}
            className="ml-2 p-2 rounded-full bg-red-500 text-white"
          >
            ⏹️
          </button>
        )}

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
  );
};

export default SearchSoulTribe;
