import express from 'express';    
import db from './config/db.js';

const app = express();

app.use(express.json());


app.get('/api/assignments', async (req, res) => {
    try {
        const [assignments] = await db.query('SELECT * FROM Assignments');
        res.json(assignments);  
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).send('Error fetching assignments');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
