import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure/useAxiosSecure';
import { useNavigate } from 'react-router';

const generateTrackingId = (prefix = 'TRK', region = 'GEN') => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
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
    const [parcelData, setParcelData] = useState(null);

    const axiosSecure = useAxiosSecure();
    const senderRegion = watch('senderRegion');
    const receiverRegion = watch('receiverRegion');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await axios.get('/warehouses.json');
                setWarehouses(response.data);
                const regions = [...new Set(response.data.map(w => w.region))];
                setRegionOptions(regions);
            } catch (error) {
                toast.error("Failed to load warehouse data");
            }
        };
        fetchWarehouses();
    }, []);

    useEffect(() => {
        if (senderRegion && warehouses.length > 0) {
            const centers = warehouses.filter(w => w.region === senderRegion).map(w => w.district);
            setSenderCenters([...new Set(centers)]);
        }
    }, [senderRegion, warehouses]);

    useEffect(() => {
        if (receiverRegion && warehouses.length > 0) {
            const centers = warehouses.filter(w => w.region === receiverRegion).map(w => w.district);
            setReceiverCenters([...new Set(centers)]);
        }
    }, [receiverRegion, warehouses]);

    const onSubmit = async (data) => {
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

        Swal.fire({
            title: `<div class="text-xl font-bold">Estimated Delivery Cost</div>`,
            html: `
                <div class="text-left text-[15px]">
                    <p class="mb-2">Delivery charge calculated based on parcel type, distance, and weight.</p>
                    <ul class="space-y-1 mb-2">
                        <li><strong>Parcel Type:</strong> ${type}</li>
                        <li><strong>Delivery:</strong> ${sameCity ? 'Within City' : 'Outside City/District'}</li>
                        <li><strong>Base Price:</strong> ৳${basePrice}</li>
                        ${!isDocument && weight > 3 ? `<li><strong>Extra Weight:</strong> ৳${extraCost}</li>` : ''}
                        ${!isDocument && weight > 3 && !sameCity ? `<li><strong>Outside Extra:</strong> ৳${outsideExtra}</li>` : ''}
                    </ul>
                    <div class="text-lg font-bold text-green-700 text-center">Total Payable: ৳${cost}</div>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: '✅ Proceed to Payment',
            cancelButtonText: '✏️ Edit Details',
            confirmButtonColor: '#CAEB66',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.post('/add-parcel', fullData);
                    console.log(res.data.insertedId);
                    if (res.data.insertedId || res.data.acknowledged) {
                        navigate('/dashboard/my-parcel')
                        Swal.fire({
                            icon: 'success',
                            title: '✅ Parcel Confirmed!',
                            text: 'Your parcel has been saved and is ready for processing.',
                            confirmButtonColor: '#CAEB66'
                        });
                    } else {
                        throw new Error('Insert failed');
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto p-6 border rounded-lg shadow space-y-6">
            <h2 className="text-3xl font-bold border-b pb-2">Add Parcel</h2>
            <div className="flex gap-6">
                <label className="label gap-2 cursor-pointer">
                    <input type="radio" value="document" checked={type === 'document'} onChange={() => setType('document')} className="radio" />
                    <span>Document</span>
                </label>
                <label className="label gap-2 cursor-pointer">
                    <input type="radio" value="non-document" checked={type === 'non-document'} onChange={() => setType('non-document')} className="radio" />
                    <span>Non-Document</span>
                </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <input {...register('title', { required: true })} placeholder="Parcel Name" className="input input-bordered w-full" />
                {type === 'non-document' && (
                    <input {...register('weight')} placeholder="Weight (KG)" type="number" className="input input-bordered w-full" />
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Sender Details</h3>
                    <input {...register('senderName', { required: true })} placeholder="Name" className="input input-bordered w-full" />
                    <input {...register('senderAddress', { required: true })} placeholder="Address" className="input input-bordered w-full" />
                    <input {...register('senderContact', { required: true })} placeholder="Contact No" className="input input-bordered w-full" />
                    <select {...register('senderRegion', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Region</option>
                        {regionOptions.map(region => <option key={region}>{region}</option>)}
                    </select>
                    <select {...register('senderCenter', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Center</option>
                        {senderCenters.map(center => <option key={center}>{center}</option>)}
                    </select>
                    <textarea {...register('senderInstruction', { required: true })} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full"></textarea>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Receiver Details</h3>
                    <input {...register('receiverName', { required: true })} placeholder="Name" className="input input-bordered w-full" />
                    <input {...register('receiverAddress', { required: true })} placeholder="Address" className="input input-bordered w-full" />
                    <input {...register('receiverContact', { required: true })} placeholder="Contact No" className="input input-bordered w-full" />
                    <select {...register('receiverRegion', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Region</option>
                        {regionOptions.map(region => <option key={region}>{region}</option>)}
                    </select>
                    <select {...register('receiverCenter', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Center</option>
                        {receiverCenters.map(center => <option key={center}>{center}</option>)}
                    </select>
                    <textarea {...register('receiverInstruction', { required: true })} placeholder="Delivery Instruction" className="textarea textarea-bordered w-full"></textarea>
                </div>
            </div>

            <button type="submit" className="btn w-full text-white" style={{ backgroundColor: '#CAEB66' }}>Confirm Booking</button>
        </form>
    );
};

export default SendParcel;