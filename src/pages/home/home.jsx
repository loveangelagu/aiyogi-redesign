import React, { useEffect, useState } from "react";
import backgroundImage from "../../assets/images/homebackground.png"; // Import the image
import Navbar from "./components/navbar";
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
import SearchSoulTribe from './components/searchSoulTribe';
import TTSComponent from "./components/TTSComponent";
import MysticalChat from "./components/MysticalChat";

const Home = () => {

  const [onSelected, setOnSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);


  const { isPending, isError, data: trendingData, error } = useQuery({
    queryKey: ['moduleTending'],
    queryFn: moduleTending,
  })

  // const { data: searchData, error: searchError, refetch } = useQuery({
  //   queryKey: ['search', search],
  //   queryFn: async () => {
  //     const payload = {
  //       searchTerm: search
  //     }
  //     const data = await moduleSearch(payload)
  //     return data
  //   },
  //   enabled: false
  // }
  //   // ["search", searchInput], moduleSearch(searchInput) , {enabled : false}
  // );

  const { data: moduleFeaturedData } = useQuery({
    queryKey: ['moduleFeatured'],
    queryFn: moduleFeatured,
  })

  const onClickItem = (item, questions) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOnSelected(item);
    setSelectedQuestions(questions);
  }

  // const onSearch = () => {
  //   refetch()
  // }


  return (
    <div className="w-full">
      {/* New Mystical Chat Section */}
      <div className="relative w-full">
        <MysticalChat />
      </div>

      {/* Other Components */}
      <div className="text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <Feature />
          <Advantages />
          <NoteVideo />
          <BeginnerPath data={moduleFeaturedData?.data?.modules || []} callback={onClickItem} />
        </div>
      </div>
    </div>
  );
};

export default Home;
