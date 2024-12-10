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

app.post('/api/assignments', async (req, res) => {
    try{
        const { 
            assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value} = req.body;
        
        const [result] = await db.query (
            'INSERT INTO assignments (assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value) VALUES (?, ?, ?, ?, ?, ?)',
            [assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value]
        );

        res.status(201).json({ 
            id: result.insertId,
            message: 'Assignment created successfully'
        });
    } catch (err) {
        console.error('Error creating assignment:', err);
        res.status(500).send('Error creating assignment');
    }

    });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
