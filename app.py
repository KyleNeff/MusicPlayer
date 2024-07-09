from flask import Flask, request, render_template, jsonify, redirect, url_for
import mysql.connector
import pandas as pd
import numpy as np
import Recommenders as Recommenders
from flask_cors import CORS
import shutil
import csv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Connect to MySQL database
def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="MusicRecPassword",
        database="music_recommendations"
    )
    return connection

# Home Page
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/search/')
def search():
    search_term = request.args.get('searchSong')
    connection = get_db_connection()
    
    with connection.cursor() as cursor:
        sql = "SELECT DISTINCT song FROM songs WHERE song LIKE %s LIMIT 5"
        cursor.execute(sql, ('%' + search_term + '%',))
        results = cursor.fetchall()
        
    connection.close()
    return render_template('search.html', comments=results)


@app.route('/2023playlist/')
def playlist2023():
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "SELECT * FROM playlist1;"
        cursor.execute(sql)
        results = cursor.fetchall()
        
    connection.close()
    return render_template('2023Playlist.html',comments=results)


@app.route('/likedSongs/')
def likedSongs():
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "SELECT * FROM songs WHERE Username = 'mremond';"
        cursor.execute(sql)
        results = cursor.fetchall()
    connection.close()
    return render_template('likedSongs.html',comments=results)
    

@app.route('/discover/')
def discover():
    return render_template('discover.html')


@app.route('/recommend_song')
def process_song_data():
    songs = pd.read_csv('songs.csv')
    ir = Recommenders.item_similarity_recommender_py()
    ir.create(songs, 'Username', 'song')
    outputSongs = ir.recommend("mremond")

    outputSongs = outputSongs.to_json(orient="records")

    # print(outputSongs)
    return jsonify(outputSongs)

# Get everything from database and create new csv with songGrouped2 and playlist having listenCount as 1 and user as tempUser. Then delete
@app.route('/recommend_playlist')
def makeRecPlaylist():
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "SELECT * FROM playlist1;"
        cursor.execute(sql)
        results = cursor.fetchall()

    with open('songs.csv', 'a', newline='') as f:
        c = csv.writer(f)
        for x in results:
            print("X value: ",x)
            c.writerow(x)

    songs = pd.read_csv('songs.csv')
    ir = Recommenders.item_similarity_recommender_py()
    ir.create(songs, 'Username', 'song')
    outputSongs = ir.recommend("playlist1")

    outputSongs = outputSongs.to_json(orient="records")

    # Drop the number of rows we got from the SQL query
    df = pd.read_csv('songs.csv')
    df.drop(df.tail(len(results)).index, inplace=True)
    # Slight workaround. Save to temp file and replace
    temp_filename = 'temp_songGrouped2.csv'
    df.to_csv(temp_filename, index=False)
    f.close()
    shutil.move(temp_filename, 'songs.csv')

    return jsonify(outputSongs)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
