const Footer = () => {
  return (
    <footer className="bg-[#032541] text-white mt-10 px-6 py-8">
      
      <div className="flex flex-col md:flex-row justify-between gap-8">
        
      
        <div>
          <h2 className="text-green-400 text-xl font-bold">TMDB</h2>
          <p className="text-gray-300 text-sm mt-1">
            Your movie & TV guide
          </p>
        </div>

        <div>
          <p className="font-semibold mb-2">Explore</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li className="hover:text-white cursor-pointer">Movies</li>
            <li className="hover:text-white cursor-pointer">TV Shows</li>
            <li className="hover:text-white cursor-pointer">People</li>
          </ul>
        </div>

     
        <div>
          <p className="font-semibold mb-2">About</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TMDB Clone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;