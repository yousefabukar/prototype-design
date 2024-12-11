import { useState } from 'react';

function AddAssignment({ onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        module: '',
        dueDate: '',            // state initialization for assignment creation
        resources: {
            cpu: '1 vCPU',
            memory: '1GB'
        }
    });


    const handleSubmit = (e) => {
        e.preventDefault();

                // this will be connected to the backend to be able to handle pressing submit when creating assignments

        console.log('assignment data - ', formData); // console output for testing purposes
    };

    
    return (
        <div>
            <h2>Create New Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div>

                    {/* Table structure layout / form setup */}

                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div>
                    <label>Module Code:</label>
                    <input
                        type="text"
                        value={formData.moduleCode}
                        onChange={(e) => setFormData({...formData, moduleCode: e.target.value})}
                    />
                </div>

                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                </div>

                <div>
                    <label>Image File:</label>
                    <input
                        type="file"
                        onChange={(e) => console.log('Image File:', e.target.files)}
                    />
                </div>

                <div>
                    <h3>Resources</h3>
                    <label>CPU:</label>
                    <select
                        value={formData.resources.cpu}
                        onChange={(e) => setFormData({
                            ...formData,
                            resources: {...formData.resources, cpu: e.target.value}
                        })}
                    >
                        <option value="1.0 vCPU">1.0 vCPU (Default)</option>
                        <option value="2.0 vCPU">2.0 vCPU</option>
                        <option value=".0 vCPU">4.0 vCPU</option>
                    </select>

                    <label>Memory:</label>
                    <select
                        value={formData.resources.memory}
                        onChange={(e) => setFormData({
                            ...formData,
                            resources: {...formData.resources, memory: e.target.value}
                        })}
                    >
                        <option value="1GB">1GB (Default)</option>
                        <option value="2GB">2GB</option>
                        <option value="4GB">4GB</option>
                    </select>
                </div>

                <div className="button-group">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={handleSubmit}>Create Assignment</button>
                </div>

            </form>
        </div>
    );
}

export default AddAssignment;