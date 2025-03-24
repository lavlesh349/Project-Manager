import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import '../styles.css'; // Keep this for any additional custom styles

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Normal');
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { userId } = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(userId);
    }

    const fetchProjectDetails = async () => {
      try {
        if (!token) throw new Error('No token found. Please log in again.');

        const response = await fetch(`http://localhost:5001/api/projects/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to fetch project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();

    return () => {
      setProject(null);
      setError(null);
    };
  }, [id]);

  const addTask = async () => {
    setTaskLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      const task = {
        label: newTaskLabel,
        priority: newTaskPriority,
        status: 'Pending',
      };

      const response = await fetch(`http://localhost:5001/api/projects/${project._id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      setProject((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
      setNewTaskLabel('');
      setNewTaskPriority('Normal');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setTaskLoading(false);
    }
  };

  const removeTask = async (taskId) => {
    setTaskLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      const response = await fetch(`http://localhost:5001/api/projects/${project._id}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove task');
      }
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.filter(task => task._id !== taskId),
      }));
      console.log('Task removed successfully');
    } catch (error) {
      console.error('Error removing task:', error);
      setError('Failed to remove task. Please try again.');
    } finally {
      setTaskLoading(false);
    }
  };

  const addMember = async () => {
    setMemberLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      const response = await fetch(`http://localhost:5001/api/projects/${project._id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newMemberUsername }),
      });

      if (!response.ok) {
        throw new Error('Failed to add team member');
      }
      const newMember = await response.json();
      setProject((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember],
      }));
      setNewMemberUsername('');
    } catch (error) {
      console.error('Error adding team member:', error);
      setError('Failed to add team member. Please try again.');
    } finally {
      setMemberLoading(false);
    }
  };

  const removeMember = async (memberId) => {
    setMemberLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in again.');

      const response = await fetch(`http://localhost:5001/api/projects/${project._id}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove team member');
      }
      setProject((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(member => member._id !== memberId),
      }));
      console.log('Team member removed successfully');
    } catch (error) {
      console.error('Error removing team member:', error);
      setError('Failed to remove team member. Please try again.');
    } finally {
      setMemberLoading(false);
    }
  };

  const sortTasksByPriority = (tasks) => {
    const priorityOrder = { High: 1, Normal: 2, Low: 3 };
    return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p className="text-red-500">Project not found.</p>;

  const sortedTasks = Array.isArray(project.tasks) ? sortTasksByPriority(project.tasks) : [];
  const isCreator = currentUserId === project.creatorId;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <button 
        onClick={() => navigate('/projects')} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Projects
      </button>
      <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
      <p className="mb-4">{project.description || 'No description available.'}</p>

      {isCreator && (
        <>
          <h3 className="text-lg font-medium mb-2">Add New Task</h3>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Task Label"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              className="flex-grow border rounded px-4 py-2 mr-2"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="border rounded px-4 py-2 mr-2"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
            <button 
              onClick={addTask} 
              disabled={taskLoading}
              className={`px-4 py-2 text-white rounded ${taskLoading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {taskLoading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </>
      )}

      <h3 className="text-lg font-medium mb-2">Tasks</h3>
      {sortedTasks.length > 0 ? (
        <ul className="list-disc pl-6 mb-4">
          {sortedTasks.map((task) => (
            <li key={task._id} className="mb-2">
              {task.label} - {task.status} (Priority: {task.priority})
              {isCreator && (
                <button 
                  onClick={() => removeTask(task._id)} 
                  disabled={taskLoading}
                  className={`ml-2 px-2 py-1 text-white rounded ${taskLoading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {taskLoading ? 'Removing...' : 'Remove'}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}

      {isCreator && (
        <>
          <h3 className="text-lg font-medium mb-2">Add Team Member</h3>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Username"
              value={newMemberUsername}
              onChange={(e) => setNewMemberUsername(e.target.value)}
              className="flex-grow border rounded px-4 py-2 mr-2"
            />
            <button 
              onClick={addMember} 
              disabled={memberLoading}
              className={`px-4 py-2 text-white rounded ${memberLoading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {memberLoading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </>
      )}

      <h3 className="text-lg font-medium mb-2">Team Members</h3>
      {project.teamMembers.length > 0 ? (
        <ul className="list-disc pl-6 mb-4">
          {project.teamMembers.map((member) => (
            <li key={member._id} className="mb-2">
              {member.username}
              {isCreator && (
                <button 
                  onClick={() => removeMember(member._id)} 
                  disabled={memberLoading}
                  className={`ml-2 px-2 py-1 text-white rounded ${memberLoading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {memberLoading ? 'Removing...' : 'Remove'}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No team members added yet.</p>
      )}
    </div>
  );
}

export default ProjectDetails;
