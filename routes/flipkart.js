// routes/flipkart.js
import express from 'express';
import { fetchProductDetails, getCommonHeaders } from '../utils/scraperUtils.js';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

// Route for Flipkart mobile category
router.get('/mobile', async (req, res) => {
  try {
    const url = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io';
    const response = await axios.get(url, {
      headers: getCommonHeaders()
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Flipkart's mobile product listing selectors
    $('._1AtVbE').each((i, el) => {
      const productElement = $(el);
      
      const title = productElement.find('._4rR01T').text();
      if (!title) return; // Skip if no title found (likely not a product)
      
      const product = {
        title,
        price: productElement.find('._30jeq3').text(),
        imageUrl: productElement.find('._396cs4').attr('src') || '',
        rating: productElement.find('._3LWZlK').text(),
        specifications: productElement.find('.fMghEO').text(),
        url: 'https://www.flipkart.com' + (productElement.find('a').attr('href') || '')
      };
      
      products.push(product);
    });

    res.json({ source: 'Flipkart', category: 'mobile', productCount: products.length, products });
  } catch (error) {
    console.error('Error scraping Flipkart:', error);
    res.status(500).json({ error: 'Failed to scrape Flipkart mobile category' });
  }
});

// Route for detailed Flipkart mobile information
router.get('/mobile/full', async (req, res) => {
  try {
    // First, get all product URLs from the category page
    const categoryUrl = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io';
    const categoryResponse = await axios.get(categoryUrl, {
      headers: getCommonHeaders()
    });

    const $ = cheerio.load(categoryResponse.data);
    const productUrls = [];

    // Extract product URLs
    $('._1AtVbE').each((i, el) => {
      const href = $(el).find('a').attr('href');
      if (href && href.includes('/p/')) {
        productUrls.push('https://www.flipkart.com' + href);
      }
    });

    // Limit the number of URLs to process to avoid overloading (can be adjusted)
    const urlsToProcess = productUrls.slice(0, 5);
    
    // Process each product URL to get detailed information
    const detailedProducts = await Promise.all(
      urlsToProcess.map(async (url) => {
        try {
          return await fetchProductDetails(url);
        } catch (error) {
          console.error(`Error scraping product ${url}:`, error);
          return { url, error: 'Failed to scrape product details' };
        }
      })
    );

    res.json({ 
      source: 'Flipkart', 
      category: 'mobile/full', 
      totalProductUrls: productUrls.length,
      processedUrls: urlsToProcess.length,
      products: detailedProducts 
    });
  } catch (error) {
    console.error('Error in full Flipkart scraping:', error);
    res.status(500).json({ error: 'Failed to perform full Flipkart mobile scraping' });
  }
});

export default router;