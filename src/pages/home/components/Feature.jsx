import feature1 from '../../../assets/images/feature-1.png';

const Feature = () => {
    return (<>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4 pt-20">
            <h2 className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text pb-2 text-center">Features</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="md:w-1/2">
                <img src={feature1} alt="Mobile Preview" className="w-3xl rounded-lg"/>
                {/* <div className="relative">
                    <img src={feature1} alt="Mobile UI" className="w-3xs md:w-3xs" />
                    <div className="absolute inset-0 rounded-full border border-gray-600 animate-pulse"></div>
                </div> */}
            </div>
            <div className="md:w-1/2">
                <h3 className="text-textred uppercase text-sm font-medium tracking-[2px]">Advantages</h3>
                <h2 className="text-textwhite text-4xl font-bold mb-6">Customize According To You</h2>
                <ul>
                    <li className='mb-5'>
                        <h4 className="text-lg text-white font-semibold flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path d="M11 1L9.6985 6.20599C9.44454 7.22185 9.31756 7.72978 9.05308 8.14309C8.81915 8.50868 8.50868 8.81915 8.14309 9.05308C7.72978 9.31756 7.22185 9.44454 6.20599 9.6985L1 11L6.20599 12.3015C7.22185 12.5555 7.72978 12.6824 8.14309 12.9469C8.50868 13.1808 8.81915 13.4913 9.05309 13.8569C9.31756 14.2702 9.44454 14.7782 9.6985 15.794L11 21L12.3015 15.794C12.5555 14.7782 12.6824 14.2702 12.9469 13.8569C13.1808 13.4913 13.4913 13.1808 13.8569 12.9469C14.2702 12.6824 14.7782 12.5555 15.794 12.3015L21 11L15.794 9.6985C14.7782 9.44454 14.2702 9.31756 13.8569 9.05308C13.4913 8.81915 13.1808 8.50868 12.9469 8.14309C12.6824 7.72978 12.5555 7.22185 12.3015 6.20599L11 1Z" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Feature 1
                        </h4>
                        <p className="text-gray-400 text-sm">Cum et convallis risus placerat aliquam, nunc. Scelerisque aliquet faucibus tincidunt eu adipiscing sociis arcu lorem porttitor.</p>
                    </li>
                    <li className='mb-5'>
                        <h4 className="text-lg text-white font-semibold flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                                <path d="M10 1.49999V11M10 11L18.5 6.2777M10 11L1.5 6.2777M10 11V20.5M18.5 15.7222L10.777 11.4317C10.4934 11.2741 10.3516 11.1953 10.2015 11.1645C10.0685 11.1371 9.93146 11.1371 9.79855 11.1645C9.64838 11.1953 9.50658 11.2741 9.22297 11.4317L1.5 15.7222M19 15.0585V6.94144C19 6.5988 19 6.42747 18.9495 6.27468C18.9049 6.1395 18.8318 6.01542 18.7354 5.91073C18.6263 5.79239 18.4766 5.70919 18.177 5.54279L10.777 1.43168C10.4934 1.27412 10.3516 1.19534 10.2015 1.16445C10.0685 1.13712 9.93146 1.13712 9.79855 1.16445C9.64838 1.19534 9.50658 1.27412 9.22297 1.43168L1.82297 5.54279C1.52345 5.70919 1.37369 5.79239 1.26463 5.91073C1.16816 6.01542 1.09515 6.1395 1.05048 6.27468C1 6.42748 1 6.5988 1 6.94144V15.0585C1 15.4012 1 15.5725 1.05048 15.7253C1.09515 15.8605 1.16816 15.9846 1.26463 16.0893C1.37369 16.2076 1.52345 16.2908 1.82297 16.4572L9.22297 20.5683C9.50658 20.7259 9.64838 20.8046 9.79855 20.8355C9.93146 20.8629 10.0685 20.8629 10.2015 20.8355C10.3516 20.8046 10.4934 20.7259 10.777 20.5683L18.177 16.4572C18.4766 16.2908 18.6263 16.2076 18.7354 16.0893C18.8318 15.9846 18.9049 15.8605 18.9495 15.7253C19 15.5725 19 15.4012 19 15.0585Z" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Feature 2
                        </h4>
                        <p className="text-gray-400 text-sm">Cum et convallis risus placerat aliquam, nunc. Scelerisque aliquet faucibus tincidunt eu adipiscing sociis arcu lorem porttitor.</p>
                    </li>
                    <li className='mb-5'>
                        <h4 className="text-lg text-white font-semibold flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M18.5 14H6M6 14V1.5M6 14L1.5 18.5M1.5 6H14M14 6V18.5M14 6L18.5 1.5M19 13.3373V1.8C19 1.51997 19 1.37996 18.9455 1.273C18.8976 1.17892 18.8211 1.10243 18.727 1.0545C18.62 1 18.48 1 18.2 1H6.66274C6.41815 1 6.29586 1 6.18077 1.02763C6.07873 1.05213 5.98119 1.09253 5.89172 1.14736C5.7908 1.2092 5.70432 1.29568 5.53137 1.46863L1.46863 5.53137C1.29568 5.70432 1.2092 5.7908 1.14736 5.89172C1.09253 5.98119 1.05213 6.07873 1.02763 6.18077C1 6.29586 1 6.41815 1 6.66274V18.2C1 18.48 1 18.62 1.0545 18.727C1.10243 18.8211 1.17892 18.8976 1.273 18.9455C1.37996 19 1.51997 19 1.8 19H13.3373C13.5818 19 13.7041 19 13.8192 18.9724C13.9213 18.9479 14.0188 18.9075 14.1083 18.8526C14.2092 18.7908 14.2957 18.7043 14.4686 18.5314L18.5314 14.4686C18.7043 14.2957 18.7908 14.2092 18.8526 14.1083C18.9075 14.0188 18.9479 13.9213 18.9724 13.8192C19 13.7041 19 13.5818 19 13.3373Z" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Feature 3
                        </h4>
                        <p className="text-gray-400 text-sm">Cum et convallis risus placerat aliquam, nunc. Scelerisque aliquet faucibus tincidunt eu adipiscing sociis arcu lorem porttitor.</p>
                    </li>
                </ul>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
            <button className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 text-black px-16 py-4 rounded-full hover:from-yellow-300 hover:to-yellow-500 whitespace-nowrap font-semibold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Try AiYogi
            </button>
        </div>
    </>)
}

export default Feature;