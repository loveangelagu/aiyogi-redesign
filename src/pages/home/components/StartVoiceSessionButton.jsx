import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const GPTVoiceAssistant = () => {
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [responseText, setResponseText] = useState("");
    const [processing, setProcessing] = useState(false);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const startVoiceSession = async () => {
        setLoading(true);
        setResponseText("");
        resetTranscript();

        try {
            const res = await fetch("https://aiyogi-backend-api.cto-5ca.workers.dev/public/startVoiceSession", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    moduleId: "070b458f-fc28-403f-84c7-429b8bff1103"
                })
            });

            if (!res.ok) throw new Error("Failed to start voice session");

            const data = await res.json();
            setSessionId(data.sessionId); // Assuming API gives sessionId
            setLoading(false);
            SpeechRecognition.startListening({ continuous: false });
        } catch (err) {
            console.error(err);
            setResponseText("Error: " + err.message);
            setLoading(false);
        }
    };

    const sendTranscriptToGPT = async () => {
        SpeechRecognition.stopListening();
        setProcessing(true);

        try {
            const res = await fetch("https://aiyogi-backend-api.cto-5ca.workers.dev/public/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: sessionId,
                    query: transcript
                })
            });

            const data = await res.json();
            setResponseText(data.response);
            speak(data.response);
        } catch (err) {
            console.error(err);
            setResponseText("Error: " + err.message);
            speak("Something went wrong.");
        } finally {
            setProcessing(false);
            resetTranscript();
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser doesn’t support speech recognition.</p>;
    }

    return (
        <div className="p-6 text-center">
            <button
                onClick={sessionId ? sendTranscriptToGPT : startVoiceSession}
                disabled={loading || processing}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
            >
                {loading
                    ? "Starting..."
                    : processing
                    ? "Thinking..."
                    : sessionId
                    ? "Ask AI"
                    : "Start Assistant"}
            </button>

            <div className="mt-6 max-w-xl mx-auto bg-gray-50 p-4 rounded shadow text-left">
                <p><strong>🎧 Listening:</strong> {listening ? "Yes" : "No"}</p>
                <p className="mt-2"><strong>🗣 You:</strong> {transcript}</p>
                <p className="mt-4"><strong>🤖 GPT:</strong> {responseText}</p>
            </div>
        </div>
    );
};

export default GPTVoiceAssistant;
