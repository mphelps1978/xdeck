const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/posts/:keyword', async (req, res) => {
  try {
    const data = await fs.readFile('./mockData.json', 'utf8');
    const posts = JSON.parse(data);
    // Normalize keyword: remove '#' if present and convert to lowercase
    const normalizedKeyword = decodeURIComponent(req.params.keyword)
      .replace(/^#/, '')
      .toLowerCase();
    if (!normalizedKeyword) {
      return res.status(400).json({ error: 'Keyword cannot be empty' });
    }
    const filteredPosts = posts.filter(post =>
      post.content.toLowerCase().includes(normalizedKeyword)
    );
    res.json(filteredPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));