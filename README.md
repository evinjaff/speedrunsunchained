# speedrunsunchained
 
This a rough prototype of my speedrun game idea.

I built the community application in Django with a SQLite database. The game application integrates with the SQLite databse from the Django app, and is queryable via Node.js on that side. In order to protect from SQL injection, the database commands are executed on a Node.js server, and the data is tramsitted upon request to the client via socket.io.

## My Vision: Dual Community - Game Feedback Loop

[An image is to here soon]
