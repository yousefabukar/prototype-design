import React, { useState, useEffect } from 'react';
import GradeSubmission from './GradeSubmission';

function SubmissionsList({ assignmentId, onBack }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubmissions = async () => {
        try {
            if (!assignmentId) {
                throw new Error('Assignment ID is required');
            }

            console.log('Fetching submissions for assignment:', assignmentId);
            const response = await fetch(`http://localhost:3000/api/assignments/${assignmentId}/submissions`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }
            const data = await response.json();
            console.log('Received submissions:', data);
            setSubmissions(data);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleMarkAll = async () => {
        setIsProcessing(true);
        try {
            const processPromises = submissions.map(sub => 
                fetch(`http://localhost:3000/api/submissions/${sub.submission_id}/process`, {
                    method: 'POST'
                })
            );
            await Promise.all(processPromises);
            await fetchSubmissions();
        } catch (err) {
            console.error('Error processing submissions:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (selectedStudent) {
        return <GradeSubmission 
            submissionId={selectedStudent.submission_id}
            onBack={() => {
                setSelectedStudent(null);
                fetchSubmissions();
            }}
        />;
    }

    if (loading) return <div>Loading submissions...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Student Submissions</h1>
                <div>
                    <button onClick={onBack} style={{ marginRight: '10px' }}>Back</button>
                    <button 
                        onClick={handleMarkAll}
                        disabled={isProcessing}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            opacity: isProcessing ? 0.7 : 1
                        }}
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
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map(submission => (
                        <tr key={submission.submission_id}>
                            <td>{submission.submission_id}</td>
                            <td>{submission.name}</td>
                            <td>{new Date(submission.submission_date).toLocaleDateString()}</td>
                            <td>{submission.status}</td>
                            <td>
                                {submission.status === "Processed" && (
                                    <button 
                                        onClick={() => setSelectedStudent(submission)}
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: 'white'
                                        }}
                                    >
                                        View
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