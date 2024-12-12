import { useState, useEffect } from 'react';
import ListOfAssignments from '../ListOfAssignments';

function LogsView({ onBack }) {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState(null);

    useEffect(async () => {
        const data = await (await fetch("http://localhost:3000/api/logs")).json();
        setLogs(data.logs);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div>
                <button onClick={onBack}>Back</button>
                <h1>FNCS - Observability Logs</h1>
                <h2>Loading logs...</h2>
            </div>
        )
    }

    return (
        <div>
            <button onClick={onBack}>Back</button>
            <h1>FNCS - Observability Logs</h1>

            <table>
                <tbody>
                    <tr>
                        <th>Log ID</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Created At</th>
                    </tr>

                    {
                        logs.map(log => (
                            <tr>
                                <td>{log.log_id}</td>
                                <td>{log.type}</td>
                                <td>{log.message}</td>
                                <td>{log.created_at}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default LogsView;