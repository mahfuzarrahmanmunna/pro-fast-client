import React from 'react';
import tracking from '../../../assets/illustration/tracking.png';
import safeDelivery from '../../../assets/illustration/safe-delivery.jpg';
import callSupport from '../../../assets/illustration/call-support.png';

const cardData = [
    {
        img: tracking,
        title: "Live Parcel Tracking",
        description:
            "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
    },
    {
        img: safeDelivery,
        title: "100% Safe Delivery",
        description:
            "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    },
    {
        img: callSupport,
        title: "24/7 Call Center Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-12 px-4 md:px-10 lg:px-20 my-12">
            <div className="space-y-6">
                {cardData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm"
                    >
                        <img src={item.img} alt={item.title} className="w-28 h-auto" />
                        <div className="hidden md:block h-24 w-px border-l-2 border-dotted border-gray-300 mx-4"></div>
                        <div className="border-l-2 border-dotted border-gray-300 h-full"></div>
                        <div className="md:pl-6 text-center md:text-left">
                            <h3 className="text-lg md:text-xl font-semibold text-[#03373D]">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;
