import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './pages/Navbar'; // Import Navbar
import PageNotFound from './pages/PageNotFound';
import Post from './pages/Post';
import Registration from './pages/Registration';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { AuthContext } from './helpers/AuthContext';

function App() {
  const [authState, setAuthState] = useState({
    username: '',
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get('http://localhost:3001/auth/auth', {
        headers: { accessToken: localStorage.getItem('accessToken') },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => console.error('Error in auth:', error));
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuthState({ username: '', id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          {/* Pindahkan Navbar ke komponen terpisah */}
          <Navbar logout={logout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
