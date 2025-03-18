const { scrapeSnapdealCategory } = require('../services/scraperService');

exports.fetchSnapdealTShirts = async (req, res) => {
    const url = 'https://www.snapdeal.com/products/mens-tshirts';
    try {
        const products = await scrapeSnapdealCategory(url);
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Snapdeal T-shirt data' });
    }
};
