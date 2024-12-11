import { useState } from 'react';

function EditAssignment({ assignment, onCancel, onSave }) {
   const [formData, setFormData] = useState({
       title: assignment.title,
       module: assignment.module,
       dueDate: assignment.dueDate,
       resources: {
           cpu: '1 vCPU',
           memory: '1GB'
       }
   });

   const handleSubmit = (e) => {
       e.preventDefault();
       onSave(formData);
   };

   return (
       <div>
           <h2>Edit Assignment</h2>
           <form onSubmit={handleSubmit}>
               <div className="form-container">
                   <div className="form-column">
                       <div>
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
                               value={formData.module}
                               onChange={(e) => setFormData({...formData, module: e.target.value})}
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
                           <h3>Resources</h3>
                           <label>CPU:</label>
                           <select
                               value={formData.resources.cpu}
                               onChange={(e) => setFormData({
                                   ...formData,
                                   resources: {...formData.resources, cpu: e.target.value}
                               })}
                           >
                               <option value="1.0 vCPU">1.0 vCPU</option>
                               <option value="2.0 vCPU">2.0 vCPU</option>
                               <option value="4.0 vCPU">4.0 vCPU</option>
                           </select>

                           <label>Memory:</label>
                           <select
                               value={formData.resources.memory}
                               onChange={(e) => setFormData({
                                   ...formData,
                                   resources: {...formData.resources, memory: e.target.value}
                               })}
                           >
                               <option value="1GB">1GB</option>
                               <option value="2GB">2GB</option>
                               <option value="4GB">4GB</option>
                           </select>
                       </div>
                   </div>
               </div>

               <div>
                   <button onClick={onCancel}>Cancel</button>
                   <button type="submit">Save Changes</button>
               </div>
           </form>
       </div>
   );
}

export default EditAssignment;