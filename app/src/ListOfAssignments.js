import { useState, useEffect } from 'react';
import AddAssignment from './pages/AddAssignments';
import SubmissionsList from './pages/SubmissionsList';
import LogsView from './pages/LogsView';

function ListOfAssignments() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLogs, setShowLogs] = useState(null);

    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/assignments');
            if (!response.ok) {
                throw new Error('Failed to fetch assignments');
            }
            const data = await response.json();
            setAssignments(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            setError('Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    if (showLogs) {
        return (<LogsView onBack={() => {
            setShowLogs(false);
            setShowSubmissions(false);
            setSelectedAssignment(null);
        }} />)
    }

    if (showSubmissions && selectedAssignment) {
        return (
            <SubmissionsList
                assignmentId={selectedAssignment.assignment_id}
                onBack={() => {
                    setShowSubmissions(false);
                    setSelectedAssignment(null);
                }}
            />
        );
    }

    if (showAddForm) {
        return (
            <AddAssignment
                onCancel={() => setShowAddForm(false)}
                onSuccess={() => {
                    setShowAddForm(false);
                    fetchAssignments();
                }}
            />
        );
    }

    if (loading) return <div>Loading assignments...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <div>
                    <h1>FNCS (Flexible New Code Submission)</h1>
                    <h2>Assignment List</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    + Add New Assignment
                </button>
            </div>
            <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Module</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment.assignment_id}>
                                <td>{assignment.assignment_title}</td>
                                <td>{assignment.module_name}</td>
                                <td>{new Date(assignment.due_date).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedAssignment(assignment);
                                            setShowSubmissions(true);
                                        }}
                                        style={{
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            marginRight: '5px'
                                        }}
                                    >
                                        View Submissions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button style={{ float: "right" }} onClick={() => {
                setShowLogs(true);
            }}>
                View Debug Logs
            </button>
        </div>
    );
}

export default ListOfAssignments;