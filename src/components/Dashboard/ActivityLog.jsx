import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ActivityLog = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/activity-log/${id}`, {
          withCredentials: true,
        });
        

        setHistory(res.data || []);
      } catch (err) {
        console.error('Failed to fetch activity log', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLog();
  }, [id]);

  if (loading) return <div>Loading activity log...</div>;

  return (
 <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
  <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Activity Log</h2>
  

  {history.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {history.map((entry, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            borderLeft: '5px solid #4a90e2',
          }}
        >
          <div style={{ fontSize: '16px', marginBottom: '6px' }}>
            <strong style={{ textTransform: 'capitalize' }}>{entry.field}</strong>:&nbsp;
            <span style={{ color: '#e74c3c' }}>{entry.oldValue}</span> →{' '}
            <span style={{ color: '#27ae60' }}>{entry.newValue}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Updated by <strong>{entry.updatedBy}</strong> on{' '}
            {new Date(entry.updatedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p style={{ color: '#999', fontSize: '16px' }}>No activity history available.</p>
  )}
</div>

  );
};

export default ActivityLog;
