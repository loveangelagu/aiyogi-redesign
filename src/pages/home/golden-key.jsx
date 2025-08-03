import React, { useEffect, useState, useCallback } from "react";
import backgroundImage from "../../assets/images/golden-key.jpeg";
import Navbar2 from "./components/navbar2";
import ScrollingAvatars from "./components/scrollingAvatars";
import SearchSoulTribe2 from './components/SearchSoulTribe2';
import { useQuery } from "@tanstack/react-query";
import { moduleTending, moduleFeatured, moduleSearch } from "./home.api";
import { useNavigate, useParams } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

// Supabase initialization
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Home = () => {

    // State definitions
    const [selectedItem, setSelectedItem] = useState(null);
    const [relatedQuestions, setRelatedQuestions] = useState([]);

    // Queries (ready for future enhancements)
    useQuery({ queryKey: ['moduleTending'], queryFn: moduleTending });
    useQuery({ queryKey: ['moduleFeatured'], queryFn: moduleFeatured });
    const navigate = useNavigate();

    // Item click handler
    const handleItemClick = useCallback((item, questions) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log(item);
        setSelectedItem(item);
        setRelatedQuestions(questions);
    }, []);

    // // Loading and error feedback
    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen bg-themeblack text-white text-xl">
    //             Loading...
    //         </div>
    //     );
    // }
    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen bg-themeblack text-red-500 text-xl">
    //             Error: {error}
    //         </div>
    //     );
    // }

    // Main content
    return (
        <>
            <div className="bg-themeblack w-full min-h-screen">
                {/* Banner with background */}
                <div
                    className="bg-contain sm:bg-cover relative flex flex-col justify-center items-center mb-20 w-full homebanner pt-[13px]"
                // style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat' }}
                >
                    <Navbar2 />

                    <SearchSoulTribe2
                        fontClass="text-26"
                        data={selectedItem}
                        relatedQuestions={relatedQuestions}
                        defaultDataId={false}
                    />

                    <ScrollingAvatars
                        carouselId={'153714af-4a4d-4d6e-900c-9aae53206523'}
                        callback={handleItemClick}
                    />
                </div>
            </div >
        </>
    );
};

export default Home;
