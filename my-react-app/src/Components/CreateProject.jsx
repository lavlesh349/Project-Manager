// src/components/CreateProject.jsx

import React, { useState } from 'react';

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date inputs
    if (new Date(startDate) >= new Date(endDate)) {
      setError('Start date must be before end date.');
      return;
    }

    // Create the project data object
    const projectData = {
      title,
      description,
      startDate,
      endDate,
    };

    setLoading(true); // Set loading state to true
    setError(null); // Reset error state
    setSuccessMessage(''); // Reset success message

    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await fetch('http://localhost:5001/api/projects/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify(projectData), // Convert projectData to JSON
      });

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        const errorText = await response.text(); // Capture the error response
        throw new Error(`Failed to create project: ${errorText}`); // Throw an error for non-200 status codes
      }

      await response.json(); // Parse the JSON response
      setSuccessMessage('Project created successfully'); // Notify user
      // Reset the form fields
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message); // Set the error message for display
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="create-project p-6 max-w-md mx-auto bg-white rounded-lg shadow-md"> {/* Add Tailwind styles */}
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2> {/* Styled heading */}
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Space between form fields */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" // Styled input
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" // Styled textarea
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" // Styled date input
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" // Styled date input
          />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>} {/* Styled error message */}
      {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>} {/* Styled success message */}
    </div>
  );
}

export default CreateProject;
