import express from 'express';
import db from './config/db.js';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { ContainerEngine, ContainerImage } from '../libcontainer/build/index.js';

const app = express();

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

// ASSIGNMENT ENDPOINTS

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


// Get specific assignment
app.get('/api/assignments/:id', async (req, res) => {
    try {
        const [assignment] = await db.query(
            'SELECT * FROM assignments WHERE assignment_id = ?',
            [req.params.id]
        );

        if (assignment.length === 0) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.json(assignment[0]);
    } catch (err) {
        console.error('Error fetching assignment:', err);
        res.status(500).json({ error: 'Error fetching assignment' });
    }
});

// SUBMISSION ENDPOINTS

// Get all submissions for an assignment
app.get('/api/assignments/:assignmentId/submissions', async (req, res) => {
    try {
        const [submissions] = await db.query(`
            SELECT 
                submission_id,
                name,
                submission_date,
                tests_passed,
                status
            FROM student_submissions
            WHERE assignment_id = ?
            ORDER BY submission_date DESC`,
            [req.params.assignmentId]
        );
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

        // Parse result_files JSON if it exists
        if (submission[0].result_files) {
            try {
                submission[0].result_files = JSON.parse(submission[0].result_files);
            } catch (error) {
                console.error('Error parsing result_files JSON:', error);
                submission[0].result_files = null;
            }
        }

        res.json(submission[0]);
    } catch (err) {
        console.error('Error fetching submission details:', err);
        res.status(500).json({ error: 'Error fetching submission details' });
    }
});

// Start submission processing
app.post("/api/assignments/:id/execute", async (req, res) => {
    try {
        const [assignment] = await db.query('SELECT * FROM assignments WHERE assignment_id = ?', [req.params.id]);

        const image = new ContainerImage(assignment[0].image_filepath);
        await image.extract();

        if (!await image.verify()) {
            throw new Error("Invalid container image. Please verify your container image is of the correct format and then try again.");
        }

        const opts = {
            cpus: assignment[0].vcpu_value,
            mem: assignment[0].memory_value,
        }

        const [submissionList] = await db.query(`SELECT * FROM student_submissions WHERE assignment_id = ?`, [req.params.id]);
        const engineList = [];

        for (const submission of submissionList) {
            const engineInstance = new ContainerEngine(opts, image, submission.submission_path);
            await engineInstance.init();
            engineList.push(engineInstance);
        }

        const outputs = await Promise.all(engineList.map(engine => engine.waitForOutput()));

        for (let i = 0; i < engineList.length; i++) {
            const submission = submissionList[i];
            const engine = engineList[i];
            const stdout = outputs[i];

            const testOutput = await engine.getResults();
            await engine.cleanup();

            const [result] = await db.query(
                `UPDATE student_submissions 
                 SET result_files = ?, logs = ? 
                 WHERE submission_id = ?`,
                [JSON.stringify(testOutput), stdout, submission.submission_id]
            );

            if (result.affectedRows === 0) {
                return res.status(500).json({ error: 'Failed to update submission data' });
            }
        }

        await image.cleanup();

        res.status(200).json({ status: "OK", message: "Updated database successfully." });
    } catch (error) {
        console.error(`Error executing submission: ${error}`);
        res.status(500).json({ error: `Error executing submission: ${error}` });
    }
});

// Download submission result file
app.get('/api/submissions/:id/files/:filename', async (req, res) => {
    try {
        const [submission] = await db.query(
            'SELECT result_files FROM student_submissions WHERE submission_id = ?',
            [req.params.id]
        );

        if (submission.length === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        const results = JSON.parse(submission[0].result_files);
        const file = results.files.find(f => f.name === req.params.filename);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // dummy file content returned here, but would return the actual file from the container thingy here
        res.send(file.content);
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Error downloading file' });
    }
});

// Submit grade
app.put('/api/submissions/:id/grade', async (req, res) => {
    try {
        const { mark, feedback } = req.body;

        if (typeof mark !== 'number' || mark < 0 || mark > 100) {
            return res.status(400).json({ error: 'Mark must be a number between 0 and 100' });
        }

        const [result] = await db.query(
            `UPDATE student_submissions 
             SET mark = ?, 
                 feedback = ?,
                 status = "Graded"
             WHERE submission_id = ?`,
            [mark, feedback, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.json({
            message: 'Submission graded successfully',
            updatedFields: { mark, feedback }
        });
    } catch (err) {
        console.error('Error updating grade:', err);
        res.status(500).json({ error: 'Error updating grade' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;