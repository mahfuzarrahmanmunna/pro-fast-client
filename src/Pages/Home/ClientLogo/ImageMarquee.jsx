import React from 'react';
import Marquee from 'react-fast-marquee';

import amazon from '../../../assets/brands/amazon.png';
import amazon_vector from '../../../assets/brands/amazon_vector.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import start from '../../../assets/brands/start.png';
import start_people from '../../../assets/brands/start-people 1.png';

const images = [
    amazon, amazon_vector, casio, moonstar, randstad, start, start_people
];

const ImageMarquee = () => {
    return (
        <div className="bg-white py-6">
            <h2 className="text-center text-[#03373D] text-2xl font-semibold mb-6">
                We've helped thousands of sales teams
            </h2>

            <Marquee pauseOnHover={true} speed={50} gradient={false}>
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`brand-${index}`}
                        className="h-[24px] w-auto mx-24 object-contain"
                    />
                ))}
            </Marquee>
        </div>
    );
};

export default ImageMarquee;
