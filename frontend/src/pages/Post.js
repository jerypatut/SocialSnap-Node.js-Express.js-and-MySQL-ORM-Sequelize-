import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import '../styles/Post.css';
function Post() {
  const { id } = useParams(); // 'id' merupakan postId
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  // Tambah komentars
  const addComment = () => {
    axios
      .post(
        'http://localhost:3001/comments',
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment('');
        }
      });
  };
  // Hapus komentar
  const deleteComment = (commentId) => {
    axios
      .delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem('accessToken') },
      })
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId),
        );
      })
      .catch((error) => console.error('Error deleting comment:', error));
  };

  // Hapus post
  const deletePost = () => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem('accessToken') },
      })
      .then(() => navigate('/'))
      .catch((error) => console.error('Error deleting post:', error));
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title">{postObject.title}</div>
          <div className="body">{postObject.postText}</div>
          <div className="image-card">
            <img
              src={`http://localhost:3001${postObject.image}`}
              alt={postObject.title}
            />
          </div>
          <div className="footer">
            <span>{postObject.username}</span>
            {authState.username === postObject.username && (
              <button onClick={deletePost}>Delete Post</button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>tambahkan Comment</button>
        </div>
        <div className="listOfComments">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.commentBody}</p>
                <label>Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button onClick={() => deleteComment(comment.id)}>X</button>
                )}
              </div>
            ))
          ) : (
            <p className="noComments">Belom ada comment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
