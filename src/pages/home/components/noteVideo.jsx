
const NoteVideo = () => {
    return (<>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4 pt-20">
            <div className="p-8 relative">
                {/* Enhanced magical glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 rounded-lg opacity-20 blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                
                {/* Video with enhanced shadow */}
                <div className="relative inline-block">
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/4LwszQ7208k?si=llz0T9u8zGupAyU1" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="rounded-lg shadow-2xl"
                    ></iframe>
                </div>
                
                {/* Magical golden stars - balanced corners */}
                <div className="absolute -top-2 -left-2 text-yellow-400 text-3xl animate-pulse">⭐</div>
                <div className="absolute -top-2 -right-2 text-yellow-400 text-3xl animate-pulse" style={{animationDelay: '0.5s'}}>⭐</div>
                <div className="absolute -bottom-2 -left-2 text-yellow-400 text-3xl animate-pulse" style={{animationDelay: '1s'}}>⭐</div>
                <div className="absolute -bottom-2 -right-2 text-yellow-400 text-3xl animate-pulse" style={{animationDelay: '1.5s'}}>⭐</div>
                
                {/* Balanced sparkles */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xl animate-bounce">✨</div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xl animate-bounce" style={{animationDelay: '0.3s'}}>✨</div>
                
                {/* Messy art school dizzy stars */}
                <div className="absolute -top-6 right-1/3 text-purple-300 text-lg animate-pulse" style={{animationDelay: '0.8s'}}>💫</div>
                <div className="absolute -bottom-4 left-1/4 text-purple-300 text-lg animate-pulse" style={{animationDelay: '0.4s'}}>💫</div>
                <div className="absolute top-1/2 -left-6 text-purple-300 text-lg animate-pulse" style={{animationDelay: '0.6s'}}>💫</div>
                <div className="absolute top-1/2 -right-6 text-purple-300 text-lg animate-pulse" style={{animationDelay: '1.2s'}}>💫</div>
            </div>
        </div>
    </>)
}

export default NoteVideo;