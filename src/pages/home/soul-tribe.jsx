import React, { useState } from "react";
import backgroundImage from "../../assets/images/bg.jpg"; // Import the image
// import backgroundImage from "../../assets/images/homebackground.png"; // Import the image
import Navbar2 from "./components/navbar2";
import ScrollingAvatars from "./components/scrollingAvatars";
import Feature from "./components/Feature";
import Advantages from "./components/Advantages";
import NoteVideo from "./components/noteVideo";
import BeginnerPath from "./components/BeginnerPath";
import SoulTribe from "./components/soulTribe";
import StartVoiceSessionButton from "./components/StartVoiceSessionButton";
import { useQuery } from "@tanstack/react-query";
import { moduleTending, moduleFeatured, moduleSearch } from "./home.api";
import DetailModal from "./components/detailmodal";
import { SearchComponent } from "./components/Search";
import SearchSoulTribe2 from './components/SearchSoulTribe2';
import TTSComponent from "./components/TTSComponent";
const Home = () => {

    const [onSelected, setOnSelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);


    const { isPending, isError, data: trendingData, error } = useQuery({
        queryKey: ['moduleTending'],
        queryFn: moduleTending,
    })

    const { data: searchData, error: searchError, refetch } = useQuery({
        queryKey: ['search', search],
        queryFn: async () => {
            const payload = {
                searchTerm: search
            }
            const data = await moduleSearch(payload)
            return data
        },
        enabled: false
    }
        // ["search", searchInput], moduleSearch(searchInput) , {enabled : false}
    );

    const { data: moduleFeaturedData } = useQuery({
        queryKey: ['moduleFeatured'],
        queryFn: moduleFeatured,
    })

    const onClickItem = (item, questions) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setOnSelected(item);
        setSelectedQuestions(questions);
    }


    const onSearch = () => {
        refetch()
    }


    return (
        <div className="bg-themeblack w-full min-h-screen">
            {/* Background Image Section */}
            <div
                className=" bg-cover bg-center relative flex flex-col justify-center items-center h-screen w-full homebanner homebanner2"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <Navbar2 />

                <SearchSoulTribe2 data={onSelected} relatedQuestions={selectedQuestions} />
                {/* <SearchComponent setSearch={setSearch} onclick={onSearch} /> */}
                {/* <ScrollingAvatars data={searchData?.data.modules ? searchData.data.modules : trendingData?.data?.modules || []} callback={onClickItem} /> */}

                {/* <DetailModal isOpen={openModal} onClose={setOpenModal} data={onSelected} relatedQuestions={selectedQuestions} /> */}
            </div>

            {/* Other Components */}
            {/* <div className="text-white">
                <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                    <Feature />
                    <Advantages />
                    <NoteVideo />
                    <BeginnerPath data={moduleFeaturedData?.data?.modules || []} callback={onClickItem} />

                </div>
            </div> */}
        </div>
    );
};

export default Home;