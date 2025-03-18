const { scrapeFlipkartCategory, scrapeFlipkartProductDetails } = require('../services/scraperService');

exports.fetchFlipkartMobiles = async (req, res) => {
    const url = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io';
    try {
        const products = await scrapeFlipkartCategory(url);
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Flipkart mobile data' });
    }
};

exports.fetchFlipkartMobilesFull = async (req, res) => {
    const url = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io';
    try {
        const productLinks = await scrapeFlipkartCategory(url);
        const detailedProducts = await Promise.all(productLinks.slice(0, 5).map(scrapeFlipkartProductDetails));
        res.json({ products: detailedProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching full Flipkart mobile data' });
    }
};
