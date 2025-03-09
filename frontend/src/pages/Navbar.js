// src/components/Navbar.js
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import '../styles/Navbar.css';
const Navbar = ({ logout }) => {
  const { authState } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="links">
        {!authState.status ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/registration">Registration</Link>
          </>
        ) : (
          <>
            <Link to="/">Home Page</Link>
            <Link to="/createpost">Create A Post</Link>
          </>
        )}
      </div>
      <div className="loggedInContainer">
        <h1>{authState.username}</h1>
        {authState.status && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
};

export default Navbar;
