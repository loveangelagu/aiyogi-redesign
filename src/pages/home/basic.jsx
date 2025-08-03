import { useState } from "react";
import backgroundImage from "../../assets/images/sj.jpg"; // Import the image
import Navbar2 from "./components/navbar2";
import { useQuery } from "@tanstack/react-query";
import { moduleTending, moduleFeatured, moduleSearch } from "./home.api";
import SearchSoulTribe2 from "./components/SearchSoulTribe2";
import SearchSoulTribe from "./components/SearchSoulTribe3";
import SearchSoulTribe4 from "./components/SearchSoulTribe4";
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
                className="md:bg-cover bg-center relative flex flex-col justify-center items-center h-screen w-full homebanner"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <Navbar2 />

                <SearchSoulTribe4 data={onSelected} relatedQuestions={selectedQuestions} />
            </div>
        </div>
    );
};

export default Home;