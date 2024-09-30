import React, { useContext, useEffect, useState } from 'react';
import { AssignmentContext } from './AssignmentContext';
import { gapi } from 'gapi-script';

const StudentDashboard = () => {
  const CLIENT_ID = '837033908842-evp9tvh4sfihnq7s8plukt9u8osc7h0l.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyB2OFavCFumlf4_ZSJL_YDPTFIJ152N74A';
  const SCOPES = 'https://www.googleapis.com/auth/drive.file';

  const { assignments } = useContext(AssignmentContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studentSubmissions, setStudentSubmissions] = useState({});
  const [uploadMessages, setUploadMessages] = useState({});
  const [studentComments, setStudentComments] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [workUploaded, setWorkUploaded] = useState({});

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      }).then(() => {
        console.log("Google API client initialized");
      }).catch((error) => {
        console.error("Error initializing Google API client: ", error);
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const handleUpload = (assignmentId, endDateTime, canPostDeadline) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,image/*';

    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setStudentSubmissions((prev) => ({
          ...prev,
          [assignmentId]: file,
        }));

        let message = 'File uploaded successfully!';
        if (canPostDeadline && currentDate > endDateTime) {
          message = 'File uploaded after the due time';
        }

        setUploadMessages((prev) => ({
          ...prev,
          [assignmentId]: message,
        }));

        setWorkUploaded((prev) => ({
          ...prev,
          [assignmentId]: true,
        }));

        setSubmissionStatus((prev) => ({
          ...prev,
          [assignmentId]: false,
        }));
      }
    };

    fileInput.click();
  };

  const handleAssignmentSubmit = async (assignmentId) => {
    const file = studentSubmissions[assignmentId];

    if (!file) {
      alert("Please upload a file before submitting.");
      return;
    }

    try {
      await gapi.auth2.getAuthInstance().signIn();

      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: ['1v9cgGldAuHTGVTAAXLjV8ofkMednizP3'],
      };

      const form = new FormData();
      form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      form.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: new Headers({
            Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
          }),
          body: form,
        }
      );

      if (response.ok) {
        alert('Assignment submitted successfully and uploaded to Google Drive!');
        setSubmissionStatus((prev) => ({
          ...prev,
          [assignmentId]: true,
        }));
      } else {
        alert('Error uploading assignment');
      }
    } catch (error) {
      console.error('Error during Google Drive upload:', error);
      alert('Error uploading assignment');
    }
  };

  const handleDelete = (assignmentId) => {
    setStudentSubmissions((prev) => {
      const updatedSubmissions = { ...prev };
      delete updatedSubmissions[assignmentId];
      return updatedSubmissions;
    });

    setUploadMessages((prev) => {
      const updatedMessages = { ...prev };
      delete updatedMessages[assignmentId];
      return updatedMessages;
    });

    setStudentComments((prev) => {
      const updatedComments = { ...prev };
      delete updatedComments[assignmentId];
      return updatedComments;
    });

    setSubmissionStatus((prev) => {
      const updatedStatus = { ...prev };
      delete updatedStatus[assignmentId];
      return updatedStatus;
    });

    setWorkUploaded((prev) => {
      const updatedWorkUploaded = { ...prev };
      delete updatedWorkUploaded[assignmentId];
      return updatedWorkUploaded;
    });
  };

  const handleCommentChange = (assignmentId, comment) => {
    setStudentComments((prev) => ({
      ...prev,
      [assignmentId]: comment,
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.fixedHeader}>
        <h1>Student Dashboard</h1>
        <p>Welcome to the student dashboard. Below are the created assignments:</p>
      </div>

      <div style={styles.assignmentList}>
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => {
            const endDateTime = new Date(assignment.endDate);
            let isPastDeadline = endDateTime < currentDate;

            if (assignment.permissions.postDeadline) {
              const extendedDeadline = new Date(endDateTime);
              extendedDeadline.setHours(extendedDeadline.getHours() + 12);
              isPastDeadline = extendedDeadline < currentDate;
            }

            const canReupload = assignment.permissions.reupload;
            const canComment = assignment.permissions.comment;

            return (
              <div key={index} style={styles.assignmentCard}>
                <h3>{assignment.assignmentName}</h3>
                <p>Start Date: {assignment.startDate}</p>
                <p>End Date: {assignment.endDate}</p>
                <p>Max Mark: {assignment.score}</p>

                {assignment.referenceDocName && assignment.referenceDocURL && (
                  <p>
                    Reference Document: <a href={assignment.referenceDocURL} target="_blank" rel="noopener noreferrer">{assignment.referenceDocName}</a>
                  </p>
                )}

                {assignment.permissions.postDeadline && (
                  <p>Post submission allowed within 12 hrs of due time</p>
                )}
                {canComment && (
                  <p>Comments Allowed</p>
                )}
                {canReupload && (
                  <p>Students can re-upload submissions.</p>
                )}

                <button
                  style={isPastDeadline ? { ...styles.addWorkButton, ...styles.disabledButton } : styles.addWorkButton}
                  disabled={isPastDeadline || workUploaded[assignment.assignmentName]}
                  onClick={() => handleUpload(assignment.assignmentName, endDateTime, assignment.permissions.postDeadline)}
                >
                  {isPastDeadline ? 'Upload Closed' : workUploaded[assignment.assignmentName] ? 'Work Uploaded' : 'Add Your Work'}
                </button>

                {studentSubmissions[assignment.assignmentName] && (
                  <div style={styles.submissionContainer}>
                    <p>Uploaded File: {studentSubmissions[assignment.assignmentName].name}</p>
                    {canReupload && (
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(assignment.assignmentName)}
                      >
                        Delete Submission
                      </button>
                    )}
                  </div>
                )}

                {uploadMessages[assignment.assignmentName] && (
                  <p style={styles.uploadMessage}>{uploadMessages[assignment.assignmentName]}</p>
                )}

                {canComment && studentSubmissions[assignment.assignmentName] && (
                  <div style={styles.commentContainer}>
                    <textarea
                      placeholder="Write your comment here..."
                      value={studentComments[assignment.assignmentName] || ''}
                      onChange={(e) => handleCommentChange(assignment.assignmentName, e.target.value)}
                      style={styles.commentBox}
                    />
                  </div>
                )}

                <div style={styles.buttonSpacer}></div>

                <button
                  style={styles.submitButton}
                  onClick={() => handleAssignmentSubmit(assignment.assignmentName)}
                  disabled={submissionStatus[assignment.assignmentName] === true}
                >
                  {submissionStatus[assignment.assignmentName] ? 'Assignment Submitted' : 'Submit Assignment'}
                </button>
              </div>
            );
          })
        ) : (
          <p>No assignments created yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '100vw',
    height: '100vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
    paddingTop: '100px',
    backgroundColor: '#f0f0f0',
  },
  fixedHeader: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  assignmentList: {
    marginTop: '20px',
    width: '80%',
    margin: '0 auto',
  },
  assignmentCard: {
    backgroundColor: '#fff',
    padding: '15px',
    margin: '20px 0',
    borderRadius: '8px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  },
  addWorkButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  submissionContainer: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  uploadMessage: {
    color: 'green',
    marginTop: '10px',
  },
  commentContainer: {
    marginTop: '15px',
  },
  commentBox: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  buttonSpacer: {
    marginBottom: '20px',
  },
  submitButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default StudentDashboard;
