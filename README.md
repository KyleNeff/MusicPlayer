# MusicPlayer

This full stack project focuses on creating a Spotify-like music player that generates a recommendation playlist based on the user's music preferences. The backend uses SQL to store all the songs, while the frontend is built with HTML and JavaScript. The music recommendation system is developed in Python and connected to the frontend using Flask.

The website includes various features, the majority of the website is primarily only on the frontend and not fully integrated. The functional buttons with full integration are: Liked Songs, 2023 Playlist, Search Bar, Home Screen, and Discover Music.

The core of this project is the music recommendation system. It uses a collaborative filtering approach, creating a co-occurrence matrix of the user's songs and all songs in the database. Collaborative filtering operates on the principle that users with similar music tastes will have similar song preferences. For instance, if User 1 and User 2 have a high similarity in their song choices, it's likely they share similar music tastes. Therefore, songs that User 1 listens to, but User 2 hasn't discovered yet, can be recommended to User 2.
