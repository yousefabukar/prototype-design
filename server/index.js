import express from 'express';
import db from './config/db.js';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get all assignments
app.get('/api/assignments', async (req, res) => {
    try {
        const [assignments] = await db.query('SELECT * FROM assignments ORDER BY due_date ASC');
        res.json(assignments);
    } catch (err) {
        console.error('Error fetching assignments:', err);
        res.status(500).json({ error: 'Error fetching assignments' });
    }
});

// Create new assignment
app.post('/api/assignments', upload.single('image_file'), async (req, res) => {
    try {
        const {
            assignment_title,
            module_name,
            due_date,
            vcpu_value,
            memory_value
        } = req.body;

        if (!assignment_title || !module_name || !due_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const image_filepath = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await db.query(
            'INSERT INTO assignments (assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value) VALUES (?, ?, ?, ?, ?, ?)',
            [assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Assignment created successfully'
        });
    } catch (err) {
        console.error('Error creating assignment:', err);
        res.status(500).json({ error: 'Error creating assignment' });
    }
});

// Update assignment
app.put('/api/assignments/:id', upload.single('image_file'), async (req, res) => {
    try {
        const {
            assignment_title,
            module_name,
            due_date,
            vcpu_value,
            memory_value
        } = req.body;

        const image_filepath = req.file ? `/uploads/${req.file.filename}` : undefined;

        let query = 'UPDATE assignments SET assignment_title = ?, module_name = ?, due_date = ?, vcpu_value = ?, memory_value = ?';
        let params = [assignment_title, module_name, due_date, vcpu_value, memory_value];

        if (image_filepath) {
            query += ', image_filepath = ?';
            params.push(image_filepath);
        }

        query += ' WHERE assignment_id = ?';
        params.push(req.params.id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.json({ message: 'Assignment updated successfully' });
    } catch (err) {
        console.error('Error updating assignment:', err);
        res.status(500).json({ error: 'Error updating assignment' });
    }
});

// Get submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const [submissions] = await db.query(`
            SELECT 
                submission_id,
                name,
                submission_date,
                tests_passed,
                status,
                created_at
            FROM student_submissions
            ORDER BY created_at DESC
        `);
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});

// Get submission details
app.get('/api/submissions/:id/details', async (req, res) => {
    try {
        const [submission] = await db.query(
            'SELECT * FROM student_submissions WHERE submission_id = ?',
            [req.params.id]
        );

        if (submission.length === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        if (submission[0].result_files) {
            submission[0].result_files = JSON.parse(submission[0].result_files);
        }

        res.json(submission[0]);
    } catch (err) {
        console.error('Error fetching submission details:', err);
        res.status(500).json({ error: 'Error fetching submission details' });
    }
});

// Update submission grade
app.put('/api/submissions/:id/grade', async (req, res) => {
    try {
        const { mark, feedback } = req.body;

        if (typeof mark !== 'number' || mark < 0 || mark > 100) {
            return res.status(400).json({ error: 'Mark must be a number between 0 and 100' });
        }

        const [result] = await db.query(
            'UPDATE student_submissions SET mark = ?, feedback = ?, status = "Graded" WHERE submission_id = ?',
            [mark, feedback, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({ message: 'Submission graded successfully' });
    } catch (err) {
        console.error('Error updating submission grade:', err);
        res.status(500).json({ error: 'Error updating submission grade' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});