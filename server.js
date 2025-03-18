const express = require('express');
const flipkartRoutes = require('./src/routes/flipkartRoutes');
const snapdealRoutes = require('./src/routes/snapdealRoutes');

const app = express();
const PORT = 3000;

app.use('/fetch/flipkart', flipkartRoutes);
app.use('/fetch/snapdeal', snapdealRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
