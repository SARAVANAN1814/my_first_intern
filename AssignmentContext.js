import React, { createContext, useState } from 'react';

export const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);

  const addAssignment = (newAssignment) => {
    setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
  };

  return (
    <AssignmentContext.Provider value={{ assignments, addAssignment }}>
      {children}
    </AssignmentContext.Provider>
  );
};
