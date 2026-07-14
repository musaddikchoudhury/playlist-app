import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function PlaylistDetail() {
  const { id } = useParams(); 
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setPlaylist(data);
        
        setEditName(data.name);
        setEditDescription(data.description);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaylist();
  }, [id]);

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDescription })
      });

      if (!response.ok) throw new Error('Failed to update playlist');
      
      const updatedData = await response.json();
      
      setPlaylist({ ...playlist, name: updatedData.name, description: updatedData.description });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to delete this entire playlist?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete playlist');
      navigate('/');
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists/${id}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, duration: parseInt(duration, 10) })
      });
      if (!response.ok) throw new Error('Failed to add song');
      const newSong = await response.json();
      setPlaylist({ ...playlist, Songs: [...playlist.Songs, newSong] });
      setTitle(''); setArtist(''); setDuration('');
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/songs/${songId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete song');
      setPlaylist({ ...playlist, Songs: playlist.Songs.filter((song) => song.id !== songId) });
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  if (isLoading) return <p>Loading playlist...</p>;
  if (!playlist) return <p>Playlist not found.</p>;

 return (
    <div>
      <Link to="/"><button className="secondary-btn" style={{ marginBottom: '30px' }}>Back to Playlists</button></Link>
      
      <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '20px' }}>
        {isEditing ? (
          <form onSubmit={handleUpdatePlaylist} className="card" style={{ width: '400px' }}>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit">Save</button>
              <button type="button" className="secondary-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{playlist.name}</h1>
            <p>{playlist.description}</p>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isEditing && <button className="secondary-btn" onClick={() => setIsEditing(true)}>Edit</button>}
          <button className="danger-btn" onClick={handleDeletePlaylist}>Delete Playlist</button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
        <div style={{ flex: 2 }}>
          <h3>Songs</h3>
          {playlist.Songs && playlist.Songs.length === 0 ? (
            <p>No songs yet. Add one!</p>
          ) : (
            <ul className="song-list">
              {playlist.Songs.map((song) => (
                <li key={song.id} className="song-item">
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{song.title}</strong> <br/>
                    <span style={{ color: 'var(--text-sub)' }}>{song.artist}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span>{formatDuration(song.duration)}</span>
                    <button className="danger-btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDeleteSong(song.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <form onSubmit={handleAddSong} className="card">
            <h3>Add a New Song</h3>
            <input type="text" placeholder="Song Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            <input type="number" placeholder="Duration (seconds)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Add Song</button>
          </form>
        </div>
      </div>
    </div>
  );
}
