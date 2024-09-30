import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleTeacherLogin = () => {
    navigate('/assignment');
  };

  const handleStudentLogin = () => {
    navigate('/student-dashboard');
  };

  return (
    <div style={styles.container}>
      <h1>Login Page</h1>
      <button onClick={handleTeacherLogin} style={styles.button}>
        Teacher Login
      </button>
      <button onClick={handleStudentLogin} style={styles.button}>
        Student Login
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
};

export default Login;
