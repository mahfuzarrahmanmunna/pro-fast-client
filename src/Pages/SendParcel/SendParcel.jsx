import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth/useAuth';


const generateTrackingId = (prefix = 'TRK', region = 'GEN') => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // e.g., "20250624"
    const random = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${prefix}-${region.toUpperCase().slice(0, 3)}-${dateStr}-${random}`;
};


const SendParcel = () => {
    const { user } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [type, setType] = useState('document');
    const [warehouses, setWarehouses] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);
    const [senderCenters, setSenderCenters] = useState([]);
    const [receiverCenters, setReceiverCenters] = useState([]);
    const [calculatedCost, setCalculatedCost] = useState(0);
    // const [showConfirm, setShowConfirm] = useState(false);
    const [parcelData, setParcelData] = useState(null);
    // console.log(warehouses);

    const senderRegion = watch('senderRegion');
    const receiverRegion = watch('receiverRegion');

    // ✅ Load warehouse.json correctly
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axios.get('./warehouses.json'); // ✅ adjust path if needed
                setWarehouses(response.data);
                // console.log(response);

                // Extract unique region names
                const regions = [...new Set(response.data.map(w => w.region))];
                setRegionOptions(regions);
            } catch (error) {
                toast.error("Failed to load warehouse data", error.message);
            }
        };

        fetchWarehouses();
    }, []);

    // 🧠 Filter sender centers
    useEffect(() => {
        if (senderRegion && warehouses.length > 0) {
            const centers = warehouses
                .filter(w => w.region === senderRegion)
                .map(w => w.district); // or w.centers if available
            setSenderCenters([...new Set(centers)]);
        }
    }, [senderRegion, warehouses]);

    // 🧠 Filter receiver centers
    useEffect(() => {
        if (receiverRegion && warehouses.length > 0) {
            const centers = warehouses
                .filter(w => w.region === receiverRegion)
                .map(w => w.district); // or w.centers if available
            setReceiverCenters([...new Set(centers)]);
        }
    }, [receiverRegion, warehouses]);


    const onSubmit = (data) => {
        const weight = parseFloat(data.weight) || 0;
        const sameCity = data.senderCenter === data.receiverCenter;
        const trackingId = generateTrackingId('TRK', data.senderRegion);

        let cost = 0;
        let basePrice = 0;
        let extraCost = 0;
        let outsideExtra = 0;



        const isDocument = type === 'document';

        if (isDocument) {
            basePrice = sameCity ? 60 : 80;
            cost = basePrice;
        } else {
            if (weight <= 3) {
                basePrice = sameCity ? 110 : 150;
                cost = basePrice;
            } else {
                const extraKg = weight - 3;
                extraCost = extraKg * 40;
                basePrice = sameCity ? 110 : 150;
                outsideExtra = sameCity ? 0 : 40;
                cost = basePrice + extraCost + outsideExtra;
            }
        }

        const fullData = {
            ...data,
            type,
            cost,
            creation_date: new Date(),
            creator_email: user?.email,
            creator_name: user?.displayName,
            payment_status: 'unpaid',
            delivery_status: 'not_collected',
            trackingId,
        };
        setParcelData(fullData);
        setCalculatedCost(cost);
        console.log(fullData);

        // save data to the server

        Swal.fire({
            title: `<div class="text-xl font-bold">Estimated Delivery Cost</div>`,
            html: `
              <div class="text-left text-[15px]">
                <p class="mb-2">
                  This delivery charge is calculated based on parcel type, delivery distance, and weight. 
                  Our goal is to keep pricing fair and transparent while ensuring timely service.
                </p>
          
                <div class="divider my-2">Pricing Breakdown</div>
          
                <ul class="space-y-1 mb-2">
                  <li><span class="font-medium">Parcel Type:</span> ${type === 'document' ? 'Document' : 'Non-Document'}</li>
                  <li><span class="font-medium">Delivery:</span> ${sameCity ? 'Within City' : 'Outside City/District'}</li>
                  <li><span class="font-medium">Base Price:</span> ৳${basePrice}</li>
                  ${!isDocument && weight > 3 ? `<li><span class="font-medium">Extra Weight Charge:</span> ৳${extraCost} (${weight - 3}kg × ৳40)</li>` : ''}
                  ${!isDocument && weight > 3 && !sameCity ? `<li><span class="font-medium">Outside City Extra:</span> ৳${outsideExtra}</li>` : ''}
                </ul>
          
                <div class="divider my-2"></div>
          
                <div class="text-lg font-bold text-center text-green-700">
                  Total Payable: ৳${cost}
                </div>
              </div>
            `,
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: '✅ Proceed to Payment',
            cancelButtonText: '✏️ Edit Details',
            confirmButtonColor: '#CAEB66',
            cancelButtonColor: '#d1d5db',
            background: '#ffffff',
            customClass: {
                popup: 'text-[16px] px-6 py-5 rounded-lg shadow-lg',
                confirmButton: 'btn btn-success px-4 py-2',
                cancelButton: 'btn px-4 py-2',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/parcels`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fullData),
                    });

                    if (res.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: '✅ Parcel Confirmed!',
                            text: 'Your parcel has been saved and is ready for processing.',
                            confirmButtonColor: '#CAEB66'
                        });
                    } else {
                        throw new Error('Failed to save data');
                    }
                } catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Saving Failed',
                        text: 'There was an error saving the parcel. Try again later.',
                        confirmButtonColor: '#CAEB66'
                    });
                }
            }
        });
    };

    // const confirmBooking = async (dataToSave) => {
    //     try {
    //         await fetch(`${import.meta.env.VITE_API_URL}/parcels`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(dataToSave),
    //         });
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Parcel confirmed & saved!',
    //             confirmButtonColor: '#CAEB66'
    //         });
    //     } catch (err) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error saving parcel',
    //             confirmButtonColor: '#CAEB66'
    //         });
    //     }
    // };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-4 md:mx-auto p-6 border rounded-lg shadow space-y-6">
            <h2 className="text-3xl font-bold border-b pb-2 border-dotted">Add Parcel</h2>
            <p className="text-lg font-medium">Enter your parcel details</p>

            <div className="flex items-center gap-6">
                <label className="label gap-2 cursor-pointer">
                    <input type="radio" value="document" checked={type === 'document'} onChange={() => setType('document')} className="radio text-primary" />
                    <span>Document</span>
                </label>
                <label className="label gap-2 cursor-pointer">
                    <input type="radio" value="non-document" checked={type === 'non-document'} onChange={() => setType('non-document')} className="radio text-primary" />
                    <span>Non-Document</span>
                </label>
            </div>

            {/* Parcel Info */}
            <div className="grid md:grid-cols-2 gap-4">
                <input {...register('title', { required: true })} placeholder="Parcel Name" className="input input-bordered w-full" />
                {type === 'non-document' && (
                    <input {...register('weight')} placeholder="Parcel Weight (KG)" type="number" className="input input-bordered w-full" />
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Sender Info */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Sender Details</h3>
                    <input {...register('senderName', { required: true })} placeholder="Sender Name" className="input input-bordered w-full" />
                    <input {...register('senderAddress', { required: true })} placeholder="Address" className="input input-bordered w-full" />
                    <input {...register('senderContact', { required: true })} placeholder="Sender Contact No" className="input input-bordered w-full" />
                    <select {...register('senderRegion', { required: true })} className="select select-bordered w-full">
                        <option value="">Select your region</option>
                        {regionOptions.map(region => <option key={region}>{region}</option>)}
                    </select>
                    <select {...register('senderCenter', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Service Center</option>
                        {senderCenters.map(center => <option key={center}>{center}</option>)}
                    </select>
                    <textarea {...register('senderInstruction', { required: true })} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full"></textarea>
                </div>

                {/* Receiver Info */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Receiver Details</h3>
                    <input {...register('receiverName', { required: true })} placeholder="Receiver Name" className="input input-bordered w-full" />
                    <input {...register('receiverAddress', { required: true })} placeholder="Receiver Address" className="input input-bordered w-full" />
                    <input {...register('receiverContact', { required: true })} placeholder="Receiver Contact No" className="input input-bordered w-full" />
                    <select {...register('receiverRegion', { required: true })} className="select select-bordered w-full">
                        <option value="">Select your region</option>
                        {regionOptions.map(region => <option key={region}>{region}</option>)}
                    </select>
                    <select {...register('receiverCenter', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Service Center</option>
                        {receiverCenters.map(center => <option key={center}>{center}</option>)}
                    </select>
                    <textarea {...register('receiverInstruction', { required: true })} placeholder="Delivery Instruction" className="textarea textarea-bordered w-full"></textarea>
                </div>
            </div>

            <div className="text-sm italic text-gray-600">* PickUp Time 4pm–7pm Approx</div>
            <button type="submit" className="btn w-full text-white" style={{ backgroundColor: '#CAEB66' }}>
                Proceed to Confirm Booking
            </button>

            {/* {showConfirm && (
                <div className="bg-green-50 mt-6 p-4 rounded-lg text-center border">
                    <p className="text-lg">Estimated Delivery Cost: <strong>৳{calculatedCost}</strong></p>
                    <button onClick={confirmBooking} className="btn btn-success mt-2">Confirm & Save Parcel</button>
                </div>
            )} */}
        </form>
    );
};

export default SendParcel;
