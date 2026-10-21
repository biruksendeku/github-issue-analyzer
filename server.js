require('dotenv').config();
const app = require('./src/app');
const { PORT = 8000 } = process.env;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});