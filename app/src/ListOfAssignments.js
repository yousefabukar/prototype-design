import './globalStyles.css';

function ListOfAssignments() {  // Capitalized the function name
    let assignments = [
      {
        id: 1,
        title: "Homework",
        module: "Functional Programming",
        dueDate: "28-11-2024",
        hasTests: "No",
        hasSkeletonCode: "Yes"
      },
      {
        id: 2,
        title: "News Classifier",
        module: "Object Oriented Programming",
        dueDate: "17-1-2024",
        hasTests: "Yes",
        hasSkeletonCode: "Yes"
      }
    ];
  
    return (
      <div style={{ margin: '20px' }}>
        <h1>Assignments - FNCS (Flexible New Code Submission)</h1>
        <button>Add New Assignment</button>
        <br/><br/>
  
        <table border="1" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Module</th>
              <th>Due Date</th>
              <th>Tests Added</th>
              <th>Skeleton Code</th>
              <th>Actions</th>
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
                  &nbsp;
                  <button>Configure</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default ListOfAssignments;