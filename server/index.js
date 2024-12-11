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


app.get('/api/submissions', async (req, res) => {
   try {
       const [submissions] = await db.query(
           'SELECT submission_id, name, submission_date, tests_passed, status FROM student_submissions'
       );
       res.json(submissions);
   } catch (err) {
       console.error('Error fetching submissions:', err);
       res.status(500).send('Error fetching submissions');
   }
});


app.get('/api/submissions/:id/details', async (req, res) => {
    try {
        const [submission] = await db.query(
            'SELECT result_files, mark, feedback FROM student_submissions WHERE submission_id = ?',
            [req.params.id]
        );
        
        if (submission.length === 0) {
            return res.status(404).send('Submission not found');
        }
        
        res.json(submission[0]);
    } catch (err) {
        console.error('Error fetching submission details:', err);
        res.status(500).send('Error fetching submission details');
    }
});

app.put('/api/submissions/:id/grade', async (req, res) => {
    try {
        const { mark, feedback } = req.body;
        
        const [result] = await db.query(
            'UPDATE student_submissions SET mark = ?, feedback = ? WHERE submission_id = ?',
            [mark, feedback, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Submission not found');
        }

        res.json({ 
            message: 'Submission graded successfully',
            updatedFields: { mark, feedback }
        });
    } catch (err) {
        console.error('Error updating submission grade:', err);
        res.status(500).send('Error updating submission grade');
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
