import React, { useState } from 'react';
import GradeSubmission from './GradeSubmission.js';

function SubmissionsList({ onBack }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [submissions, setSubmissions] = useState([
        {
            id: 1,
            submissionId: "172",
            studentId: "23982",
            studentName: "Ruhaan Kadri",
            submissionDate: "2024-02-12",
            testsCompleted: 15,
            testsPassed: 12,
            status: "Incomplete"
        },
        {
            id: 2,
            submissionId: "1002",
            studentId: "24015",
            studentName: "Nisar Ahmed",
            submissionDate: "2024-02-11",
            testsCompleted: 15,
            testsPassed: 15,
            status: "Incomplete"
        },
        {
            id: 3,
            submissionId: "2394",
            studentId: "23948",
            studentName: "Yousef Abukar",
            submissionDate: "2024-02-20",
            testsCompleted: 13,
            testsPassed: 15,
            status: "Incomplete"
        },
    ]);

    const handleMarkAll = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setSubmissions(submissions.map(sub => ({
                ...sub,
                status: "Complete"
            })));
            setIsProcessing(false);
        }, 2000);
    };

    if (selectedStudent) {
        return <GradeSubmission 
            studentId={selectedStudent.studentId}
            onBack={() => setSelectedStudent(null)}
        />;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Student Submissions</h1>
                <div>
                    <button onClick={onBack} style={{ marginRight: '10px' }}>Back</button>
                    <button 
                        onClick={handleMarkAll}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            opacity: isProcessing ? 0.7 : 1
                        }}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing Pipeline...' : 'Mark All Submissions'}
                    </button>
                </div>
            </div>
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
                                {submission.status === "Complete" && (
                                    <button 
                                        onClick={() => setSelectedStudent(submission)}
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        Mark
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SubmissionsList;