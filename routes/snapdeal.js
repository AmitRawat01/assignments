// routes/snapdeal.js
import express from 'express';
import { getCommonHeaders } from './utils/scraperUtils.js';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

// Route for Snapdeal t-shirt category
router.get('/t-shirt', async (req, res) => {
  try {
    const url = 'https://www.snapdeal.com/search?keyword=t-shirt&santizedKeyword=t-shirt&catId=0&categoryId=0&suggested=false&vertical=p&noOfResults=20&searchState=&clickSrc=go_header&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy';
    const response = await axios.get(url, {
      headers: getCommonHeaders()
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Snapdeal's t-shirt product listing selectors
    $('.product-tuple-listing').each((i, el) => {
      const productElement = $(el);
      
      const product = {
        title: productElement.find('.product-title').text().trim(),
        price: productElement.find('.product-price').text().trim(),
        imageUrl: productElement.find('.product-image img').attr('src') || '',
        discount: productElement.find('.product-discount').text().trim(),
        rating: productElement.find('.product-rating-count').text().trim(),
        url: productElement.find('.dp-widget-link').attr('href') || ''
      };
      
      // Only add if we have at least a title
      if (product.title) {
        products.push(product);
      }
    });

    res.json({ source: 'Snapdeal', category: 't-shirt', productCount: products.length, products });
  } catch (error) {
    console.error('Error scraping Snapdeal:', error);
    res.status(500).json({ error: 'Failed to scrape Snapdeal t-shirt category' });
  }
});

export default router;