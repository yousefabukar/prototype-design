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

//Observability logging 
const logToDatabase = async (type, message) => {
    try {
        await db.query(
            'INSERT INTO observability (type, message, created_at) VALUES (?, ?, NOW())',
            [type, message]
        );
        
        if (type === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
    } catch (err) {
        console.error('Failed to log to database:', err);
        console.error('Original message:', message);
    }
};

// Logging endpoints
app.get('/api/logs', async (req, res) => {
    try {
        const { type, limit = 100, offset = 0 } = req.query;
        
        let query = 'SELECT * FROM observability';
        const queryParams = [];
        
        if (type) {
            query += ' WHERE type = ?';
            queryParams.push(type);
        }
        
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(Number(limit), Number(offset));
        
        const [logs] = await db.query(query, queryParams);
        
        res.json({
            logs,
            pagination: {
                limit: Number(limit),
                offset: Number(offset)
            }
        });
    } catch (err) {
        await logToDatabase('error', `Error fetching logs: ${err.message}`);
        res.status(500).json({ error: 'Error fetching logs' });
    }
});


// ASSIGNMENT ENDPOINTS

// Get all assignments
app.get('/api/assignments', async (req, res) => {
    try {
        const [assignments] = await db.query('SELECT * FROM assignments ORDER BY due_date ASC');
        await logToDatabase('info', `Successfully retrieved ${assignments.length} assignments`);
        res.json(assignments);
    } catch (err) {
        await logToDatabase('error', `Error fetching assignments: ${err.message}`);
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
            await logToDatabase('error', `Missing required fields in assignment creation: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const image_filepath = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await db.query(
            'INSERT INTO assignments (assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value) VALUES (?, ?, ?, ?, ?, ?)',
            [assignment_title, module_name, due_date, image_filepath, vcpu_value, memory_value]
        );

        await logToDatabase('info', `Assignment created successfully: ID ${result.insertId}`);

        res.status(201).json({
            id: result.insertId,
            message: 'Assignment created successfully'
        });
    } catch (err) {
        await logToDatabase('error', `Error creating assignment: ${err.message}`);
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
            await logToDatabase('error', `Assignment not found with ID: ${req.params.id}`);
            return res.status(404).json({ error: 'Assignment not found' });
        }
        await logToDatabase('info', `Successfully retrieved assignment with ID: ${req.params.id}`);
        res.json(assignment[0]);
    } catch (err) {
        await logToDatabase('error', `Error fetching assignment ${req.params.id}: ${err.message}`);
        res.status(500).json({ error: 'Error fetching assignment' });
    }
});

// SUBMISSION ENDPOINTS

// Get all submissions for an assignment
app.get('/api/assignments/:assignmentId/submissions', async (req, res) => {
    try {
        const [submissions] = await db.query(`
            SELECT *
            FROM student_submissions
            WHERE assignment_id = ?
            ORDER BY submission_date DESC`,
            [req.params.assignmentId]
        );
        await logToDatabase('info', `Retrieved ${submissions.length} submissions for assignment ${req.params.assignmentId}`);
        res.json(submissions);
    } catch (err) {
        await logToDatabase('error', `Error fetching submissions for assignment ${req.params.assignmentId}: ${err.message}`);
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
            await logToDatabase('error', `Submission not found with ID: ${req.params.id}`);
            return res.status(404).json({ error: 'Submission not found' });
        }
        await logToDatabase('info', `Successfully retrieved submission details for ID: ${req.params.id}`);
        res.json(submission[0]);
    } catch (err) {
        await logToDatabase('error', `Error fetching submission details for ID ${req.params.id}: ${err.message}`);
        res.status(500).json({ error: 'Error fetching submission details' });
    }
});

// Start submission processing
app.post("/api/assignments/:id/execute", async (req, res) => {
    try {
        await logToDatabase('info', `Starting execution for assignment ${req.params.id}`);
        const [assignment] = await db.query('SELECT * FROM assignments WHERE assignment_id = ?', [req.params.id]);

        const image = new ContainerImage(assignment[0].image_filepath);
        await image.extract();

        if (!await image.verify()) {
            await logToDatabase('error', `Invalid container image for assignment ${req.params.id}`);
            throw new Error("Invalid container image. Please verify your container image is of the correct format and then try again.");
        }

        const opts = {
            cpus: assignment[0].vcpu_value,
            mem: assignment[0].memory_value,
        }

        const [submissionList] = await db.query(`SELECT * FROM student_submissions WHERE assignment_id = ?`, [req.params.id]);
        await logToDatabase('info', `Processing ${submissionList.length} submissions for assignment ${req.params.id}`);
        
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
                 SET result_files = ?, logs = ?, status = "Processed"
                 WHERE submission_id = ?`,
                [JSON.stringify(testOutput), stdout, submission.submission_id]
            );

            if (result.affectedRows === 0) {
                await logToDatabase('error', `Failed to update submission ${submission.submission_id} for assignment ${req.params.id}`);
                return res.status(500).json({ error: 'Failed to update submission data' });
            }

            await logToDatabase('info', `Successfully processed submission ${submission.submission_id} for assignment ${req.params.id}`);
        }

        await image.cleanup();
        await logToDatabase('info', `Completed execution for all submissions of assignment ${req.params.id}`);

        res.status(200).json({ status: "OK", message: "Updated database successfully." });
    } catch (error) {
        await logToDatabase('error', `Error executing submission for assignment ${req.params.id}: ${error.message}`);
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
            await logToDatabase('error', `Submission not found for file download: ID ${req.params.id}`);
            return res.status(404).json({ error: 'Submission not found' });
        }

        const results = JSON.parse(submission[0].result_files);
        const file = results.files.find(f => f.name === req.params.filename);

        if (!file) {
            await logToDatabase('error', `File '${req.params.filename}' not found in submission ${req.params.id}`);
            return res.status(404).json({ error: 'File not found' });
        }
        await logToDatabase('error', `Error downloading file '${req.params.filename}' from submission ${req.params.id}: ${err.message}`);
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
            await logToDatabase('error', `Invalid mark (${mark}) attempted for submission ${req.params.id}`);
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
            await logToDatabase('error', `Submission not found for grading: ID ${req.params.id}`);
            return res.status(404).json({ error: 'Submission not found' });
        }
        await logToDatabase('info', `Successfully graded submission ${req.params.id} with mark ${mark}`);
        res.json({
            message: 'Submission graded successfully',
            updatedFields: { mark, feedback }
        });
    } catch (err) {
        await logToDatabase('error', `Error grading submission ${req.params.id}: ${err.message}`);
        res.status(500).json({ error: 'Error updating grade' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;