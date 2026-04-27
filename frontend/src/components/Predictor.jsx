import React, { useState } from 'react';
import { predictLandingSuccess } from '../utils/data';
import { BrainCircuitIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export const Predictor = () => {
  const [formData, setFormData] = useState({
    PayloadMass: 5000,
    Flights: 1,
    GridFins: true,
    Reused: false,
    Legs: true,
    LaunchSite: 'CCAFS SLC 40',
    Orbit: 'LEO'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const prediction = await predictLandingSuccess(formData);
      setResult(prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  return (
    <div className="glass-panel" style={{ marginTop: '24px' }}>
      <h2 className="chart-title" style={{ justifyContent: 'center' }}>
        <BrainCircuitIcon size={24} color="var(--text-highlight)" style={{ marginRight: '8px' }}/>
        ML Mission Predictor
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-accent)' }}>
        Adjust the rocket parameters below to live test the trained Logistic Regression model.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '24px' }}>
        
        <div className="control-group">
          <label>Payload Mass (kg)</label>
          <input 
            type="number" 
            name="PayloadMass" 
            value={formData.PayloadMass} 
            onChange={handleChange}
            style={{ padding: '12px', background: 'rgba(11,12,16,0.8)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}
          />
        </div>

        <div className="control-group">
          <label>Previous Flights</label>
          <input 
            type="number" 
            name="Flights" 
            value={formData.Flights} 
            onChange={handleChange}
            min="1"
            style={{ padding: '12px', background: 'rgba(11,12,16,0.8)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', fontSize: '1rem' }}
          />
        </div>

        <div className="control-group">
          <label>Launch Site</label>
          <div className="select-wrapper">
             <select name="LaunchSite" value={formData.LaunchSite} onChange={handleChange}>
               <option value="CCAFS SLC 40">CCAFS SLC 40</option>
               <option value="VAFB SLC 4E">VAFB SLC 4E</option>
               <option value="KSC LC 39A">KSC LC 39A</option>
             </select>
          </div>
        </div>

        <div className="control-group">
          <label>Target Orbit</label>
          <div className="select-wrapper">
             <select name="Orbit" value={formData.Orbit} onChange={handleChange}>
               <option value="LEO">LEO</option>
               <option value="ISS">ISS</option>
               <option value="PO">PO</option>
               <option value="GTO">GTO</option>
               <option value="ES-L1">ES-L1</option>
               <option value="SSO">SSO</option>
               <option value="HEO">HEO</option>
               <option value="MEO">MEO</option>
               <option value="VLEO">VLEO</option>
               <option value="SO">SO</option>
               <option value="GEO">GEO</option>
             </select>
          </div>
        </div>

        <div className="control-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '24px', gridColumn: '1 / -1' }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="checkbox" name="GridFins" checked={formData.GridFins} onChange={handleChange} style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}/>
            Grid Fins
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="checkbox" name="Reused" checked={formData.Reused} onChange={handleChange} style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}/>
            Reused Booster
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="checkbox" name="Legs" checked={formData.Legs} onChange={handleChange} style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}/>
            Landing Legs
          </label>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '16px 36px', 
              background: 'var(--text-highlight)', 
              color: '#0b0c10', 
              border: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(102, 252, 241, 0.4)'
            }}
          >
            {loading ? 'Consulting ML Models...' : 'Predict Outcome'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255, 76, 76, 0.1)', border: '1px solid var(--fail-color)', borderRadius: '8px', color: 'var(--fail-color)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '32px', 
          padding: '32px', 
          background: result.prediction === 1 ? 'rgba(69, 162, 158, 0.1)' : 'rgba(255, 76, 76, 0.1)', 
          border: `1px solid ${result.prediction === 1 ? 'var(--success-color)' : 'var(--fail-color)'}`, 
          borderRadius: '8px', 
          textAlign: 'center',
          animation: 'spin 0.5s ease-out'
        }}>
          {result.prediction === 1 ? (
             <div style={{ color: 'var(--success-color)' }}>
               <CheckCircleIcon size={48} style={{ marginBottom: '16px' }} />
               <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Landing Successful!</h3>
               <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Model Confidence: {(result.probability * 100).toFixed(1)}%</p>
             </div>
          ) : (
             <div style={{ color: 'var(--fail-color)' }}>
               <XCircleIcon size={48} style={{ marginBottom: '16px' }} />
               <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Landing Expected to Fail.</h3>
               <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Model Confidence (Failure): {((1 - result.probability) * 100).toFixed(1)}%</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
