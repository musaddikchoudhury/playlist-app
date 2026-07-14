import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PlaylistList() {

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [searchPlaylist, setsearchPlaylist] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists`)
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlaylists();
  }, []);


  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      if (!response.ok) throw new Error('Failed to create playlist');
      
      const newPlaylist = await response.json();
      
      setPlaylists([...playlists, newPlaylist]);
      
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  if (isLoading) return <p>Loading playlists...</p>;

 return (
    <div>
      <h2>All Playlists</h2>
      
      <form onSubmit={handleCreatePlaylist} className="card" style={{ maxWidth: '400px', marginBottom: '30px' }}>
        <h3>Create New Playlist</h3>
        <input type="text" placeholder="Playlist Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Create</button>
      </form>

      <input 
        type="text" 
        placeholder="Search playlists..." 
        value={searchPlaylist} 
        onChange={(e) => setsearchPlaylist(e.target.value)} 
        style={{ marginBottom: '20px', padding: '8px', width: '100%', maxWidth: '400px' }}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredPlaylists.length === 0 ? (
          <p>No playlists found!</p>
        ) : (
          filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="card flex-between">
              <div>
                <h3>{playlist.name}</h3>
                <p>{playlist.description}</p>
              </div>
              <Link to={`/playlists/${playlist.id}`}>
                <button className="secondary-btn">View Songs</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )};