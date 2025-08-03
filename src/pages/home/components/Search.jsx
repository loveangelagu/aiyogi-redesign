import { useState } from "react";
import searchIcon from "../../../assets/images/search_vector.png";

export const SearchComponent = ({ setSearch, onclick }) => {
  const onSearch = (searchValue) => {
    setSearch(searchValue);
  };

  return (
    <div className="relative h-screen  flex items-center justify-center">
      <div className="relative bg-black/80 p-6 rounded-2xl flex items-center w-full min-w-[60vw] max-w-3xl">
        
        
        <input
          onChange={(e) => onSearch(e.target.value)}
          type="text"
          placeholder="Type Here"
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-400 text-lg"
        />
        <button
          onClick={() => onclick()}
          className="bg-white text-black py-2 px-2 rounded-full hover:bg-gray-100 transition-colors font-medium"
        >
          
          <span className="hidden sm:block">Find Answers →</span> {/* Hidden on small screens */}
          <img className="sm:hidden" src={searchIcon}></img>
          
        </button>
      </div>
    </div>
  );
};