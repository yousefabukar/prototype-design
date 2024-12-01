import './globalStyles.css';
import assignments from './assignments.js'

function ListOfAssignments() {
    return (
        <div>
          <h1>Assignments - FNCS (Flexible New Code Submission)</h1>
          <button>Add New Assignment</button>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Module</th>
                <th>Due Date</th>
                <th>Tests Added</th>
                <th>Skeleton Code</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.module}</td>
                  <td>{assignment.dueDate}</td>
                  <td>{assignment.hasTests}</td>
                  <td>{assignment.hasSkeletonCode}</td>
                  <td>
                    <button>View</button>
                    <button>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
  
  export default ListOfAssignments;