import AccessToken from '../models/AccessToken.js';

export const validateAccessToken = async (req, res, next) => {
    const accessToken = req.headers['access_token'];
    if (!accessToken) return res.status(401).json({ data: [], message: 'Access token required' });

    try {
        const tokenData = await AccessToken.findOne({ access_token: accessToken });
        if (!tokenData || new Date() > tokenData.expiry) return res.status(401).json({ data: [], message: 'Invalid access token' });

        req.user = tokenData.user_id;
        next();
    } catch (error) {
        res.status(500).json({ data: [], message: 'Server error' });
    }
};
