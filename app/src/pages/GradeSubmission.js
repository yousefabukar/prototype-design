import { useState } from 'react';

export default function GradeSubmission({ studentId, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const testResults = [
    { number: 1, status: 'Passed', weight: 10 },
    { number: 2, status: 'Passed', weight: 20 },
    { number: 3, status: 'Failed', weight: 10 }
  ];

  const logs = `Running on the following system:
root@system-ninjam kernel 8.3.4 root

Running test number 1... PASSED
Running test number 2... PASSED
Running test number 3... FAILED`;

  return (
    <div className="p-6">
      <button onClick={onBack} className="text-blue-500">← Back</button>
      <h2 className="text-xl font-semibold mb-6">Grade Submission - Student {studentId}</h2>
      
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr>
              <th>Test Number</th>
              <th>Status</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map(test => (
              <tr key={test.number}>
                <td>{test.number}</td>
                <td>{test.status}</td>
                <td>{test.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2">Final Mark: 75%</div>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">Test Running Logs</h3>
        <pre className="bg-gray-100 p-4 rounded">{logs}</pre>
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
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Feedback</label>
            <textarea 
              placeholder="Enter feedback for the student..."
              className="w-full h-32 border p-2 rounded"
            />
          </div>
          <div className="flex justify-center gap-2">
            <button className="bg-gray-200 px-4 py-2 rounded">Save Draft</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit Grade</button>
          </div>
        </div>
      </div>
    </div>
  );
}