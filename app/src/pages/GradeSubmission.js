import React, { useState, useEffect, useCallback } from 'react';

function GradeSubmission({ submissionId, onBack }) {
    const [submission, setSubmission] = useState(null);
    const [mark, setMark] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchSubmissionDetails = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/submissions/${submissionId}/details`);
            if (!response.ok) throw new Error('Failed to fetch submission details');
            const data = await response.json();
            setSubmission(data);
            setMark(data.mark || '');
            setFeedback(data.feedback || '');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [submissionId]);

    useEffect(() => {
        fetchSubmissionDetails();
    }, [fetchSubmissionDetails]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/submissions/${submissionId}/grade`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mark: Number(mark),
                    feedback
                })
            });

            if (!response.ok) throw new Error('Failed to submit grade');
            onBack();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading submission details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!submission) return <div>No submission found</div>;

    return (
        <div className="p-6">
            <button onClick={onBack} className="text-blue-500">← Back</button>
            <h2 className="text-xl font-semibold mb-6">Grade Submission - {submission.name}</h2>

            <div className="mb-8">
                <div class="test-results">
                    <table>
                        <tbody>
                            <tr>
                                <th>Test Number</th>
                                <th>Status
                                </th>
                                <th>Weight</th>
                            </tr>

                            <tr>
                                <td>1</td>
                                <td>Passed</td>
                                <td>10</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Passed</td>
                                <td>20</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Failed</td>
                                <td>10</td>
                            </tr>
                            <tr>
                                <th>Final Mark: 75%</th>
                                <th>
                                </th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>

                    <table>
                        <tbody>
                            <tr>
                                <th>Test Running Logs</th>
                            </tr>
                            <tr>
                                <pre style={{
                                    padding: 20
                                }}>{submission.logs !== null ? submission.logs : 'No test results available'}</pre>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grading-section">
                <h3 className="text-lg font-medium mb-4">Grade Submission</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Mark</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={mark}
                            onChange={(e) => setMark(e.target.value)}
                            className="border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Feedback</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter feedback for the student..."
                            className="w-full h-32 border p-2 rounded"
                        />
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Grade'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GradeSubmission;