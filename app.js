// app.js
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// 1. Route for Flipkart mobile category
app.get('/fetch/flipkart/mobile', async (req, res) => {
  try {
    const url = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
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

// 2. Route for Snapdeal t-shirt category
app.get('/fetch/snapdeal/t-shirt', async (req, res) => {
  try {
    const url = 'https://www.snapdeal.com/search?keyword=t-shirt&santizedKeyword=t-shirt&catId=0&categoryId=0&suggested=false&vertical=p&noOfResults=20&searchState=&clickSrc=go_header&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
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

// 3. Route for detailed Flipkart mobile information
app.get('/fetch/flipkart/mobile/full', async (req, res) => {
  try {
    // First, get all product URLs from the category page
    const categoryUrl = 'https://www.flipkart.com/mobiles/pr?sid=tyy,4io';
    const categoryResponse = await axios.get(categoryUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
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
          const productResponse = await axios.get(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
          });
          
          const product$ = cheerio.load(productResponse.data);
          
          // Extract detailed product information
          const detailedProduct = {
            title: product$('.B_NuCI').text().trim(),
            price: product$('._30jeq3').text().trim(),
            imageUrl: product$('._396cs4').attr('src') || '',
            rating: product$('._3LWZlK').text().trim(),
            url: url,
            highlights: [],
            specifications: {}
          };
          
          // Extract product highlights
          product$('._21Ahn-').each((i, el) => {
            detailedProduct.highlights.push(product$(el).text().trim());
          });
          
          // Extract specifications
          product$('._14cfVK').each((i, el) => {
            const specTitle = product$(el).find('._1hKmbr').text().trim();
            const specValue = product$(el).find('._21lJbe').text().trim();
            
            if (specTitle && specValue) {
              detailedProduct.specifications[specTitle] = specValue;
            }
          });
          
          return detailedProduct;
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});