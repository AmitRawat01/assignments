import mongoose from 'mongoose';

const accessTokenSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    access_token: { type: String, required: true },
    expiry: { type: Date, required: true },
});

const AccessToken = mongoose.model('AccessToken', accessTokenSchema);

export default AccessToken;
