import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignmentContext } from './AssignmentContext';

const AssignmentForm = () => {
  const navigate = useNavigate();
  const { addAssignment } = useContext(AssignmentContext);
  const [assignmentName, setAssignmentName] = useState('');
  const [referenceDoc, setReferenceDoc] = useState(null);
  const [referenceDocURL, setReferenceDocURL] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [permissions, setPermissions] = useState({
    postDeadline: false,
    reupload: false,
    comment: false,
  });
  const [score, setScore] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceDoc(file);
      setReferenceDocURL(URL.createObjectURL(file));
    }
  };

  const handlePermissionChange = (e) => {
    setPermissions({
      ...permissions,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAssignment = {
      assignmentName,
      referenceDocName: referenceDoc ? referenceDoc.name : '',
      referenceDocURL,
      startDate,
      endDate,
      permissions,
      score,
    };

    addAssignment(newAssignment);

    setIsSubmitted(true);
  };

  const closeModal = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>ASSIGNMENT</h2>
        <hr />
        <p>Please provide the following information to proceed with the Assignment.</p>
        <div style={{ marginTop: '20px' }}>
          <label style={styles.label}>
            Assignment Name<sup style={styles.sup}>*</sup>:
          </label>
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Reference Document:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.row}>
          <div style={styles.smallField}>
            <label style={styles.label}>
              Start Date<sup style={styles.sup}>*</sup>:
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={styles.smallInput}
            />
          </div>
          <div style={styles.smallField}>
            <label style={styles.label}>
              End Date<sup style={styles.sup}>*</sup>:
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={styles.smallInput}
            />
          </div>
          <div style={styles.smallField}>
            <label style={styles.label}>
              Score<sup style={styles.sup}>*</sup>:
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              style={styles.smallInput}
            />
          </div>
        </div>
        <div>
          <h3 style={styles.permissionHeader}>Permission Details</h3>
          <p>Select the relevant permissions for this assignment.</p>
          <div style={styles.permissionGroup}>
            <input
              type="checkbox"
              name="postDeadline"
              checked={permissions.postDeadline}
              onChange={handlePermissionChange}
            />
            <label>Allow Post Deadline Submissions</label>
          </div>
          <div style={styles.permissionGroup}>
            <input
              type="checkbox"
              name="reupload"
              checked={permissions.reupload}
              onChange={handlePermissionChange}
            />
            <label>Allow Students to Re-upload Submissions</label>
          </div>
          <div style={styles.permissionGroup}>
            <input
              type="checkbox"
              name="comment"
              checked={permissions.comment}
              onChange={handlePermissionChange}
            />
            <label>Allow Students to Comment</label>
          </div>
        </div>
        <div style={styles.submitContainer}>
          <button type="submit" style={styles.button}>Confirm & Submit</button>
        </div>
      </form>
      {isSubmitted && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span style={styles.tick}>✔️</span>
            <h2>Assignment Created Successfully!</h2>
            <button onClick={closeModal} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '100vw',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  form: {
    width: '100%',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  smallInput: {
    width: '100%',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  smallField: {
    flex: '1',
    minWidth: '150px',
    marginRight: '10px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap',
  },
  submitContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  button: {
    width: '25%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  sup: {
    color: 'red',
  },
  divider: {
    marginTop: '30px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  permissionHeader: {
    fontWeight: 'bold',
    fontSize: '1.2em',
    marginBottom: '10px',
  },
  permissionGroup: {
    marginBottom: '15px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    position: 'relative',
  },
  tick: {
    fontSize: '2em',
    color: 'green',
  },
  closeButton: {
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AssignmentForm;
