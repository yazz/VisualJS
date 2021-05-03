
# Visual Javascript 2021
## Build internal webapps

<img width="350" alt="portfolio_view" src="https://raw.githubusercontent.com/yazz/visualjavascript/master/public/driver_icons/visualjavascript.jpg"></img>




## Beta Docs
https://yazz.com/visifile/docs/book/main.html
<br/><br/><br/>



## PDF of last physical magazine (March 2020)
https://yazz.com/visifile/docs/yazz_march_2020.pdf
<br/><br/><br/>




## What is Visual Javascript?
Visual Javascript is a tool for building webapps on your intranet. It runs on PC/Mac (desktop application or NodeJS), on Linux/Windows servers (via NodeJS), or as a container (Docker, Kubernetes). To develop an app:

- Start Visual Javascript
- Create an app in your web browser
- Share the app with others by sending them the app URL

Visual Javascript is perfect for small internal web apps or microservices, but not so suitable for high performance apps or low level systems. Some demo apps can be found at https://yazz.com (Yazz sponsors development of the tool).
<br/><br/><br/>






## Benefits
- **Easy to use:** Drag and drop interface (like Visual Basic, but Javascript instead of Basic for scripting)
- **Permissive license:** Open source MIT license so you can do what you want with it
- **Easy to distribute apps:** Apps can be compiled to a single HTML file and sent by email (even SQLite database apps)
- **Works almost anywhere:** Windows, Linux, Mac, Raspberry PI, NodeJS, Docker, Kubernetes, OpenShift, Istio
- **Works offline:** Editor works both locally and offline without internet connectivity on your laptop
- **Reuse existing databases:** Can read MS Access databases (even Linux or Mac can read MS Access files)
<br/><br/><br/>








## Features
- Build desktop apps as a series of forms
- Add components to the forms, such as Buttons, images, input fields
- Script in Javascript
- Connect to Postgres, Mysql, or REST APIs using pre-built components
- Build Microservices
- Each app has a built in SQLite database
- App source code saved as a single .vjs file
<br/><br/><br/>




## What it can't do
- Build slick UIs for public facing websites
- Build mobile apps
- Build self contained executables (need to pass in .vjs files)
<br/><br/><br/>





## Quick Install Guide

### Mac App Store
https://apps.apple.com/gb/app/visual-javascript/id1551448939?mt=12

### NodeJS
Assuming that you have NodeJS, NPM, and Git installed, enter the following commands at the command line:
<pre style="display:inline;">&gt; git clone https://github.com/yazz/visualjavascript.git

&gt; cd visualjavascript

&gt; npm install

&gt; npm start</pre>

And finally browse to http://0.0.0.0:80 to access the editor



### Docker
Make sure that you have Docker installed. Then:

<pre style="display:inline;">&gt; docker  run  -p 80:80  yazzcom/visualjavascript:2021
</pre>

And finally browse to http://0.0.0.0:80



### Windows
Download **https://yazz.com/visifile/bin/vjs.exe** and then run:

<pre style="display:inline;">
&gt; vjs.exe
</pre>
Finally browse to http://0.0.0.0:80



### Mac
Run:
<pre style="display:inline;">&gt; curl https://yazz.com/visifile/bin/mac/vjs -o ./vjs
&gt; chmod +x ./vjs
&gt; ./vjs
</pre>

Finally browse to http://0.0.0.0:80



### Linux
Run:
<pre style="display:inline;">&gt; wget https://yazz.com/visifile/bin/vjs
&gt; chmod +x ./vjs
&gt; ./vjs
</pre>
Finally browse to http://0.0.0.0:80
<br/><br/><br/>






## Useful links:
- Demo which works on desktop web browsers here: https://yazz.com/app/homepage.html
- Link to PDF docs: https://yazz.com/visifile/docs/yazz_march_2020.pdf
- Link to Hacker News Post (when it was known as Yazz Pilot): https://news.ycombinator.com/item?id=21734845
- Link to Kubernetes Operator https://github.com/leskil/appshare-operator
<br/><br/><br/>







## Command line options:

    --cacert1                     Public HTTPS CA certificate 1
    --cacert2                     Public HTTPS CA certificate 2
    --cacert3                     Public HTTPS CA certificate 3
    --debug                       Allow to run NodeJS in debug mode (default false)
    --deleteonexit                Delete database files on exit (default false)
    --deleteonstartup             Delete database files on startup (default false)
    --help                        Output usage information
    --hostport                    Server port of the central host (default 80)
    --host                        Server address of the central host (default yazz.com)
    --https                       Run using a HTTPS (default is false)
    --jaegercollector             Jaeger Open tracing collector endpoint (default not set) eg: http://localhost:14268/api/traces
    --loadjscode                  Load the following JS from the command line (default not set)
    --loadjsfile                  Load the following JS from a file (default not set)
    --loadjsurl                   Load the following JS from a URL (default not set)
    --locked                      Allow server to be locked/unlocked on start up (default true)
    --maxJobProcessDurationMs     Maximum time to wait for a job to complete (default 10000 ms)
    --maxprocessesretry           Number of processes to retry when all cores are busy (default 10 processes)
    --port                        Which port should I listen on? Default 80 or 3000 (if not run as sudo)
    --private                     Private HTTPS key location
    --public                      Public HTTPS certificate location
    --runapp                      Run the app with ID as the homepage (default not set)
    --runhtml                     Run using a local HTML page as the homepage (default not set)
    --showdebug                   Allow to show debug info (default false)
    --statsinterval               Allow to show debug info every x seconds (default 10 seconds)
    --showprogress                Show progress when starting Visual Javascript (default false)
    --showstats                   Allow to show stats debug info (default false)
    --usehost                     Use host name [usehost]
    --useselfsignedhttps          Use self signed HTTPS for local development (default false)
    --version                     output the version number
    --virtualprocessors           How many virtual processors to run (default 6 processors)
<br/><br/><br/>








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










<br/><br/><br/>
## FAQ


### What is Visual Javascript's killer feature?
Visual Javascript's killer feature is being able to build simple applications in minutes




### What is Visual Javascript's long term vision?
Visual Javascript's long term vision is to be a system for embedded computing, personal automation and medical applications. An example of a medical device is a tiny device that would be injected into the blood stream to detect and destroy dangerous cells (using tiny cameras and Tensorflow). In the short term we are developing an app store, and initial versions of Visual Javascript are building UIs for internal enterprise apps, but we also believe that we should support autonomous systems which use autodiscovery of components which can be loaded on demand. As an example, if an unrecognised cell type in the human body is found by computer vision, Visual Javascript could go out to the network to see if this cell is recognized somewhere else and download the particular code related to that cell type



### Why doesn't Visual Javascript let me edit mutliple files as a tree like a traditional IDE?
Visual Javascript breaks down all problems into single function components. However, a component can call other components as well if needed



### Is Visual Javascript Production ready?
Yes, Visual Javascript is production ready and has been used in many enterprise environments




### Is Visual Javascript looking for investment
No



###  Does Visual Javascript work with VMWare PKS or other versions of Kubernetes?
Visual Javascript has been tested with standard Kubernetes, Open Shift, and Docker. We will test with more versions, including Rancher as time goes by


###  Who should use Visual Javascript today?
Anyone who wants to build small web apps for internal use on their intranet



### How does Visual Javascript relate to Visual Basic?
The author is a huge fan opf Visual Basic 6 and earlier, and the VBX/OCX component ecosystems that existed in the 1990s, therefore Visual Javascript is trying to recreate the Visual Basic 6 ecosystem from the 1990s, but in Javascript and for the modern intranets



### What does the Visual Javascript Scheduler do?
The Scheduler is a NodeJS process which decides which worker process to send a server task to



### How do Visual Javascript processes communicate with each other?
Using IPC (Inter Process Communication)




### What is the basic Unit of code in Visual Javascript?
A component is the basic unit of code in Visual Javascript, represented as a function in a .vjs text file





### How does Visual Javascript differ from Visual Basic?
Visual Javascript does not use Basic. It uses Javascript as the scripting language. Also, the Editor is not the main part of Visual javascript. in fact the Visual Javascript editor is just a component with the environment. Other development paradigms can also be built in, with a VR/AR development environment planned for the future using Oculus Quest and WebXR




### How much will Visual Javascript cost?
Visual Javascript is free to download and use. We will be releasing a paid hosted version at some point






### If Visual Javascript is privately funded then why are you not all working full time?
We could work full time on Visual Javascript but we made a conscious decision to work part time on it until we know we have product market fit. This is so that we make sure that we are solving problems that people have in the real world. We are scared that if we went full time then we would lose touch with reality, as seems to happen with so many startups in this space. Of course, being part time is much harder, as things move much more slowly with regard to developing the product, but we expect that we will be more efficient since we won't be building stuff that isn't needed





### Does Visual Javascript use AI?
Not yet, but AI is planned in the future for machine vision and learning algorithms. Also AI may be used to match component inputs and outputs and for intelligent code completion in the IDE




### What does Visual Javascript mean by Self Service?
When we say Self Service we mean that Visual Javascript can be used by people who are not Professional programmers



### Is there commercial support for Visual Javascript?
If you require commercial support then please go to https://yazz.com




### I'm worried about vendor lock-in - what happens if Visual Javascript goes out of business?
Visual Javascript is Open Source so you can download the opensource repo or fork the Github repo




### I'm worried about vendor lock-in - what happens if Visual Javascript stays in business but I still need to move off?
Visual Javascript is based on VueJS, HTML, and Javascript so you can slowly migrate to similar technologies in the ecosystem



### I want to write libraries for Visual Javascript - how can I take part in the Visual Javascript community/ecosystem?
We will be releasing our dev guidelines soon



### What happens if a server side component goes bad in Visual Javascript?
Visual Javascript runs all server components in their own child NodeJS process, so if a component goes bad then Visual Javascript will restart kill the NodeJS process, restart a new NodeJS process, and return an error code to the caller





### How does version control work in Visual Javascript?
Visual Javascript removes the complexity of separate version control systems like git. Changes to your code are structured using distributed diff algorithms





### How does Visual Javascript relate to Unison language
Unison is an exellent language for distributed computing. There is no relation except that both Unison and Visual Javascript are based on the principal of immutable code where code is addressed by the SHA256 of the source code





### How does Visual Javascript relate to StoryScript language
StoryScript is a Glue code for multiple languages, whereas Visual Javascript is only one dialect of Javascript





### How does Visual Javascript relate to Eve?
Some concepts of universality are taken from Eve. Full disclosure, the creator of Visual Javascript was the initial angel investor in Eve






### How does Visual Javascript relate to Microsoft?
One of the developers works at Microsoft full time





### How does Visual Javascript relate to Google?
One of the developers works at Google full time working on new Operating System concepts and Fuchsia related things






### Why don't Google or Microsoft developers commit to the GitHub repo directly?
They have their reasons. Plus, they HATE Javascript. They much prefer .NET, Rust, Dart, Go, Typescript, and other cool stuff for their day jobs!




### Every time I restart Visual Javascript I can't see my apps. How to I save them?
You need to save the apps that you wish to keep by pessing the button "Save as .vjs file" in the editor




### I’m already invested in my favorite text editor. Can I keep using it with Visual Javascript?
Visual Javascript's basic file format is text, so you can use any editor



### How does Visual Javascript compare to https://www.anytype.io/?
As of March 2021 AnyType is still closed source. Anytype does use IPFS for storage which is a technology, along with QRI that Visual Javascript is considering for data storage.



### How does Visual Javascript compare to Retool?
As of March 2021 Retool is a great SAAS offering



### How does Visual Javascript compare to Javascript frameworks like VueJS, React , and Angular?
First off, Visual Javascript, uses VueJS under the hood to  build UI components. Visual Javascript is very different to all those frameworks as Visual Javascript does not require deep coding skills or knowledge of HTML. You do need to know some Javascript to use Visual Javascript though





### Is it planned to support other languages than Javascript in Visual Javascript?
No






### How does Visual Javascript compare to Airtable?
It doesn't. Well, Airtable is a database tool which can have apps built on top of as well, whereas Visual Javascript really is to build apps on top of enterprise APIs and databases



### How does Visual Javascript compare to Anvil?
Anvil uses Python to build apps whereas Visual Javascript uses Javascript. But Anvil is very good, and supports Javascript now, so try it!





### How does Visual Javascript compare to Mendix?
Mendix is a commercial low code product owned by Siemens, and is a very different thing since it is closed source





### How does Visual Javascript compare to Outsystems?
Outsystems is a commercial low code product and is a very different thing since it is closed source



### How does Visual Javascript compare to Node Red?
Node Red is a very intuitive system to process events and actions by linking nodes together. It has a different use case than Visual Javascript





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
No. Visual Javascript apps are written as .vjs files



### Can I use my VBX/OLE controls in a Visual Javascript app?
No. Visual Javascript apps can have custom controls as .vjs components



### Why did Visual Javascript switch to Javascript from Clojure/Clojurescript?
Earlier I was against Javascript. But, with Clojure/Clojurescript we were limiting ourselves to a very small subset of developers, whereas Javascript has a much larger developer pool, so we switched



### Where can I find the app store for Visual Javascript?
It is under development at the moment, but the code is here in this Git Repository for components



### Does Visual Javascript work offline?
Yes! One of the great things about Visual Javascript is that it works offline without an internet connection




### How does Visual Javascript compare to Bubble.io?
As of March 2021 Bubble is a hosted web app builder, one of the first great online CRUD app builders




### Is there community for Visual Javascript?
You can join us here https://join.slack.com/t/slack-lww3757/shared_invite/zt-oncgz9v8-2kgZPQhPp0kxBJUE~kPBaw



### What is the extension for all Visual Javascript apps?
The extension is ".vjs" but you can also use the ".js" extension for loading some simple Javascript apps



<br/><br/><br/>
## Join our Slack group
https://join.slack.com/t/slack-lww3757/shared_invite/zt-oncgz9v8-2kgZPQhPp0kxBJUE~kPBaw
