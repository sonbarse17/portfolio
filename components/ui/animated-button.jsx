export const AnimatedButton = ({ children, onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 no-underline group cursor-pointer relative shadow-lg shadow-gray-200 dark:shadow-gray-800 rounded-full p-px text-sm font-semibold leading-6 inline-block hover:shadow-xl hover:scale-105 transform transition-all duration-300 ${className}`}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(147,51,234,0.6)_0%,rgba(147,51,234,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-white dark:bg-gray-900 py-2 px-6 text-gray-800 dark:text-white transition-all duration-300 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
        <span className="transition-transform duration-300 group-hover:translate-x-1">{children}</span>
        <svg
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-purple-400/0 via-purple-400/90 to-purple-400/0 transition-opacity duration-500 group-hover:opacity-80" />
    </button>
  );
};