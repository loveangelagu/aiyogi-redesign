import React, { useState } from "react";

const TTSComponent = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakResponse = async (inputText) => {
    try {
      setIsSpeaking(true);

      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const url = "https://api.openai.com/v1/audio/speech";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts", // or "tts-1-hd"
          voice: "nova", // coral, nova, shimmer, etc.
          input: inputText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error("Error in TTS:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="tts-component">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
        rows="4"
        cols="50"
      />
      <div>
        <button
          onClick={() => speakResponse(text)}
          disabled={isSpeaking}
          className="speak-btn"
        >
          {isSpeaking ? "Speaking..." : "Speak"}
        </button>
      </div>
    </div>
  );
};

export default TTSComponent;
