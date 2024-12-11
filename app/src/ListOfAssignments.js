import { useState } from 'react';
import './styles.css';
import AddAssignment from './pages/AddAssignments.js';
import SubmissionsList from './pages/SubmissionsList';

const assignments = [           
  {
      id: 1,
      title: "Homework",
      module: "Functional Programming",
      dueDate: "28-11-2024",
  },
  {             
      id: 2,
      title: "News Classifier",
      module: "Object Oriented Programming",
      dueDate: "17-1-2024",
  },
  {
      id: 3,
      title: "Server & Client Firewall Rules",
      module: "Operating Systems & System Programming",
      dueDate: "19-10-2024",
  },
];

function ListOfAssignments() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);

  if (showSubmissions) {
    return <SubmissionsList onBack={() => setShowSubmissions(false)} />;
  }

  if (showAddForm) {
    return <AddAssignment onCancel={() => setShowAddForm(false)} />;
  }

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
        <table>
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
              <tr key={assignment.id}>
                <td>{assignment.title}</td>    
                <td>{assignment.module}</td>
                <td>{assignment.dueDate}</td>
                <td>
                  <button onClick={() => setShowSubmissions(true)}>View Submissions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListOfAssignments;