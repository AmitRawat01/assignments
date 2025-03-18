// utils/scraperUtils.js
import axios from 'axios';
import cheerio from 'cheerio';

/**
 * Get common headers for HTTP requests
 * @returns {Object} Headers object
 */
export const getCommonHeaders = () => {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  };
};

/**
 * Fetch detailed product information from a product page
 * @param {string} url Product URL
 * @returns {Object} Product details
 */
export const fetchProductDetails = async (url) => {
  const productResponse = await axios.get(url, {
    headers: getCommonHeaders()
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
};