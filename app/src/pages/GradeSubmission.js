import { useState } from 'react';

export default function GradeSubmission({ studentId, onBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const handleStartPipeline = () => {
    setIsProcessing(true);
    // Simulate pipeline processing
    setTimeout(() => {
      setIsProcessing(false);
      setResults({
        files: [
          { name: 'test_results.txt', size: 'SIZE' },
          { name: 'compilation_output.txt', size: 'SIZE' },
          { name: 'diff_results.txt', size: 'SIZE' },
          { name: 'additional_output.txt', size: 'SIZE' }
        ]
      });
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-blue-500">← Back</button>
        <h2 className="text-xl font-semibold">Grade Submission - Student {studentId}</h2>
      </div>

      {!isProcessing && !results && (
        <button 
          onClick={handleStartPipeline}
          className="start-pipeline flex items-center gap-2"
        >
          ▶ Start Pipeline
        </button>
      )}

      {isProcessing && (
        <div className="processing-message flex items-center">
          <div className="spinner" />
          Processing submission... This may take a few minutes.
        </div>
      )}

      {results && (
        <div>
          <div className="test-results">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Result Files</h3>
              <button className="text-blue-500">↓ Download All</button>
            </div>
            
            {results.files.map(file => (
              <div key={file.name} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📄</span>
                  <span>{file.name}</span>
                  <span className="text-gray-500 text-sm">{file.size}</span>
                </div>
                <button className="text-blue-500">↓ Download</button>
              </div>
            ))}
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
              <div className="flex justify-end gap-2">
                <button className="bg-blue-500 text-white">Submit Grade</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}