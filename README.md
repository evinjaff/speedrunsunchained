# speedrunsunchained
 
This a rough prototype of my idea for a "speedrun" party game. The rough Alpha for this was written over my spring break at Wash U and still has a lot of fixes to be added.

<strong>Notice of University Involvement:</strong> This code was NOT created for a class at Washington University in St. Louis nor was any Washington University in St. Louis hardware used for development of "speedrunsunchained" source code. I did use my student Azure subscription to test if Azure free instances could run Django applications but only used a insignificantly refactored open-source Django Polls Application to test this.



## Technical summary

This application is built using two parallel applications, a community and a game that both access a common database.

I built the community application in Django. The SQLite database is directly generated by the Django models, so modification and expansion can easy be done running migration commands in Django.

The game application integrates with the SQLite database from the Django app, and is queryable via Node.js on that side. In order to protect from SQL injection, the database commands are executed on a Node.js server, and the data is transmitted upon request to the client via socket.io.

In its current phase, this is in alpha and is lacking in web security and thus has not yet been hosted online. This alpha is more of a proof-of-concept and more web security/polish is soon to come. I do NOT recommend hosting this to the world wide web yet and claim no responsibility if you get SQL injected, Hacked, or DDoS-ed. 

This application is also not very scalable in it's present state. In an ideal world, you could either build an implementation similar to Meta where you have many SQL server nodes that will "vote" on whether something exists based on their records, or use a distributed SQL server that would form one logical database to query from like Amazon Aurora.

## How to run this


### Community Site (Python)

#### The Easy Way

If you're running a setup that can support modern versions of python, this should be easy. For setting up the server, I used miniconda because I have a jupyter notebook that I use for importing sample games into the sqlite database. You can use my virtual environment by running this command.

```bash
conda env create -f data/environment.yml 
```

Then, you'll have to initialize the SQLite database by running

```bash
python3 game/manage.py migrate
```

And then finally, you can run the server using

```bash
python3 game/manage.py runserver [optional: IP address and port to run on]
```


Once you're past setup and ready to deploy, there's a text file at ```community/requirements.txt``` that you can install using pip. You can then use this package and pm2, cpanel, etc. for deploying your instance.


#### The Hard Way

If you're a broke college student like me who can't shell out money for a home server and have a free student version of Azure, you're going to have a hard time running this on legacy OSes because these Python-based web apps are kind of near the bleeding edge compared to your more stock PHP 7, and Node.js applications. I talk about this more in the wiki, so check that out if you want to know more. The requirements to run the Django application can be found inside the ```community/requirements.txt file```.

### Game Site (Node.js)

As for Node.js, I surprisingly didn't have any issues. Just run

 ```bash
 npm install
 ``` 

to install all the packages and then run

```bash
node node_server.js
```

to launch the server. You should see something served up on port 3456 on your default IP. It just seems like Node.js is just less bleeding edge, and it took way less struggle to get this running.

## Features

<strong>Current features</strong>

<ul>
    <li>Complex filtering of titles to choose challenges for by game, publication year, genre, etc. on the game website</li>
    <li>Basic filtering of Titles on the Community site.</li>
    <li>Dynamic Database refresh on database being updated</li>
    <li>Lightweight and Portable SQLite database </li>
    <li>Lightweight-ish Socket.io Server</li>
</ul>

<strong>Potential Future Features</strong>

<ul>
    <li> ??? CSS ??? </li>
    <li>Ability to comment, upvote, and discus challenges on the Community app</li>
    <li>Ability to submit challenges to the community website</li>
    <li>The option for team challenges where you have a 2v2 match</li>
    <li>Ability to add in custom punishments/dares</li>
    <li>Dynamic game title filtering</li>
    <li>Dockerfile & Docker-ized versions</li>
</ul>

## Special Thanks

<ul>
    <li>To Todd Sproull and his amazing CSE330 wiki. The wiki inspired me to learn Django, and most of the skills used for this come from taking CSE 330.</li>
    <li>To all my (future) beta testers. </li>
    <li>Christian and Max, only a good friend would let me ramble for 1 hour about my idea</li>
</ul>