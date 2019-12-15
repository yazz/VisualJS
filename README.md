
# Yazz Pilot
We had a fun few days this week when Yazz Pilot got to the front page of Hacker News and stayed there for a couple of days:

https://news.ycombinator.com/item?id=21734845

I have been working on Pilot on and off for many years now. The tool is supposed to be a Visual basic style drag and drop GUI builder for enterprise apps. the interesting part of the backstory is that this is my 7th attempt to build this!

I first thought about building a web based development tool since I was at University where I built a Hypercard style development tool called OpenPage (using C++ on Solaris) as my Computer Science project which scored as one of the highest projects of the year at Manchester University, UK (1994). My beginners confidence didn't carry on into anything concrete though, until 2000, when I wrote the second version in Java, but this didn't go anywhere. For a third version I tried to develop this in Javascript, Ruby and Sintra in 2007, but I didn't realise how difficult a problem this was. Also, in 2008 a fourth attempt was made where I tried again in Erlang, but it didn't go anywhere. So I hung up my boots and then in 2013 after building a startup NemCV with Franco Soldera I tried a fifth time and built a Clojure/Clojurescript based tool called Clojure on Coils, which was pretty cool, but most people thought it was a joke (There is a video somewhere online with people joking about it). Eventually after a couple of years I realised that I didn't understand the problem well enough, so for attempt six decided to outsource the problem by investing in a project by Chris Granger and Rob Attori, called LightTable/Eve. They tried to solve the problem of building a usable development system, but by 2018, they too realised that this was a huge task, and very hard to monetise (Chris Granger then moved to Looker which was Acquired by Google).

So, I took a step back and realised that I now had a lot of knowledge about the subject, but needed to find a way to build something that can be commercially viable as an entry point, as this is a problem that 10,000s of companies have tackled and failed at (since the 1980s - just pick up a 1980s edition of Personal Computer to see many companies attempting the same thing). So I am now taking baby steps with a seventh attempt, by building a tool for enterprise users to build small webapps which can integrate with other systems, based on the look and feel of one of my favorite products of all time, Visual Basic 6. The product is called Pilot, and has a simple VB style editor, and allows you to build GUI apps, and microservices. It uses a simple component model based on 1 Javascript function per component, for both server side and front end components. It uses NodeJS, SQLite, and VueJS. It used to run as an Electron dekstop app but the I decided to dump Electron once I made Pilot container native so that it can run on Docker, Kubernetes, OpenShift, and Ubuntu Snap, as Electron would make the container runtimes too large. So the big focus now is to make alot of integrations so that people who work in large enterprises can build a GUI really fast on top of 3Scale, Mulesoft, Kong, Rest APIs, Postgres or other enterprise stuff.

There have been many people involved in this project and I give my thanks to them, since they have written alot of the code. Unfortunately I am the only person who is happy to put my name to the commits as I have a very forward thinking employer, Red Hat, although there have been major contributors from Google and Microsoft as well. Also, I must stress that this project and the views of myself and other team members in no way represents the views of our employers at Red Hat, Google, or Microsoft.

The project is still very rough around the edges, but please feel free to reach out to me on the Slack channel (link at the botto of the readme) for any questions that you may have.


<br/><br/><br/>
## Self Service apps without the IT department


Pilot is a tool to create and run internal web based tools or micro services. There is a demo at:
https://yazz.com/app/homepage.html

- Build apps in minutes with drag and drop interface and code business logic in Javascript
- One click deploy to Docker or Kubernetes
- Open source MIT license
- Can run in Docker, Kubernetes, or OpenShift
- Runs locally on Mac, Windows, Linux, Raspberry PI using NodeJS
- Can be run as a Snap Package on Linux

<br/><br/><br/>
## Join our Slack group
https://yazz-workspace.slack.com

<br/><br/><br/>
## Quick examples 
### Upload a Microservice from a Javascript file

First you need to install Yazz Pilot, assuming you have NodeJS installed and have downloaded the GIT repo.

> &gt; cd pilot

> &gt; npm install
    
```
... some NodeJS stuff runs here to install Pilot ...
``` 

Then you run the Pilot server.

> &gt; node src/electron.js 

```
......................................................................................................
Yazz Pilot started on:
http://localhost:3000
```

Upload a sample Pilot microservice that we will upload.

> &gt; cat a.js
    
```
function(args) {  
    /* 
    rest_api('test3') 
    */ 

    return {ab: 163}
}
```
    
> &gt; curl -F 'file=@a.js' http://localhost:3000/file_upload
    
Finall browse to the following URL in your browser to see the microservice running:

    http://localhost:3000/test3
    




<br/><br/><br/>
## Starting the Yazz Pilot server

### Run from docker:

    docker run -p 80:3000 -d zubairq/pilot



<br/><br/><br/>
### Run as a Snap package on Linux:

    snap install --devmode --edge pilot

    pilot

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/pilot)





<br/><br/><br/>
### Docker Quick start (with Docker deploy enabled)
##### 1) Download and run Docker
##### 2) Expose the Docker REST api on port 1234 with:
    docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:1234:1234 bobrik/socat TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/docker.sock
##### 3) Install and run the Pilot IDE with:
    docker run -p 80:3000 -d zubairq/pilot

##### 4) Go to a browser and view Pilot:
    http://localhost





<br/><br/><br/>
### Run Yazz Pilot on Linux

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/pilot.git
##### 4) Go to the "pilot" directory
    cd pilot
##### 5) Install the NodeJS modules
    sudo npm install
##### 6) Run the Pilot NodeJS application
    node src/electron.js






<br/><br/><br/>
### Run Yazz Pilot on Windows

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/pilot.git
##### 4) Go to the Pilot directory
    cd pilot
##### 5) Install the NodeJS modules
    npm install
##### 6) Run as Node.js application with browser based access
     node src\electron.js 





<br/><br/><br/>
### Run Yazz Pilot on Mac
##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/pilot.git
##### 4) Go to the Pilot directory
    cd pilot
##### 5) Install the NodeJS modules
    npm install
##### 6) Run as Node.js application with browser based access
     node src/electron.js









<br/><br/><br/>
## Command line options:

    --help                 output usage information
    --version              output the version number
    --port                 Which port should I listen on? Default 80 or 3000 (if not run as sudo)
    --host                 Server address of the central host (default is local machine IP address)
    --locked               Allow server to be locked/unlocked on start up to other machines in intranet (default true)
    --deleteonexit         Delete database files on exit (default false)
    --deleteonstartup      Delete database files on startup (default false)
    --runapp               Run using a local app on startup (default not set). "homepage" often used
    --https                Run using a HTTPS (default is false)
    --private              Private HTTPS key location
    --public               Public HTTPS certificate location
    










<br/><br/><br/>
### FAQ

#### What is Yazz Pilot's killer feature?
Pilot's killer feature is being able to Simple applications in minutes, without having to setup Jenkins pipelines, Git, or anything else. It is ideal for demos or small throwaway apps.

#### Is there commercial support for Pilot?
If you require commercial support then please go to https://yazz.com

#### Is there community for Pilot?
You can be the first to join us here http://yazz-workspace.slack.com
