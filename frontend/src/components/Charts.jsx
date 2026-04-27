import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as ScatterTooltip, ZAxis
} from 'recharts';
import { PieChart as PieIcon, LineChart as ScatterIcon } from 'lucide-react';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip-custom">
        <div className="stat-item">
          <span className="stat-label">Outcome:</span>
          <span className="stat-value">{payload[0].name}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Count:</span>
          <span className="stat-value">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomScatterTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="tooltip-custom">
        <div className="stat-item">
          <span className="stat-label">Payload Mass:</span>
          <span className="stat-value">{data['Payload Mass (kg)']} kg</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Outcome:</span>
          <span className="stat-value" style={{color: data.class === 1 ? 'var(--success-color)' : 'var(--fail-color)'}}>
            {data.class === 1 ? 'Success' : 'Failure'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Booster:</span>
          <span className="stat-value">{data['Booster Version Category']}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardCharts = ({ data, selectedSite }) => {
  // Process Data for Pie Chart
  let pieData = [];
  if (selectedSite === 'ALL') {
    // For ALL sites, pie chart shows success count by launch site
    const successData = data.filter(d => d.class === 1);
    const siteCounts = {};
    successData.forEach(d => {
      siteCounts[d['Launch Site']] = (siteCounts[d['Launch Site']] || 0) + 1;
    });
    pieData = Object.keys(siteCounts).map(site => ({
      name: site,
      value: siteCounts[site]
    }));
  } else {
    // For a specific site, pie chart shows success (1) vs failure (0)
    const siteData = data.filter(d => d['Launch Site'] === selectedSite);
    const successCount = siteData.filter(d => d.class === 1).length;
    const failureCount = siteData.filter(d => d.class === 0).length;
    pieData = [
      { name: 'Success', value: successCount },
      { name: 'Failure', value: failureCount }
    ];
  }

  const COLORS = ['#66fcf1', '#45a29e', '#8884d8', '#82ca9d', '#ffc658'];

  // Booster Categories for Scatter Colors
  const boosterCategories = [...new Set(data.map(d => d['Booster Version Category']))];
  const scatterColors = ['#66fcf1', '#ff4c4c', '#f1c40f', '#9b59b6', '#3498db', '#e67e22'];
  
  return (
    <div className="charts-grid">
      <div className="glass-panel chart-container">
        <h2 className="chart-title">
          <PieIcon size={20} color="var(--text-highlight)" />
          {selectedSite === 'ALL' ? 'Total Success Launches By Site' : `Success vs Failure: ${selectedSite}`}
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              stroke="rgba(0,0,0,0)"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={selectedSite !== 'ALL' ? (entry.name === 'Success' ? 'var(--success-color)' : 'var(--fail-color)') : COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip content={<CustomPieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-main)' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-panel chart-container">
        <h2 className="chart-title">
          <ScatterIcon size={20} color="var(--text-highlight)" />
          Correlation between Payload and Success
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              dataKey="Payload Mass (kg)" 
              name="Payload Mass" 
              unit="kg" 
              stroke="var(--text-main)"
              tick={{ fill: 'var(--text-main)' }}
            />
            <YAxis 
              type="number" 
              dataKey="class" 
              name="Class" 
              ticks={[0, 1]}
              stroke="var(--text-main)"
              tick={{ fill: 'var(--text-main)' }}
              tickFormatter={(value) => value === 1 ? 'Success' : 'Failure'}
            />
            <ScatterTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip />} />
            <ZAxis type="category" dataKey="Booster Version Category" name="Booster" />
            
            {boosterCategories.map((booster, index) => (
               <Scatter 
                  key={booster}
                  name={booster}
                  data={data.filter(d => d['Booster Version Category'] === booster)}
                  fill={scatterColors[index % scatterColors.length]}
               />
            ))}
            
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-main)', fontSize: '0.8rem' }}/>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
