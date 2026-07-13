import { Routes, Route } from 'react-router-dom';
import PlaylistList from './pages/PlaylistList';
import PlaylistDetail from './pages/PlaylistDetail';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Playlist App</h1>
      <hr />
      
      <Routes>
        <Route path="/" element={<PlaylistList />} />
        
        <Route path="/playlists/:id" element={<PlaylistDetail />} />
      </Routes>
    </div>
  );
}

export default App;