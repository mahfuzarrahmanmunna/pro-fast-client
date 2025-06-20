import React from 'react';

const ServiceCard = ({ icon: Icon, title, description }) => {
    return (
        <div
            className="group bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-transparent hover:border-[#CAEB66] hover:bg-[#CAEB66] transition duration-300 text-center"
        >
            {/* Icon Circle with gradient */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-green-400 group-hover:from-yellow-300 group-hover:to-green-300 flex items-center justify-center mb-4 transition-all duration-500">
                <Icon className="text-white text-2xl" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-gray-900 transition duration-300">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 transition duration-300">
                {description}
            </p>
        </div>
    );
};

export default ServiceCard;
