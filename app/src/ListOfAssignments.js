import { useState } from 'react';
import './globalStyles.css';
import assignments from './assignments.js';
import AddAssignment from './AddAssignments.js';

function ListOfAssignments() {

    const [showAddForm, setShowAddForm] = useState(false);

    if (showAddForm) {
        return <AddAssignment onCancel={() => setShowAddForm(false)} />;
    }

    return (
        <div>
            <h1>FNCS (Flexible New Code Submission)</h1>
            <h2>Assignment List</h2>
            <button onClick={() => setShowAddForm(true)}>Add New Assignment</button>
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
                    <button>View
                        Submissions
                    </button>
                    <button>Edit</button>
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