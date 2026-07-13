const { db, Playlist, Song } = require('./models');

async function seedDatabase() {
  try {
    await db.sync({ force: true });
    console.log('Tables created successfully!');

    const gymPlaylist = await Playlist.create({
      name: 'Workout Hype',
      description: 'High energy tracks for lifting.'
    });

    await Song.create({
      title: 'Stronger',
      artist: 'Kanye West',
      duration: 311, 
      PlaylistId: gymPlaylist.id 
    });

    await Song.create({
      title: 'Eye of the Tiger',
      artist: 'Survivor',
      duration: 244, 
      PlaylistId: gymPlaylist.id
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(); 
  }
} 

seedDatabase();