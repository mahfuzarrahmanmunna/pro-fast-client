import React from 'react';
import Banner from '../Banner/Banner';
import OurServices from '../Services/OurServices/OurServices';
import ImageMarquee from '../ClientLogo/ImageMarquee';
import WhyChooseUs from '../WhyChoseUs/WhyChoseUs';
import BeMerchant from '../BeMerchant/BeMerchant';

const Home = () => {
    return (
        <div>
            <Banner />
            <OurServices />
            <ImageMarquee />
            <WhyChooseUs />
            <BeMerchant />
        </div>
    );
};

export default Home;