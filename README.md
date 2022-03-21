# speedrunsunchained
 
This a rough prototype of my idea for a "speedrun" party game. The rough Alpha for this was written over my spring break at Wash U and still has a lot of fixes to be added.

## My Vision: Dual Community - Game Feedback Loop

[An image is to be added here soon]

The basic concept is the idea of a positive feedback loop. There's a reddit-like community where people can post challenges for video games, and people upvote them or downvote them based on how good they think they are. People also have the chance to vote on how hard they think the challenge is as well as how long they think it would take. The idea then being that with this score, the good responses float to the top. The community page is intended to act as more of a "data-builder" because the data obtained from the community is then used for the game. The idea being then that if people playing the game have an idea for a challenge, they can post it, and then their idea might attract more people to the platform. 

The way the game works is pretty simple, you can apply some filters for which games you want to see, you indicate how many players and rounds you want to play with, and hopefully you could even indicate if you wanted to add in dares or punishments for each one. Then, you'll get a prompt like:

```
Round 1: Evin vs Max

In the game Mario Super Sluggers (2008, Wii)

The first person to hit a "dinger" (animated home run animation) in a match against each other gets a point.

```

You will then play out each 1v1 challenge until a winner is crowned.

## Technical summary

This application is built using two parallel applications, a community and a game that both access a common database.

I built the community application in Django. The SQLite database is directly generated by the Django models, so modification and expansion can easy be done running migration commands in Django.

The game application integrates with the SQLite database from the Django app, and is queryable via Node.js on that side. In order to protect from SQL injection, the database commands are executed on a Node.js server, and the data is transmitted upon request to the client via socket.io.

In its current phase, this is in alpha and is lacking in web security and thus has not yet been hosted online. This alpha is more of a proof-of-concept and more web security/polish is soon to come. I do NOT recommend hosting this to the world wide web yet and claim no responsibility if you get SQL injected, Hacked, or DDoS-ed. 

This application is also not very scalable in it's present state. In an ideal world, you could either build an implementation similar to Meta where you have many SQL server nodes that will "vote" on whether something exists based on their records, or use a distributed SQL server that would form one logical database to query from like Amazon Aurora.

## How to run this

The requirements to run the Django application can be found inside the community/requirements.txt file. This .txt file is just a raw export of all my Python packages from pip so if you aren't able to satisfy all the requirements you might still be fine. I would specifically make sure that you run version 4.0.2 of Django and that your installation of Python is new enough to include sqlite 3.9 (NOTE: This will become really important later). After testing enough implementations, I will eventually probably just form a wiki for this.


### Running Django and Node.js on an RHEL 7 Azure Free instance

If you like Azure and are cheap, I've got some bad news for you. I could not get this to run on a free instance of Azure. I chose to use RHEL 7 since I am more familiar with using yum. I think Django 4.0.2 is just too cutting edge for RHEL 7. I even attempted to compile and link a newer version of python to satisfy the SQLite requirement, but it failed to compile. I'm sure a sysadmin could probably get this to work, and I bet on RHEL 8 this would be super easy, but Azure seems to artificially limit you to RHEL 7 for a free instance. I did not try getting Node.js installed considering Python failed, but I would assume it is possible

### Running Django and Node.js on a Free T.2 Micro EC2 with Amazon Linux 2

It is very hard to get this to run, but it is possible! I had to compile Python 3.9 from source and then link this file into my path. I only ran it as root, which is bad practice, but you could easily port over my strategy if you wanted to use PM2 or another user to manage the application. 

### Running Django and Node.js on a Potato

Coming soon!

I got my hands on a really old desktop (Core 2 Quad Q6600, 3 GB DDR2 555 MHz, 160GB HDD). I might take a weekend to try and see if I can install Ubuntu Server and try to get it running. I suspect that this will turn out poorly, as the Core 2 Quad will not have x86_64 instructions like POPCNT available.

I may also see if a Raspberry Pi could host this application and might build a small cluster like Jeff Geerling. I have no idea if Django even supports ARM64, but I would assume that most Python modules will support ARM64.

## Features

<strong>Current features</strong>

<ul>
    <li>Complex filtering of titles to choose challenges for by game, publication year, genre, etc.</li>
    <li>Basic filtering of challenges by duration</li>
    <li>Dynamic Database refresh on database being updated</li>
    <li>Lightweight and Extremely modular SQLite database </li>
    <li>Lightweight Socket.io Server</li>
</ul>

<strong>Potential Future Features</strong>

<ul>
    <li> ✨ CSS ✨ </li>
    <li>Ability to comment, upvote, and discus challenges on the Django app</li>
    <li>The option for team challenges where you have a 2v2 match</li>
    <li>Ability to add in custom punishments/dares after each match</li>
    <li>Dynamic game title filtering</li>
    <li>Dockerfile & Docker-ized versions</li>
    <li>Compatibility with IE11 and Safari (one of these is much easier than the other)</li>
</ul>

## Special Thanks

<ul>
    <li>To Todd Sproull and his amazing CSE330 wiki. The wiki inspired me to learn Django, and most of the skills used for this come from taking CSE 330.</li>
    <li>To all my (future) beta testers. </li>
    <li>Christian and Max, only a good friend would let me ramble for 1 hour about my idea</li>
</ul>



### An appendix on music to jam out to

I know that no ever mentions it, but I wanted to say that I chose to jam out to these songs when I was building the alpha over spring break among more.

<ul>
    <li>It has to be this way - Metal Gear Rising Revengeance</li>
    <li>Fear Factory (Kremroc Industries) - Donkey Kong Country (SNES)</li>
    <li>Uragirimonono Requiem - Diavolo Version</li>
    <li>Death Stranding - CHVRCHES</li>
    <li>Fighting Gold (Instrumental) - Coda</li>
    <li>Wake Up - Rage Against the Machine</li>
    <li>Jolyne's Theme x Traitor's Requiem - Samuel Kim Music</li>
</ul>