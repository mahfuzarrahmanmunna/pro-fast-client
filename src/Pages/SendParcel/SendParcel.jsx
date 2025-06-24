import { useState } from 'react';
import toast from 'react-hot-toast';

const SendParcel = () => {
    const [type, setType] = useState('document');
    const [formData, setFormData] = useState({
        title: '',
        weight: '',
        senderName: '',
        senderContact: '',
        senderRegion: '',
        senderCenter: '',
        senderAddress: '',
        senderInstruction: '',
        receiverName: '',
        receiverContact: '',
        receiverRegion: '',
        receiverCenter: '',
        receiverAddress: '',
        receiverInstruction: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = ['title', 'senderName', 'senderContact', 'senderRegion', 'senderCenter', 'senderAddress', 'senderInstruction', 'receiverName', 'receiverContact', 'receiverRegion', 'receiverCenter', 'receiverAddress', 'receiverInstruction'];
        const missing = requiredFields.find(f => !formData[f]?.trim());
        if (missing) return toast.error(`Please fill out ${missing}`);

        const cost = type === 'document' ? 50 : (100 + (parseFloat(formData.weight) || 0) * 10);
        toast((t) => (
            <span>
                Estimated cost: <b>৳{cost}</b>
                <button onClick={() => {
                    toast.dismiss(t.id);
                    // Submit to backend here
                    toast.success("Parcel Confirmed");
                }} className="btn btn-sm ml-4" style={{ backgroundColor: '#CAEB66' }}>Confirm</button>
            </span>
        ));
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto border p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-3xl font-bold text-left border-b pb-2 border-dotted">Add Parcel</h2>
            <p className="text-lg font-medium">Enter your parcel details</p>

            {/* Type Selection */}
            <div className="flex items-center gap-6">
                <label className="label cursor-pointer gap-2">
                    <input type="radio" name="type" value="document" className="radio" checked={type === 'document'} onChange={() => setType('document')} />
                    <span className="label-text">Document</span>
                </label>
                <label className="label cursor-pointer gap-2">
                    <input type="radio" name="type" value="non-document" className="radio" checked={type === 'non-document'} onChange={() => setType('non-document')} />
                    <span className="label-text">Non-Document</span>
                </label>
            </div>

            {/* Parcel Info */}
            <div className="grid md:grid-cols-2 gap-4">
                <input type="text" name="title" placeholder="Parcel Name" className="input input-bordered w-full" onChange={handleChange} />
                {type === 'non-document' && (
                    <input type="number" name="weight" placeholder="Parcel Weight (KG)" className="input input-bordered w-full" onChange={handleChange} />
                )}
            </div>

            {/* Sender and Receiver Sections */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Sender */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Sender Details</h3>
                    <input name="senderName" placeholder="Sender Name" className="input input-bordered w-full" onChange={handleChange} />
                    <input name="senderAddress" placeholder="Address" className="input input-bordered w-full" onChange={handleChange} />
                    <input name="senderContact" placeholder="Sender Contact No" className="input input-bordered w-full" onChange={handleChange} />
                    <select name="senderRegion" className="select select-bordered w-full" onChange={handleChange}>
                        <option value="">Select your region</option>
                        <option>Dhaka</option>
                        <option>Chattogram</option>
                    </select>
                    <select name="senderCenter" className="select select-bordered w-full" onChange={handleChange}>
                        <option value="">Select Wire house</option>
                        <option>Uttara Hub</option>
                        <option>Mirpur Center</option>
                    </select>
                    <textarea name="senderInstruction" placeholder="Pickup Instruction" className="textarea textarea-bordered w-full" onChange={handleChange}></textarea>
                </div>

                {/* Receiver */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Receiver Details</h3>
                    <input name="receiverName" placeholder="Receiver Name" className="input input-bordered w-full" onChange={handleChange} />
                    <input name="receiverAddress" placeholder="Receiver Address" className="input input-bordered w-full" onChange={handleChange} />
                    <input name="receiverContact" placeholder="Receiver Contact No" className="input input-bordered w-full" onChange={handleChange} />
                    <select name="receiverRegion" className="select select-bordered w-full" onChange={handleChange}>
                        <option value="">Select your region</option>
                        <option>Dhaka</option>
                        <option>Chattogram</option>
                    </select>
                    <select name="receiverCenter" className="select select-bordered w-full" onChange={handleChange}>
                        <option value="">Select Wire house</option>
                        <option>Banani Delivery</option>
                        <option>Chawk Bazar Point</option>
                    </select>
                    <textarea name="receiverInstruction" placeholder="Delivery Instruction" className="textarea textarea-bordered w-full" onChange={handleChange}></textarea>
                </div>
            </div>

            {/* Submit */}
            <div className="text-sm italic text-gray-600">* PickUp Time 4pm-7pm Approx</div>
            <button type="submit" className="btn text-white w-full" style={{ backgroundColor: '#CAEB66' }}>
                Proceed to Confirm Booking
            </button>
        </form>
    );
};

export default SendParcel;
