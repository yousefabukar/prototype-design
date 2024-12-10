import React, { useState } from 'react';
import GradeSubmission from './GradeSubmission.js';

function SubmissionsList({ onBack }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    const submissions = [
        {
            id: 1,
            studentId: "23982",
            studentName: "John Smith",
            submissionDate: "2024-02-12",
            testsCompleted: 15,
            testsPassed: 12,
            status: "Processed"
        },
        {
            id: 2,
            studentId: "24015", 
            studentName: "Emma Johnson",
            submissionDate: "2024-02-11",
            testsCompleted: 15,
            testsPassed: 15,
            status: "Processed"
        }
    ];

    if (selectedStudent) {
        return <GradeSubmission 
            studentId={selectedStudent.studentId} 
            onBack={() => setSelectedStudent(null)}
        />;
    }

    return (
        <div>
            <h1>Student Submissions</h1>
            <button onClick={onBack}>Back</button>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Submission Date</th>
                        <th>Tests Passed</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map(submission => (
                        <tr key={submission.id}>
                            <td>{submission.studentId}</td>
                            <td>{submission.studentName}</td>
                            <td>{submission.submissionDate}</td>
                            <td>{submission.testsPassed}/{submission.testsCompleted}</td>
                            <td>{submission.status}</td>
                            <td>
                                <button onClick={() => setSelectedStudent(submission)}>Mark</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SubmissionsList;