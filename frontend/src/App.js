import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [keywords, setKeywords] = useState(['news', 'tech']); // Default keywords
  const [newKeyword, setNewKeyword] = useState('');
  const [posts, setPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Fetch posts for each keyword
  useEffect(() => {
    keywords.forEach(keyword => {
      axios.get(`http://localhost:5000/api/posts/${keyword}`)
        .then(response => {
          setPosts(prev => ({ ...prev, [keyword]: response.data }));
        })
        .catch(error => console.error(`Error fetching posts for ${keyword}:`, error));
    });
  }, [keywords]);

  // Add new keyword
  const addKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  // Open reply modal
  const openReplyModal = (post) => {
    setSelectedPost(post);
    setReplyText(`Replying to ${post.user}: `);
  };

  // Simulate posting reply
  const postReply = () => {
    alert(`Posting reply: ${replyText}`);
    setSelectedPost(null);
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Keyword Input */}
      <div className="mb-4">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="p-2 bg-gray-800 rounded mr-2"
          placeholder="Enter keyword..."
        />
        <button onClick={addKeyword} className="bg-blue-600 p-2 rounded">
          Add Column
        </button>
      </div>

      {/* Columns */}
      <div className="flex space-x-4 overflow-x-auto">
        {keywords.map(keyword => (
          <div key={keyword} className="w-80 bg-gray-800 rounded p-4">
            <h2 className="text-lg font-bold mb-2">{keyword}</h2>
            {posts[keyword]?.map(post => (
              <div key={post.id} className="mb-4 p-2 bg-gray-700 rounded">
                <p><strong>{post.user}</strong>: {post.content}</p>
                <button
                  onClick={() => openReplyModal(post)}
                  className="text-blue-400 text-sm mt-1"
                >
                  Reply
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded w-96">
            <h2 className="text-lg font-bold mb-2">Reply to {selectedPost.user}</h2>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded mb-2"
              rows="4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-gray-600 p-2 rounded"
              >
                Cancel
              </button>
              <button onClick={postReply} className="bg-blue-600 p-2 rounded">
                Post Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;