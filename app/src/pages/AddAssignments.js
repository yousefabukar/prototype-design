import { useState } from 'react';

function AddAssignment({ onCancel }) {
    const [formData, setFormData] = useState({
        assignment_title: '',
        module_name: '',
        due_date: '',
        vcpu_value: '1',
        memory_value: '1'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('assignment_title', formData.assignment_title);
            submitData.append('module_name', formData.module_name);
            submitData.append('due_date', formData.due_date);
            submitData.append('vcpu_value', formData.vcpu_value);
            submitData.append('memory_value', formData.memory_value);

            if (selectedFile) {
                submitData.append('image_file', selectedFile);
            }

            const response = await fetch('http://localhost:3000/api/assignments', {
                method: 'POST',
                body: submitData
            });

            if (!response.ok) {
                throw new Error('Failed to create assignment');
            }

            onCancel(); // Close form after successful submission
            window.location.reload(); // Refresh the page to show new assignment
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Failed to create assignment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Create New Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={formData.assignment_title}
                        onChange={(e) => setFormData({...formData, assignment_title: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label>Module Code:</label>
                    <input
                        type="text"
                        value={formData.module_name}
                        onChange={(e) => setFormData({...formData, module_name: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label>Image File:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </div>

                <div>
                    <h3>Resources</h3>
                    <label>CPU:</label>
                    <select
                        value={formData.vcpu_value}
                        onChange={(e) => setFormData({...formData, vcpu_value: e.target.value})}
                    >
                        <option value="1">1.0 vCPU (Default)</option>
                        <option value="2">2.0 vCPU</option>
                        <option value="4">4.0 vCPU</option>
                    </select>

                    <label>Memory:</label>
                    <select
                        value={formData.memory_value}
                        onChange={(e) => setFormData({...formData, memory_value: e.target.value})}
                    >
                        <option value="1">1GB (Default)</option>
                        <option value="2">2GB</option>
                        <option value="4">4GB</option>
                    </select>
                </div>

                <div className="button-group">
                    <button type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Assignment'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddAssignment;