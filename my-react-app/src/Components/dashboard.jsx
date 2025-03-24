// src/components/Dashboard.jsx

import React, { useState } from 'react';
import CreateProject from './CreateProject';
import CurrentProject from './CurrentProject';

function Dashboard() {
  // State to manage the active component
  const [activeComponent, setActiveComponent] = useState('current');

  // Function to handle button click
  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4"> {/* Main container styles */}
      <header className="flex justify-between items-center bg-white shadow p-4 mb-4 rounded"> {/* Header styles */}
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="space-x-4"> {/* Space between buttons */}
          <button 
            onClick={() => handleButtonClick('current')} 
            className={`px-4 py-2 rounded ${activeComponent === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Current Projects
          </button>
          <button 
            onClick={() => handleButtonClick('create')} 
            className={`px-4 py-2 rounded ${activeComponent === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Create Project
          </button>
        </div>
      </header>
      <main className="flex-grow bg-white p-4 rounded shadow"> {/* Main content styles */}
        {activeComponent === 'current' ? <CurrentProject /> : <CreateProject />}
      </main>
    </div>
  );
}

export default Dashboard;
