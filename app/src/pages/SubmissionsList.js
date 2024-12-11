import React, { useState } from 'react';
import GradeSubmission from './GradeSubmission.js';

function SubmissionsList({ onBack }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    const submissions = [
        {
            id: 1,
            submissionId: "172",
            studentId: "23982",
            studentName: "Ruhaan Kadri",
            submissionDate: "2024-02-12",
            testsCompleted: 15,
            testsPassed: 12,
            status: "Completed"
        },
        {
            id: 2,
            submissionId: "1002",
            studentId: "24015",
            studentName: "Nisar Ahmed",
            submissionDate: "2024-02-11",
            testsCompleted: 15,
            testsPassed: 15,
            status: "Completed"
        },
        {
            id: 3,
            submissionId: "2394",
            studentId: "23948",
            studentName: "Yousef Abukar",
            submissionDate: "2024-02-20",
            testsCompleted: 13,
            testsPassed: 15,
            status: "Completed"
        },
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
                        <th>Submission ID</th>
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
                            <td>{submission.submissionId}</td>
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