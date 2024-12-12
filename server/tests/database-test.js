import mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'prototype',
    database: 'submissions_management'
});

describe('Database Connection', () => {

    test('can connect to database', async () => {
        const [result] = await db.query('SELECT 1');
        expect(result[0]['1']).toBe(1);
    });


    test('student_submissions table exists', async () => {
        const [tables] = await db.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        expect(tableNames).toContain('student_submissions');
    });
});

describe('Student Submissions Tests', () => {

    test('can fetch all submissions', async () => {
        const [rows] = await db.query('SELECT * FROM student_submissions');
        expect(Array.isArray(rows)).toBe(true);
    });

 
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


    test('can create and update submission', async () => {
 
        const [insertResult] = await db.query(
            'INSERT INTO student_submissions (name, submission_date, tests_passed, status) VALUES (?, ?, ?, ?)',
            ['Test Student', '2024-02-15', '10/15', 'Processed']
        );
        
        expect(insertResult.affectedRows).toBe(1);
        
 
        const [updateResult] = await db.query(
            'UPDATE student_submissions SET mark = ?, feedback = ? WHERE submission_id = ?',
            [75, 'Test feedback', insertResult.insertId]
        );
        
        expect(updateResult.affectedRows).toBe(1);

        await db.query('DELETE FROM student_submissions WHERE submission_id = ?', [insertResult.insertId]);
    });
});


afterAll(async () => {
    await db.end();
});