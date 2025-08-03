import { useAnimation } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { createClient } from "@supabase/supabase-js";

// Supabase initialization
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyData = [
  { img: "https://canadiansikhheritage.ca/wp-content/uploads/2017/09/gurus_nanak_dev_small-1.jpg" },
  { img: "https://m.media-amazon.com/images/I/710clkwHFTL.jpg" },
  { img: "https://static.toiimg.com/thumb/msid-116251908,width-400,resizemode-4/116251908.jpg" },
  { img: "https://i0.wp.com/yoga.in/blogs/wp-content/uploads/2018/01/culturalindia-net.jpg?ssl=1" },
];
const dummyQuestion = [
  {
    question: [
      "what is your legacy, lol!?",
      "Do you remember your dreams?",
      "WHO LOVES YA?!"
    ],
    chatPageQuestion: [
      "Ready for a Unicorn? write my exit strategy!",
      "what is your legacy, lol!?",
      "WHO LOVES YA?!",
      "Do you remember your dreams?"
    ]
  },
  {
    question: [
      "What happens when a Kundalini awakening goes wrong?",
      "How can I stay grounded during a kundalini crisis?",
      "How do I navigate the line between madness and enlightenment?"
    ]
  },
  {
    question: [
      "question 3?",
      "question 3?",
      "question 3?"
    ]
  },
  {
    question: [
      "Tell me of how your meditation practice is progressing?",
      "Describe your meditation sessions."
    ]
  }, {
    question: [
      "Superpowers to avoid using, & Shifts in consciousness from cleansing?",
      "Why cleanse and what does it mean?",
      "The Ultimate?"
    ]
  }, {
    question: [
      "question 6?",
      "question 6?",
      "question 6?"
    ]
  }, {
    question: [
      "I see my Ex everywhere!?",
      "I  can let go!",
      "Its so hard help me."
    ]
  }, {
    question: [
      "question 8?",
      "question 8?",
      "question 8?"
    ]
  }, {
    question: [
      "question 9?",
      "question 9?",
      "question 9?"
    ]
  }, {
    question: [
      "question 10?",
      "question 10?",
      "question 10?"
    ]
  }
];

const ScrollingAvatars = ({ carouselId, callback = () => { } }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  const containerRef = useRef(null);
  const [carousel, setCarousel] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Fetch carousel and modules
  useEffect(() => {
    if (!carouselId) {
      setError('No carouselId provided');
      setLoading(false);
      return;
    }

    const fetchModules = async (moduleIds) => {
      if (!moduleIds || !Array.isArray(moduleIds) || moduleIds.length === 0) {
        setModules([]);
        return;
      }
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .in('id', moduleIds);

      if (error) {
        setError(error.message);
        setModules([]);
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
        callback(transformedModules[0], []);
        setActiveIndex(transformedModules[0].id);
        setModules([]);
        setModules(transformedModules);
      }
    };

    const fetchCarousel = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('carousels')
        .select('*')
        .eq('id', carouselId)
        .single();

      if (error) {
        setError(error.message);
        setCarousel(null);
        setLoading(false);
        return;
      }
      setCarousel(data);
      setError(null);
      // Defensive: assume modules as array or JSON string
      let moduleIds = [];
      if (Array.isArray(data.modules)) {
        moduleIds = data.modules;
      } else if (typeof data.modules === 'string') {
        try { moduleIds = JSON.parse(data.modules); } catch { moduleIds = []; }
      }
      await fetchModules(moduleIds);
      setLoading(false);
    };

    fetchCarousel();
  }, [carouselId]);

  const scrollToCenter = (index) => {
    if (containerRef.current) {
      const selectedItem = containerRef.current.children[index];
      if (!selectedItem) return;

      const itemWidth = selectedItem.offsetWidth;
      const itemOffsetLeft = selectedItem.offsetLeft;
      const screenWidth = window.innerWidth;

      // Calculate the scrollLeft to center the selected image
      const scrollLeft = itemOffsetLeft - (screenWidth / 2) + (itemWidth / 2);

      containerRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      setScrollPosition(scrollLeft);
      // setCenterIndex(centerIndex);
    }
  };

  const settings = {
    dots: true,
    infinite: modules.length >= 4,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
    centerPadding: "0",
    autoplay: autoplay,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ]
  };



  // useEffect(() => {
  //   scrollToCenter(centerIndex);
  // }, [centerIndex]);

  // const scrollToCenter = (index) => {
  //   if (containerRef.current) {
  //     const itemWidth = 180 + 16; // item width + margin
  //     const scrollTo = index * itemWidth - (containerWidth / 2 - itemWidth / 2);
  //     containerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
  //   }
  // };

  return (
    <div className="head-slide-lists-wrapper">
      <div className="max-w-7xl mx-auto lg:px-8">
        <div
          ref={containerRef}
          className="head-slide-lists"
        >
          <Slider {...settings}>
            {modules.map((item, index) => {
              const relatedQuestions = dummyQuestion[index] || [];
              // const itemWidth = containerRef?.current?.children[0]?.offsetWidth || 180;
              // const itemOffset = index * (itemWidth + 16);
              // const containerCenter = containerWidth / 2;
              // const distanceFromCenter = Math.abs(
              //   itemOffset - scrollPosition + itemWidth / 2 - containerCenter
              // );

              // const maxScale = 1.2;
              // const minScale = 0.7;
              // const scale = Math.max(
              //   minScale,
              //   maxScale - (distanceFromCenter / containerCenter) * (maxScale - minScale)
              // );

              // const isActive = distanceFromCenter < itemWidth / 2;

              return (

                <div
                  key={index}
                  className={`head-slide-item ${activeIndex === index ? "active-chat" : ""}`}
                  onClick={() => {
                    callback(item, relatedQuestions);
                    setActiveIndex(index);
                    setAutoplay(false);
                  }}
                >
                  <img
                    src={item.posterImageUrl || item.img}
                    alt={`Avatar ${index}`}
                    className={`w-full h-full shadow-2xl shadow-white/90 object-contain`}
                  />

                </div>
              );

            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default ScrollingAvatars;


