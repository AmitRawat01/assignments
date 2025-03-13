import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    phoneNo: { type: String, required: true },
});

const Address = mongoose.model('Address', addressSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
});

const User = mongoose.model('User', userSchema);

export { User, Address };
