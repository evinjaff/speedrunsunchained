import pandas as pd
import sqlite3
import datetime

df = pd.read_csv('gamesales.csv')

df_minned = df[['Name', 'Platform', 'Genre', 'Year', 'Publisher']].dropna()

df_minned['Year'] = df_minned['Year'].astype('int')

df_minned = df_minned.rename(columns=\
{"Year": "year_published", "Platform": "console", "Name": "game_title", "Publisher": "tagblob" , "Genre": 'genre'})

df_minned['pub_date'] = datetime.datetime.now()

# Create a SQL connection to our SQLite database
con = sqlite3.connect("../community/db.sqlite3")

cur = con.cursor()

# let's make sure this works
for row in cur.execute('SELECT * FROM polls_game;'):
    print(row)

# Be sure to close the connection
con.close()

con = sqlite3.connect("../community/db.sqlite3")

df_minned.to_sql("polls_game", con, if_exists='append', index=False)

con.close()