
# Yazz Pilot
## Build internal web apps with a Visual Basic style IDE
Yazz Pilot is a drag and drop UI builder for building internal web apps, using JavaScript as the scripting language. The initial focus is to build web apps on top of 3Scale, Mulesoft, Kong, Rest APIs, Postgres or other enterprise stuff. There is a demo here (Only works on desktops and Chrome right now):

https://yazz.com/app/homepage.html
<br/><br/><br/>



## Benefits

- Build simple enterprise apps in minutes 
- Easy to get started as you wire UI components together in a UI, like Visual Basic, setting properties and reacting to events such as button clicks
- Reuse via pre built components such as buttons, text boxes, and data access components to talk to Postgres, Mysql, or REST APIs
<br/><br/><br/>




## Current Features

- Drag and drop UI interface
- Code business logic in Javascript
- Each app has a built in SQLite database
- Open source MIT license
- Can run in Docker, Kubernetes, or OpenShift, as a Snap package, or locally on Mac, Windows, Linux, Raspberry PI using NodeJS
- Can build Microservices
- All apps can be saved as a single .pilot file
- Apps can be saved as a single HTML file and sent by email (Even SQlite based apps) 
- All code is stored as immuntable, and identified by a SHA256 hash
- The Yazz editor and output programs can work offline without internet connectivity
- Extra UI or server components can be build as plugins (as .pilot files)
- The Yazz extensible IDE allows you to build new ways of editing code. Currently a text editor and a Visual Basic style editor are included
<br/><br/><br/>


## Future Features

- An App Store so that Enterprise users and third party ISVs can discover, create, buy, and sell Yazz components and apps
- A VR/AR editor
- Paid for hosting options 
- Support for Istio, Rancher, KNative, OpenWhisk, OpenFaas, AWS
- Machine Learning and vision components
- Enterprise connectivity via Red Hat, IBM, Salesforce, SAP, Oracle, Stripe, and other enterprise components
<br/><br/><br/>






## Quick examples
### Upload a Microservice from a Javascript file

First you need to run Yazz Pilot, assuming you have Docker installed:

> &gt; docker run -p 80:3000 -d zubairq/pilot

```
......................................................................................................
Yazz Pilot started on:
http://0.0.0.0:3000
```

Upload a micro-service:

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

Finally browse to the following URL in your browser to see the microservice running:

    http://0.0.0.0:3000/test3





<br/><br/><br/>
## Starting the Yazz Pilot server

### Run from docker:

    docker run -p 80:3000 -d zubairq/pilot

```
......................................................................................................
Yazz Pilot started on:
http://localhost:3000
```

<br/><br/><br/>
### Run as a Snap package on Linux

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
### Run Yazz Pilot on Linux, Mac, or Windows with NodeJS

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
## A long FAQ


### What is Yazz Pilot's killer feature?
Pilot's killer feature is being able to Simple applications in minutes, without having to setup Jenkins pipelines, Git, or anything else. It is ideal for demos or small throwaway apps.



### What is Yazz Pilot's long term vision?
Yazz Pilot's long term vision is to have an army of autonomous physical and virtual robots which can assist human kind. One example use case is small robots that can enter the bloodstream and cure diseases in realtime. Initial versions of Yazz may look like a simple app builder, but we actually believe in a world without apps. Building apps is just a necessary stepping stone to building fully autonomous robot helpers



### Why doesn't Yazz let me edit mutliple files as a tree like a traditional IDE?
Yazz breaks down all problems into components which are a single function. A component can call other components as well if needed



### Is Yazz Production ready? Who should use Yazz today?
Anyone wishing to build a web UI on top of a web service.




### How does Yazz relate to Visual Basic?
The author is a huge fan opf Visual Basic 6 and earlier, and the VBX/OCX component ecosystems that existed in the 1990s, so the author of Yazz is trying to recreate the Visual Basic 6 ecosystem in Javascript.



### What is the basic Unit of code in Yazz?
A component is the basic unit of code in Yazz, represented as a function in a .pilot text file.



### How does Yazz differ from Visual Basic?
The Visual basic style development environment in Yazz is just a Yazz component itself. Other development paradigms can also be built in, with a VR/AR development environment planned for the future using Oculus Quest and WebXR.



### How much will Yazz cost?
Yazz Pilot is free to download and use. We will be releasing a hosted version at some point.



### Does Yazz use AI?
Not yet, but AI is planned in the future for machine vision and learning algorithms. Also AI may be used to match component inputs and outputs and for intelligent code completion in the IDE.



### What does Yazz mean by Self Service?
When we say Self Service we mean that Yazz can be used by people who are not Professional programmers.



### Is there commercial support for Pilot?
If you require commercial support then please go to https://yazz.com

### I'm worried about vendor lock-in - what happens if Yazz goes out of business?
Yazz Pilot is Open Source so you can download the opensource repo or fork the Github repo.

### I'm worried about vendor lock-in - what happens if Yazz stays in business but I still need to move off?
Yazz is basewd on VueJS, HTML, and Javascript so you can slowly migrate to similar technologies in the ecosystem.

### I want to write libraries for Yazz - how can I take part in the Yazz community/ecosystem?
We will be releasing our dev guidelines soon.

### How does version control work in Yazz?
Yazz removes the complexity of separate version control systems like git. Changes to your code are structured using distributed diff algorithms.

### How does Yazz relate to Unison language
There is no relation except that both Unison and Yazz are based on the principal of immutable code.





### How does Yazz relate to StoryScript language
StoryScript is a Glue code for multiple languages, whereas Yazz is only one dialect of Javascript

### How does Yazz relate to Eve?
Some concepts of universality are taken from Eve

### How does Yazz relate to Microsoft?
One of the developers works at Microsoft full time

### How does Yazz relate to Google?
One of the developers works at Goole full time, related to new Operating System concepts and Fuchsia


### Why don't Google or Microsoft developers commit to  the GitHub repo directly?
They have their reasons. Plus, they HATE Javascript. They much prefer .NET, Dart, Go, Typescript, and other cool stuff!


### Every time I restart Yazz I can't see my apps. How to I save them?
You need to save the apps that you wish to keep by pessing the button "Save as .pilot file" fro the editor.


### I’m already invested in my editor, language, etc… Can I keep using them with Yazz?
Yazz's basic file format is text, so you can use any editor.

### How does Yazz compare to https://www.anytype.io/?
As of January 2020 AnyType is still closed source. Anytype does use IPFS for storage which is a technology, along with QRI that Yazz is considering for data storage.

### How does Yazz compare to Retool?
As of January 2020 Retool is a great SAAS offering


### Does Yazz work offline?
Yes! One of the great things about Yazz is that it can be run offline in your own datacenter, or on your own PC, totally disconnected from the internet. We have even seen Yazz running on a standalone disconnected Raspberry PI.


### How does Yazz compare to Bubble.io?
As of January 2020 Bubble is a hosted web app builder, one of the first great online CRUD app builders.

### Is there community for Pilot?
You can join us here http://yazz-workspace.slack.com



### Does programming really need a drag and drop UI framework? (long version)
**Michael Palin:** Ahh.. Very passable, this, very passable.<br/>
**Graham Chapman** Nothing like a good drag and drop framework to develop apps, ay Gessiah?<br/>
**Terry Jones** You're right there Obediah.<br/>
**Eric Idle** Who'd a thought thirty years ago we'd all be sittin' here building apps with our keyboard and mouse and a bit o' the ol' no code?<br/>
**MP** Aye. In them days, we'd a' been glad to have a text editor.<br/>
**GC** Emacs.<br/>
**EI** Without a terminal.<br/>
**TJ** OR a screen!<br/>
**MP** On an old beat up 486!<br/>
**EI** We never used to have a PC. We used to have to edit on a Commodore 64.<br/>
**GC** The best WE could manage was to type on a broken ZX81.<br/>
**TJ** But you know, we were happy in those days, though the tools were poor.<br/>
**MP** Aye. BECAUSE we were poor. My old boss used to say to me, 'Good development tools don't buy you happiness.'<br/>
**EI** 'E was right. I was happier coding in the old days when we had NOTHIN'. We used to code on punch cards in this beat up factory.<br/>
**GC** Factory? You were lucky to have a Factory! We used to code in one room, all five thousand of us, no desks or chairs. Half the floor was missing; we were all huddled together in one corner for fear of FALLING!<br/>
**TJ** You were lucky to have a ROOM! *We* used to have to code in a corridor!<br/>
**MP** Ohhhh we used to DREAM of codin' in a corridor! Woulda' been a palace to us. We used to code in an old water tank on a rubbish tip. We got into work and had to build the computers too! Corridor!? Hmph.<br/>
**EI** Well when I say 'corridor' it was only a hole in the ground covered by a piece of tarpolin, but it was a corridor to US.<br/>
**GC** We were evicted from **our** hole in the ground; we had to go and code in a lake!<br/>
**TJ** You were lucky to have a LAKE! There were a hundred and sixty thousand of us coding in a small shoebox in the middle of the road.<br/>
**MP** Cardboard box?<br/>
**TJ** Aye.<br/>
**MP** You were lucky. We coded for three months in a brown paper bag in a septic tank. We used to have to get up at six o'clock in the morning, build the computers, write the OS, code the business apps for fourteen hours a day week in-week out. When it wa' time to go home, our boss would thrash us with his belt!<br/>
**GC** Luxury. We used to have to get out of the lake at three o'clock in the morning, clean the lake, eat a handful of hot gravel, go to work at the factory every day for tuppence a month, and the boss would beat us around the head and neck with a broken bottle, if we were LUCKY!<br/>
**TJ** Well we had it tough. We used to have to get up out of the shoebox at twelve o'clock at night, and LICK the factory floors clean with our tongues. We had half a handful of torn up punch cards, worked twenty-four hours a day at the factory for fourpence every six years, and when it was time to go home, our boss would electrocute us with a mainframe.<br/>
**EI** Right. I had to get up in the morning at ten o'clock at night, half an hour before I went to bed, (pause for laughter), drink a cup of cool aid, work twenty-nine hours a day down factory, and pay the business owner for permission to come to work, and when it was time to go home, our boss would punch us in the face and electrocute us IF we did a good job!<br/>
**MP** But you try and tell the young people today that... and they won't believe ya'.<br/>
**ALL** Nope, nope..<br/>





### Does programming really need a drag and drop UI framework? (short version)
Nope





<br/><br/><br/>
## Join our Slack group
https://yazz-workspace.slack.com
