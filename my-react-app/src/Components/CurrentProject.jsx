// src/components/CurrentProject.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Project from './Project';
import api from '../api'; // Ensure correct path for importing api

function CurrentProject() {
  const [runningProjects, setRunningProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust to how you store your token
        const response = await fetch('http://localhost:5001/api/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const projects = await response.json();
        setRunningProjects(projects); // Set the fetched projects
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-gray-500">Loading projects...</p>; // Styled loading message
  if (error) return <p className="text-red-500">{error}</p>; // Styled error message

  return (
    <div className="current-project p-4"> {/* Add padding */}
      <h2 className="text-2xl font-bold mb-4">Current Running Projects</h2> {/* Styled heading */}
      {runningProjects.length === 0 ? (
        <p className="text-gray-600">No running projects found.</p> // Styled no projects message
      ) : (
        <ul className="space-y-4"> {/* Space between list items */}
          {runningProjects.map((project) => (
            <li key={project._id}>
              <Link to={`/project/${project._id}`} className="block p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition"> {/* Styled project link */}
                <Project 
                  title={project.title} 
                  description={project.description} 
                  startDate={project.startDate} 
                  endDate={project.endDate} 
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CurrentProject;
