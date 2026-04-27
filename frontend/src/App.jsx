import React, { useState, useEffect, useMemo } from 'react';
import { fetchSpaceXData } from './utils/data';
import { DashboardCharts } from './components/Charts';
import { Predictor } from './components/Predictor';
import { RocketIcon, ChevronDownIcon } from 'lucide-react';
import './index.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedSite, setSelectedSite] = useState('ALL');
  const [maxSelectedPayload, setMaxSelectedPayload] = useState(10000);
  
  const [maxPayload, setMaxPayload] = useState(10000);
  const [minPayload, setMinPayload] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchSpaceXData();
        setData(result);
        
        // Find min and max payload from data
        const max = Math.max(...result.map(d => d['Payload Mass (kg)']));
        const min = Math.min(...result.map(d => d['Payload Mass (kg)']));
        setMaxPayload(Math.ceil(max));
        setMinPayload(Math.floor(min));
        setMaxSelectedPayload(Math.ceil(max));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const sites = useMemo(() => {
    if (data.length === 0) return [];
    return [...new Set(data.map(item => item['Launch Site']))];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const payloadMass = item['Payload Mass (kg)'];
      const payloadMatch = payloadMass >= minPayload && payloadMass <= maxSelectedPayload;
      const siteMatch = selectedSite === 'ALL' || item['Launch Site'] === selectedSite;
      return payloadMatch && siteMatch;
    });
  }, [data, selectedSite, maxSelectedPayload, minPayload]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2 style={{ color: 'var(--text-highlight)' }}>Engaging Telemetry...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container" style={{ color: 'var(--fail-color)' }}>
        <h2 style={{ color: 'var(--fail-color)' }}>Error fetching data: {error}</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>
          <RocketIcon size={48} style={{ verticalAlign: 'middle', marginRight: '16px', color: 'var(--text-highlight)' }} />
          SpaceX Dynamics
        </h1>
        <p>Interactive Machine Learning & Telemetry Analysis Dashboard</p>
      </div>

      <div className="controls-container glass-panel">
        <div className="control-group">
          <label>
            Launch Site <ChevronDownIcon size={16} />
          </label>
          <div className="select-wrapper">
             <select 
               value={selectedSite} 
               onChange={(e) => setSelectedSite(e.target.value)}
             >
               <option value="ALL">All Sites</option>
               {sites.map(site => (
                 <option key={site} value={site}>{site}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="control-group" style={{ flex: 2 }}>
          <label style={{ justifyContent: 'space-between' }}>
            <span>Payload Mass Range</span>
            <span>{minPayload} kg - {maxSelectedPayload} kg</span>
          </label>
          <input 
            type="range" 
            min={minPayload} 
            max={maxPayload} 
            value={maxSelectedPayload} 
            onChange={(e) => setMaxSelectedPayload(parseInt(e.target.value))}
          />
        </div>
      </div>

      <DashboardCharts data={filteredData} selectedSite={selectedSite} />
      
      <Predictor />
    </div>
  );
}

export default App;
