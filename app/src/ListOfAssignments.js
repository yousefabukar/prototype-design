import { useState } from 'react';
import './globalStyles.css';
import assignments from './assignments.js';
import AddAssignment from './AddAssignments.js';
import SubmissionsList from './SubmissionsList';
import EditAssignment from './EditAssignment.js';
import GradeSubmission from './GradeSubmission.js';

function ListOfAssignments() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  if (editingAssignment) {
    return (
      <EditAssignment 
        assignment={editingAssignment}
        onCancel={() => setEditingAssignment(null)}
        onSave={(updatedData) => {
          console.log('Updated assignment:', updatedData);
          setEditingAssignment(null);
        }}
      />
    );
  }

  if (showSubmissions) {
    return <SubmissionsList onBack={() => setShowSubmissions(false)} />;
  }

  if (showAddForm) {
    return <AddAssignment onCancel={() => setShowAddForm(false)} />;
  }

  return (
    <div>
      <h1>FNCS (Flexible New Code Submission)</h1>
      <h2>Assignment List</h2>
      <button onClick={() => setShowAddForm(true)}>+ Add New Assignment</button>
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Module</th>
              <th>Due Date</th>
              <th>Options</th>
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
                  <button onClick={() => setEditingAssignment(assignment)}>Edit</button>
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