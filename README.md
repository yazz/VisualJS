
# Visual Javascript 2021
## A tool for building webapps on your intranet

<img width="350" alt="portfolio_view" src="https://raw.githubusercontent.com/yazz/visualjavascript/master/public/driver_icons/visualjavascript.jpg"></img>

## What is Visual Javascript?
Visual Javascript is a tool for building webapps on your intranet. It runs on PC/Mac using Docker or NodeJS, or on a Linux/Windows server with Docker, Kubernetes or NodeJS. To develop an app:

- Start Visual Javascript
- Create the app in your web browser
- Share the app with others by sending them the app URL
 
Visual Javascript is perfect for small web apps or microservices, but not suitable for high performance apps or for build low level systems. Many demo apps can be found at https://yazz.com (Yazz sponsors development of the tool).

## Benefits
- Easy to use like Visual Basic, but using Javascript as the scripting language
- Drag and drop user interface
- Works everywhere, Windows, Linux, Mac, Raspberry PI, NodeJS, Docker, Kubernetes, OpenShift, Istio
- No runtime needed for built apps. Apps can be compiled to a single HTML file and sent by email (Even Sqlite database apps)
- Editor works locally and offline without internet connectivity on your laptop

## Features
- Connect to Postgres, Mysql, or REST APIs using pre built components
- Suitable for desktop apps
- Build web interfaces with common UI components such as buttons, grids, and text boxes
- Can build Microservices for more complex use cases
- Code business logic in Javascript
- Each app has a built in SQLite database
- Open source MIT license
- Can run in Docker, Kubernetes, or OpenShift, locally on Mac, Windows, Linux, Raspberry PI using NodeJS
- All source code for apps can be saved as a single .vjs file
- All code is stored as immutable, and identified by a SHA256 hash
- Extra UI or server components can be build as plugins (as .vjs files)
- The Visual Javascript extensible IDE allows you to build new ways of editing code. Currently a text editor and a Visual Basic style editor are included

## What it can't do
- Build amazing UIs for public facing websites
- Build mobile apps
- Build self contained executables (need to pass in .vjs files)

## Quick Install Guide

### NodeJS
<pre style="display:inline;">&gt; git clone https://github.com/yazz/visualjavascript.git
&gt; cd visualjavascript
&gt; npm install
&gt; npm start
Browse to http://0.0.0.0:80</pre>

### Docker
<pre style="display:inline;">&gt; docker  run  -p 80:80  yazzcom/visualjavascript:2021
Browse to http://0.0.0.0:80</pre>

### Windows
<pre style="display:inline;">Download https://yazz.com/visifile/bin/vjs.exe
&gt; vjs.exe
Browse to http://0.0.0.0:80</pre>

### Mac
<pre style="display:inline;">&gt; curl https://yazz.com/visifile/bin/mac/vjs -o ./vjs
&gt; chmod +x ./vjs
&gt; ./vjs
Browse to http://0.0.0.0:80</pre>

### Linux
<pre style="display:inline;">&gt; wget https://yazz.com/visifile/bin/vjs
&gt; chmod +x ./vjs
&gt; ./vjs
Browse to http://0.0.0.0:80</pre>




## Useful links:
- Demo which works on desktop web browsers here: https://yazz.com/app/homepage.html
- Link to PDF docs: https://yazz.com/visifile/docs/yazz_march_2020.pdf
- Link to Hacker News Post (when it was known as Yazz Pilot): https://news.ycombinator.com/item?id=21734845
- Link to Kubernetes Operator https://github.com/leskil/appshare-operator





## Roadmap

- **2013** Started developement in Clojure/Clojurescript
- **2014** Named Clojure on Coils
- **2015** Development slows, as focus moved to Light Table / Eve project
- **2016** Clojure development stopped as Eve making good progress. 
- **2016** Started Development of Visifile in Javascript, an search engine for internal enterprise data
- **2018** Eve project shuts down
- **2018** Visifile launches but finds out the problem is too difficult to solve. Pivots the product to a low code tool (also because Eve has been shut down)
- **2019** Visifile code removed from codebase
- **2021** Enterprise App Store for ISVs to discover, create, buy, and sell Visual Javascript components and apps to enterprises
- **2021** Support for Istio, Rancher, KNative, OpenWhisk, OpenFaas, AWS
- **2021** Enterprise connectivity via Red Hat, IBM, Salesforce, SAP, Oracle, Stripe, and other enterprise components
- **2021** Desktop version in Mac app store 
- **2021** Paid for hosting options
- **2022** An editor to make programs in VR/AR editor
- **2025** Machine Learning and vision components
- **2027** Miniature thumbnail size version
- **2030** Dust sized version
- **2032** Dust sized version with internal camera for medical diagnoses applications
<br/><br/><br/>






## Quick examples
### Upload a Microservice from a Javascript file

First you need to run Visual Javascript, assuming you have Docker installed:

> &gt;  docker run -p 80:80  yazzcom/visualjavascript:2021

```
......................................................................................................
Visual Javascript started on:
http://0.0.0.0:80
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

> &gt; curl -F 'file=@a.js' http://0.0.0.0:80/file_upload

Finally browse to the following URL in your browser to see the microservice running:

    http://0.0.0.0:80/test3





<br/><br/><br/>
## Starting the Visual Javascript server

### Run from docker:

    docker run -p 80:80 -d yazzcom/visualjavascript:2021

```
......................................................................................................
Visual Javascript started on:
http://localhost:80
```





<br/><br/><br/>
### Docker Quick start (with Docker deploy enabled)
##### 1) Download and run Docker
##### 2) Expose the Docker REST api on port 1234 with:
    docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:1234:1234 bobrik/socat TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/docker.sock
##### 3) Install and run the Visual Javascript IDE with:
    docker run -p 80:3000 -d yazzcom/visualjavascript

##### 4) Go to a browser and view AppShare:
    http://localhost





<br/><br/><br/>
### Run Visual Javascript on Linux, Mac, or Windows with NodeJS

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/yazz/visualjavascript.git
##### 4) Go to the "visualjavascript" directory
    cd appshare
##### 5) Install the NodeJS modules
    sudo npm install
##### 6) Run the Visual Javascript NodeJS application
    node src/electron.js






<br/><br/><br/>
### Build a command line exexutable for MacOS
    pkg .  --output vjs




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
## FAQ


### What is Visual Javascript's killer feature?
Visual Javascript's killer feature is being able to build simple applications in minutes. It is run as a container and has no dependencies.




### What is Visual Javascript's long term vision?
Visual Javascript's long term vision is as a system for embedded computing, for personal automation and medical applications. It could be used for personal automated assistents, such as helping automated devices, or for small medical devices that can be inserted into body using TensorFlow and tiny cameras for detection and processing of issues with the body. We are developing an app store, and initial versions of Visual Javascript are building UIs for internal enterprise apps, but we also believe that we should support systems which do not require apps, as some systems can use autodiscovery of components to each other to work. As an example, if a particular cell type is found by computer vision which is not recognised, Visual Javascript could go out to the network to see if another compnent recognises this cell



### Why doesn't Visual Javascript let me edit mutliple files as a tree like a traditional IDE?
Visual Javascript breaks down all problems into single function components. A component can call other components as well if needed



### Is Visual Javascript Production ready?
Yes, Visual Javascript is production ready. Visual Javascript itself runs on Visual Javascript




### Is Visual Javascript looking for investment
No



###  Does Visual Javascript work with VMWare PKS or other versions of Kubernetes?
Visual Javascript has been tested with standard Kubernetes, Open Shift, and Docker. We will test with more versions, including Rancher astime goes on.


###  Who should use Visual Javascript today?
Anyone who wants to build small web apps for internal use on their intranet



### How does Visual Javascript relate to Visual Basic?
The author is a huge fan opf Visual Basic 6 and earlier, and the VBX/OCX component ecosystems that existed in the 1990s, so the author of Visual Javascript is trying to recreate the Visual Basic 6 ecosystem in Javascript.



### What does the Visual Javascript Scheduler do?
The Scheduler is a NodeJS process which decides which worker processes to send server tasks to.



### How do Visual Javascript processes communicate with each other?
Using IPC (Inter Process Communication)




### What is the basic Unit of code in Visual Javascript?
A component is the basic unit of code in Visual Javascript, represented as a function in a .vjs text file.



### How does Visual Javascript differ from Visual Basic?
The Visual basic style development environment in Visual Javascript is just a Visual Javascript component itself. Other development paradigms can also be built in, with a VR/AR development environment planned for the future using Oculus Quest and WebXR.




### How much will Visual Javascript cost?
Visual Javascript is free to download and use. We will be releasing a hosted version at some point.






### If Visual Javascript is privately funded then why are you not all working full time?
We could work full time on Visual Javascript but we made a conscious decision to work part time on it until we know we have product market fit. This is so that we make sure that we are solving real problems that people have in the real world. We are scared that if we went full time then we would lose touch with reality, as seems to happen with so many startups in this space. Of course, being part time is much harder, as things move much more slowly with regard to developing the product, but we expect that we will be more efficient since we won't be building stuff that isn't needed.



### Does Visual Javascript use AI?
Not yet, but AI is planned in the future for machine vision and learning algorithms. Also AI may be used to match component inputs and outputs and for intelligent code completion in the IDE.




### What does Visual Javascript mean by Self Service?
When we say Self Service we mean that Visual Javascript can be used by people who are not Professional programmers.



### Is there commercial support for Visual Javascript?
If you require commercial support then please go to https://yazz.com




### I'm worried about vendor lock-in - what happens if Visual Javascript goes out of business?
Visual Javascript is Open Source so you can download the opensource repo or fork the Github repo.




### I'm worried about vendor lock-in - what happens if Visual Javascript stays in business but I still need to move off?
Visual Javascript is based on VueJS, HTML, and Javascript so you can slowly migrate to similar technologies in the ecosystem.



### I want to write libraries for Visual Javascript - how can I take part in the Visual Javascript community/ecosystem?
We will be releasing our dev guidelines soon.



### What happens if a server side component goes bad in Visual Javascript?
Visual Javascript runs all server components in their own child NodeJS process, so if a component goes bad then Visual Javascript will restart kill the NodeJS process, restart a new NodeJS process, and return an error code to the caller





### How does version control work in Visual Javascript?
Visual Javascript removes the complexity of separate version control systems like git. Changes to your code are structured using distributed diff algorithms.

### How does Visual Javascript relate to Unison language
There is no relation except that both Unison and Visual Javascript are based on the principal of immutable code.





### How does Visual Javascript relate to StoryScript language
StoryScript is a Glue code for multiple languages, whereas Visual Javascript is only one dialect of Javascript

### How does Visual Javascript relate to Eve?
Some concepts of universality are taken from Eve

### How does Visual Javascript relate to Microsoft?
One of the developers works at Microsoft full time

### How does Visual Javascript relate to Google?
One of the developers works at Goole full time, related to new Operating System concepts and Fuchsia


### Why don't Google or Microsoft developers commit to  the GitHub repo directly?
They have their reasons. Plus, they HATE Javascript. They much prefer .NET, Dart, Go, Typescript, and other cool stuff!


### Every time I restart Visual Javascript I can't see my apps. How to I save them?
You need to save the apps that you wish to keep by pessing the button "Save as .vjs file" fro the editor.


### I’m already invested in my favorite text editor. Can I keep using it with Visual Javascript?
Visual Javascript's basic file format is text, so you can use any editor.



### How does Visual Javascript compare to https://www.anytype.io/?
As of January 2020 AnyType is still closed source. Anytype does use IPFS for storage which is a technology, along with QRI that Visual Javascript is considering for data storage.



### How does Visual Javascript compare to Retool?
As of January 2020 Retool is a great SAAS offering



### How does Visual Javascript compare to Javascript frameworks like VueJS, React , and Angular?
First off, Visual Javascript, uses VueJS under the hood to  build UI components. Visual Javascript is very different to all those frameworks as Visual Javascript does not require deep coding skills or knowledge of HTML. You do need to know some Javascript to use Visual Javascript though.

### Is it planned to support other languages than Javascript in Visual Javascript?
No


### How does Visual Javascript compare to Airtable?
It doesn't. Well, Airtable is a database tool which can have apps built on top of as well, whereas Visual Javascript really is to build apps on top of enterprise APIs and databases.



### How does Visual Javascript compare to Anvil?
Anvil uses Python to build apps whereas Visual Javascript uses Javascript. But Anvil is very good, try it!


### How does Visual Javascript compare to Mendix?
Mendix is a commercial low code product owned by Siemens, and is a very different thing since it is closed source.





### How does Visual Javascript compare to Outsystems?
Outsystems is a commercial low code product and is a very different thing since it is closed source.



### How does Visual Javascript compare to Node Red?
Node Red is a very intuitive system to process events and actions by linking nodes together. It has a different use case than Visual Javascript.





### How does Visual Javascript compare to Huginn
Huginn is a very intuitive personal task handler




### How does Visual Javascript compare to IFTTT
IFTTT is a web only SAAS task automator




### How does Visual Javascript compare to Zapier
Zapier is a web only SAAS task automator




### How does Visual Javascript compare to Stdlib
Stdlib is great cross platform event handler



### How does Visual Javascript compare to Delphi
Delphi was a desktop IDE from the 1990s using Pascal as the programming language, and had a great set of controls and was even VBX (Visual Basic Custom Controls) comptible. Not many people use Deplhi today a it is mostly used for desktop Windows apps



### Do Visual Basic apps run on Visual Javascript?
No




### Can I use my VBX/OLE controls in a Visual Javascript app?
No


### Is it true that Visual Javascript switched to Javascript, even though they publicly spoke out against it?
Yes, we were wrong... here is what we wrote earlier against Javascript:

What is a connected client? A connected client is a device which connects to the world of realtime data from any Connected Client, whether it is a phone, a watch, a web browser, or anything else. But Chris Schmidt of Meteor says it far better than I ever could in this must see video:

https://www.youtube.com/watch?v=8G2SMVIUNNk

In the video Chris Schmidt talks about how the Meteor platform based on Javascript will solve the problems of the connected web. I agree that you can build amazing things with Meteor, but I do not necessary agree that Javascript is the most productive language in which to do this. I think that Clojure and Clojurescript can be used to let you build Connected Clients much faster, and all without Javascript.

But how can we say that Javascript is not the right language for this? Well, Javascript is very much like the early 8088 assembly languages of 40 years ago, where it can run in many places, but over time more and more high level languages were built on top of it, like C, C++, Basic, Java, etc. Javascript is going through exactly the same thing now and more and more languages are appearing on top of it. Like any challenged technology Javascript is evolving rapidly with ES6, to fight off any newcomers.




### Why did Visual Javascript switch to Javascript from Clojure/Clojurescript?
We were limiting ourselves to a very small subset of developers by being in Clojure/Clojurescript, whereas Javascript has a much larger developer reach



### Where can I find the app store for Visual Javascript?
It is under development




### Does Visual Javascript work offline?
Yes! One of the great things about Visual Javascript is that it can be run offline in your own datacenter, or on your own PC, totally disconnected from the internet. We have even seen Visual Javascript running on a standalone disconnected Raspberry PI.


### How does Visual Javascript compare to Bubble.io?
As of January 2020 Bubble is a hosted web app builder, one of the first great online CRUD app builders.

### Is there community for Visual Javascript?
You can join us here http://Visual Javascript-workspace.slack.com



### What is the extension for all Visual Javascript apps?
The extension is ".vjs" but you can also use the ".js" extension for loading some simple Javascript apps



<br/><br/><br/>
## Join our Slack group
https://AppShare-workspace.slack.com
