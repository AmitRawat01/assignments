const request = require('request');
const cheerio = require('cheerio');

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error) reject(error);
            resolve(html);
        });
    });
}

exports.scrapeFlipkartCategory = async (url) => {
    try {
        const html = await fetchHTML(url);
        const $ = cheerio.load(html);
        let products = [];

        $('.KzDlHZ').each((index, element) => { 
            const title = $(element).find('.IRpwTa').text() || $(element).find('._4rR01T').text();
            const price = $(element).find('._30jeq3').text();
            const rating = $(element).find('._3LWZlK').text();
            const link = 'https://www.flipkart.com' + $(element).find('a').attr('href');

            if (title) {
                products.push({ title, price, rating, link });
            }
        });

        return products;
    } catch (error) {
        throw new Error('Error scraping Flipkart category');
    }
};

exports.scrapeFlipkartProductDetails = async (url) => {
    try {
        const html = await fetchHTML(url);
        const $ = cheerio.load(html);

        const title = $('span.B_NuCI').text();
        const price = $('div._30jeq3').text();
        const description = $('div._1mXcCf').text();
        const rating = $('div._3LWZlK').text();

        return { title, price, rating, description, url };
    } catch (error) {
        return { error: 'Error fetching product details', url };
    }
};

exports.scrapeSnapdealCategory = async (url) => {
    try {
        const html = await fetchHTML(url);
        const $ = cheerio.load(html);
        let products = [];

        $('.product-tuple-listing').each((index, element) => { 
            const title = $(element).find('.product-title').text().trim();
            const price = $(element).find('.product-price').text().trim();
            const rating = $(element).find('.filled-stars').attr('style');
            const link = $(element).find('.dp-widget-link').attr('href');

            if (title) {
                products.push({ title, price, rating, link });
            }
        });

        return products;
    } catch (error) {
        throw new Error('Error scraping Snapdeal category');
    }
};
