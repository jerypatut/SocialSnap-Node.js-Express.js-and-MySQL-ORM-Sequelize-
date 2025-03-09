import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import '../styles/Home.css';
function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3001/posts', {
          headers: { accessToken: token },
        })
        .then((response) => {
          console.log(response.data);
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(response.data.likedPosts.map((like) => like.PostId));
        })
        .catch((error) => console.error('Error fetching posts:', error));
    }
  }, [authState, navigate]);

  const likeAPost = (postId) => {
    axios
      .post(
        'http://localhost:3001/likes',
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem('accessToken') } },
      )
      .then((response) => {
        setListOfPosts((prevList) =>
          prevList.map((value) => {
            if (value.id === postId) {
              return {
                ...value,
                Likes: response.data.liked
                  ? [...value.Likes, 0]
                  : value.Likes.slice(0, -1),
              };
            }
            return value;
          }),
        );

        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.includes(postId)
            ? prevLikedPosts.filter((id) => id !== postId)
            : [...prevLikedPosts, postId],
        );
      })
      .catch((error) => console.error('Error liking post:', error));
  };

  return (
    <div>
      {listOfPosts.map((value) => (
        <div key={value.id} className="postHome">
          <div className="title">{value.title}</div>
          <div className="body" onClick={() => navigate(`/post/${value.id}`)}>
            {value.postText}
          </div>
          {value.image && (
            <div className="image-card">
              <img
                src={`http://localhost:3001${value.image}`}
                alt={value.title}
              />
            </div>
          )}
          <div className="footer">
            <div className="username">{value.username}</div>
            <div className="buttons">
              <ThumbUpAltIcon
                onClick={() => likeAPost(value.id)}
                className={
                  likedPosts.includes(value.id) ? 'unlikeBttn' : 'likeBttn'
                }
              />
              <label>{value.Likes.length}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
