import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import addressRoutes from './routes/address.route.js'
import connectDB from './db.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/address", addressRoutes);

// Reverse geocoding endpoint
app.post('/api/geocode/reverse', async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
                headers: {
                    'User-Agent': 'Your_App_Name/1.0'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching address' });
    }
});

// Search endpoint
app.post('/api/geocode/search', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            {
                headers: {
                    'User-Agent': 'Your_App_Name/1.0'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching suggestions' });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


