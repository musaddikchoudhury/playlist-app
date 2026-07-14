const express = require('express');
const cors = require('cors'); 
const { Playlist, Song } = require('./models');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/playlists', async (req, res) => {
  try {
    const playlists = await Playlist.findAll();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/playlists/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id, {
      include: [Song] 
    });
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/playlists', async (req, res) => {
  try {
    const newPlaylist = await Playlist.create(req.body);
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(400).json({ error: 'Bad request - check your input' });
  }
});


app.post('/playlists/:id/songs', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const newSong = await Song.create({
      title: req.body.title,
      artist: req.body.artist,
      duration: req.body.duration,
      PlaylistId: playlist.id 
    });

    res.status(201).json(newSong);
  } catch (error) {
    res.status(400).json({ error: 'Bad request - check your input' });
  }
});

app.delete('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    await song.destroy(); 
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/playlists/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    await playlist.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/playlists/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    await playlist.update({
      name: req.body.name,
      description: req.body.description
    });

    res.json(playlist);
  } catch (error) {
    res.status(400).json({ error: 'Bad request - check your input' });
  }
});

Playlist.sync({ alter: true })
  .then(() => {
    console.log("Playlists table created/updated!");
    return Song.sync({ alter: true }); 
  })
  .then(() => {
    console.log("Songs table created/updated!");
  })
  .catch((err) => {
    console.error("Database sync error:", err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});