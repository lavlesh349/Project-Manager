// src/Components/Project.jsx
import React from 'react';

function Project({ title, description, startDate, endDate }) {
  return (
    <div className="project bg-white shadow-lg rounded-lg p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-2">{description || 'No description available.'}</p>
      <p className="text-sm text-gray-500">
        Start Date: {startDate ? new Date(startDate).toLocaleDateString() : 'Not specified'}
      </p>
      <p className="text-sm text-gray-500">
        End Date: {endDate ? new Date(endDate).toLocaleDateString() : 'Not specified'}
      </p>
    </div>
  );
}

export default Project;
