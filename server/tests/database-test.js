import mysql from 'mysql2/promise';

// Create a test connection pool
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'prototype',
    database: 'submissions_management'
});

describe('Database Connection', () => {
    // Test basic connection
    test('can connect to database', async () => {
        const [result] = await db.query('SELECT 1');
        expect(result[0]['1']).toBe(1);
    });

    // Test if our table exists
    test('student_submissions table exists', async () => {
        const [tables] = await db.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        expect(tableNames).toContain('student_submissions');
    });
});

describe('Student Submissions Tests', () => {
    // Test if we can get all submissions
    test('can fetch all submissions', async () => {
        const [rows] = await db.query('SELECT * FROM student_submissions');
        expect(Array.isArray(rows)).toBe(true);
    });

    // Test if required columns exist
    test('submissions table has required columns', async () => {
        const [columns] = await db.query('DESCRIBE student_submissions');
        const columnNames = columns.map(col => col.Field);
        
        const requiredColumns = [
            'submission_id',
            'name',
            'submission_date',
            'tests_passed',
            'status',
            'result_files',
            'mark',
            'feedback'
        ];

        requiredColumns.forEach(column => {
            expect(columnNames).toContain(column);
        });
    });

    // Test inserting and updating a submission
    test('can create and update submission', async () => {
        // Insert test
        const [insertResult] = await db.query(
            'INSERT INTO student_submissions (name, submission_date, tests_passed, status) VALUES (?, ?, ?, ?)',
            ['Test Student', '2024-02-15', '10/15', 'Processed']
        );
        
        expect(insertResult.affectedRows).toBe(1);
        
        // Update test
        const [updateResult] = await db.query(
            'UPDATE student_submissions SET mark = ?, feedback = ? WHERE submission_id = ?',
            [75, 'Test feedback', insertResult.insertId]
        );
        
        expect(updateResult.affectedRows).toBe(1);

        // Clean up
        await db.query('DELETE FROM student_submissions WHERE submission_id = ?', [insertResult.insertId]);
    });
});

// Clean up connection after tests
afterAll(async () => {
    await db.end();
});