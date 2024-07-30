
# Visual Javascript - Visual Basic reimagined for the internet


## Docs (in progress)
https://yazz.com/visifile/docs/book/main.html
<br/><br/><br/>



## PDF of last physical magazine (March 2020 when the product was called Visual Javascript)
https://yazz.com/visifile/docs/yazz_march_2020.pdf
<br/><br/><br/>




## What is Visual Javascript?
Visual Javascript is a both an IDE for building small web applications and a decentralised app store. Visual Javascript allows you to build Web apps visually. Visual Javascript runs on the web, PC/Mac/Linux (desktop application or NodeJS) or as a container (Docker, Kubernetes). To develop an app:

- Start the Visual Javascript web server
- Create an app in your web browser
- Share the app with others by sending them the app URL

Visual Javascript is perfect for prototyping apps. Some demo apps can be found at https://yazz.com
<br/><br/><br/>






## Benefits
- **Easy to use:** Easy to use drag and drop visual interface  (like Visual Basic)
- **Supports multiple web wallets:** Currently supports Metamask
- **Standard scripting language:** Uses Javascript 
- **Permissive license:** Open source MIT license so you can do whatever you want with it
- **Easy to distribute apps:** Apps can be exported to a single HTML file and sent by email (even SQLite database apps)
- **Works almost anywhere:** Windows, Linux, Mac, Raspberry PI, NodeJS, Docker, Kubernetes, OpenShift, Istio
- **Works offline:** Editor works both locally and offline
- **Reuse existing databases:** Can read MS Access databases (even Linux or Mac can read MS Access files)
<br/><br/><br/>








## Features
- Build local or online  dApps as a series of forms
- Add components to a form, such as buttons, images, input fields
- Add interactivity using Javascript
- Connect to databases such as Postgres, Mysql
- Connect to REST APIs
- Connect the outputs of one component to the inputs of another
- Build Microservices
- Each app has a built in SQLite database
- App source code saved as a single .vjs file
<br/><br/><br/>




## What it can't do
- Build slick UIs for public facing websites
- Build mobile apps
- Build self contained executables (need to pass in a .vjs file)
- High performance apps
- Low level systems
<br/><br/><br/>





## Quick Install Guide


### NodeJS on Mac
Assuming that you have NodeJS, NPM, and Git installed, enter the following commands at the command line:
<pre style="display:inline;">&gt; git clone https://github.com/yazz/visualjavascript.git

&gt; cd Visual Javascript

&gt; npm install

&gt; xcode-select --install

&gt; npm uninstall sqlite3

&gt; npm install sqlite3 --build-from-source --target_arch=arm64 --fallback-to-build

&gt; npm start</pre>

Browse to http://0.0.0.0:80 to open Visual Javascript
<br/><br/>



### NodeJS
Assuming that you have NodeJS, NPM, and Git installed, enter the following commands at the command line:
<pre style="display:inline;">&gt; git clone https://github.com/yazz/visualjavascript.git

&gt; cd Visual Javascript

&gt; npm install

&gt; npm start</pre>

Browse to http://0.0.0.0:80 to open Visual Javascript
<br/><br/>


### Docker
Make sure that you have Docker installed. Then:

<pre style="display:inline;">&gt; docker  run  -p 80:80  yazzcom/yazz:march2022
</pre>

Browse to http://0.0.0.0:80 to open Visual Javascript
<br/><br/>






## Useful links:
- Demo which works on desktop web browsers here: https://yazz.com/app/homepage.html
- Link to PDF docs: https://yazz.com/visifile/docs/yazz_march_2020.pdf
- Link to Hacker News Post (when it was known as Yazz Pilot): https://news.ycombinator.com/item?id=21734845
- Link to Kubernetes Operator (Previous name was AppShare) https://github.com/leskil/appshare-operator
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







# FAQ

<br/><br/><br/>
# FAQ - High Level Questions

### What is Visual Javascript?
Visual Javascript is a tool to build internal web applications. Applications are built using pre-built graphical and server side components, with glue code written in Javascript. Visual Javascript can run on Windows, OsX (via the Mac App store), and Kubernetes and Docker containers. Ideally Visual Javascript is used for small throwaway or demo apps, but can also be used for more complex apps since it also contains an embedded SQLite database.

### What is Visual Javascript's killer feature?
Visual Javascript's killer feature is the ability to create simple webapps extremely fast, on almost any platform, with no licensing or troublesome installation procedures. The application can then be distributed as a single HTML file WITHOUT even needing the original Visual Javascript runtime.

###  Who should use Visual Javascript today?
An ideal user for Visual Javascript is someone who wants to build small web apps for internal use (such as demos), or someone who wants to do small data processing tasks. So far there have been independant people and large enterprises have used Visual Javascript for building demos and for small data processing tasks.

### What does Visual Javascript mean by Self Service?
When we say Self Service we mean that Visual Javascript can be used by people who are not professional programmers. This is possible because Visual Javascript has a drag and drop user interface which makes it easy for "non techies" to design and build applications. Also, many components included in Visual Javascript have a custom design time graphical editor which make it easy to configure them.

### How much will Visual Javascript cost?
Visual Javascript is free to download and use. It uses the MIT license so you are free to copy and distribute Visual Javascript applications that you build. Visual Javascript, the company behind Visual Javascript may release a paid hosted version at some point which will most likely be a web based service (like hosted Wordpress).

### Is Visual Javascript Production ready?
Yes, Visual Javascript is production ready and has been used in many enterprise environments.

### Is there commercial support for Visual Javascript?
If you require commercial support then please go to https://yazz.com. If you want a consulting assignment with Visual Javascript our email is contact@yazz.com

### I'm worried about vendor lock-in. What happens if Yazz goes out of business?
Visual Javascript is Open Source so you can download the opensource repo or fork the Github repo. Visual Javascript is also based on VueJS, HTML, and Javascript so you can slowly migrate applications off Visual Javascript to similar technologies in the Javascript ecosystem if needed.

### What is Visual Javascript's long term vision?
Visual Javascript's long term vision is to make personal automation and embedded medical applications easy to build. An example of a medical device is a tiny device that is injected into the blood stream to detect and destroy dangerous cells (using tiny cameras and Tensorflow). To get to this long term goal we need to take many tiny steps on the way. First we need to succeed with desktop web applications, and to create an app store for internal enterprise apps and components. Next we need to miniturise the system to work in embedded and internal environments, and finally we need support for autonomous systems which use autodiscovery of components which can be loaded on demand. As an example of why autodiscovery is important is for a medical application where an unrecognised cell type in the human body is found by computer vision, Visual Javascript could go out to the network to see if this cell is recognized somewhere else and download the particular code related to that cell type to detect if it is dangerous or not.

### Why did Visual Javascript switch to Javascript from Clojure/Clojurescript?
For the first 3 years the author, Zubair used Clojure/Clojurescript for the development of Visual Javascript. But in 2016 Zubair switched from Clojure/Clojurescript as he thought that the product was limiting itself to a very small subset of developers, whereas Javascript has a much larger developer pool.

### Is Visual Javascript compatible with Visual Basic?
No. Since Visual Javascript uses Javascript as the scripting language instead of Basic there is zero compatibility with Visual Basic.




<br/><br/><br/>
# FAQ - Comparison to other products


### What is Visual Javascript's unique selling point compared to other low code tools?
Think of Visual Javascript as a Swiss Army Knife tool for building small internal applications. It is a good general purpose tool for quick and dirty tasks such as calculating a few numbers, or visualising an API, but not meant for heavy duty specialist work such as responsive websites, or internet commerce websites. While there are many existing tools in the low code space, most of them are either paid SAAS products, or developer focused open source products, often with complex installation procedures. Unlike many other tools Visual Javascript is both open source and easy to install.


### How does Visual Javascript compare to Visual Basic?
The author of Visual Javascript is a huge fan of Visual Basics. Visual Javascript is trying to recreate the essence of the Visual Basic component ecosystem from the 1990s, but in Javascript.

In Visual Basic the VBA language has been embedded in many other languages, such as Excel, but Visual Javascript is a bit different. The runtime is meant to be used standalone and connect to other systems such as Excel via components. In fact everything in Visual Javascript is just a component, including the Visual Javascript drag and drop editor, which can also be replaced. For example, planned for the future is to offer other development paradigms such as a VR/AR editor using Oculus Quest and WebXR.


### How does Visual Javascript compare to Beads
Beads is a very interesting product which has some things in common with Visual Javascript such as the debugger, but some other things are totally opposite like Beads has invented their own language and syntax. However, Visual Javascript definitely takes some inspiration from Beads. Here is a recent thread on Beads on Hacker News to find out more about it:
https://news.ycombinator.com/item?id=27287989


### How does Visual Javascript relate to the Unison language
Unison is an exellent language for distributed computing. There is no relation except that both Unison and Visual Javascript are based on the principal of immutable code where code is addressed by the SHA256 of the source code which means that the Visual Javascript internally identifies all code as the SHA256 hash of the source code.


### How does Visual Javascript relate to StoryScript language
There is no real relation as StoryScript is a Glue code for multiple languages using AI and plain English language to interact with them, whereas Visual Javascript is more where the user has be very intentional and choose which components to interact with by to dragging and dropping components onto a form and connecting them together using links and Javascript.


### How does Visual Javascript relate to Eve?
Full disclosure, the creator of Visual Javascript was the initial angel investor in Eve. Some concepts of universality are taken from Eve. Eve invented a new language to build systems using reactive concepts, but Visual Javascript uses it's own language and is not as reactive.


### How does Visual Javascript compare to https://www.anytype.io/?
Anytype is more of an internet operating system. As of June 2021 AnyType is still closed source. Anytype does use IPFS for storage which is a technology, along with QRI that Visual Javascript is considering for data storage.


### How does Visual Javascript compare to Retool?
As of May 2021 Retool is a great paid SAAS offering. We can recommend Retool for anyone who wants a paid SAAS offering with great support.


### How does Visual Javascript compare to Javascript frameworks like VueJS, React , and Angular?
First off, Visual Javascript, uses VueJS under the hood to  build UI components. Visual Javascript is very different to all those frameworks as Visual Javascript does not require deep coding skills or knowledge of HTML. You do need to know some Javascript to use Visual Javascript though.


### How does Visual Javascript compare to Airtable?
It doesn't. Well, Airtable is a database tool which can have apps built on top of as well, whereas Visual Javascript really is to build apps on top of enterprise APIs and databases. It must be noted that every Visual Javascript application does have a built in SQLite database as well.


### How does Visual Javascript compare to Anvil?
Anvil uses Python to build apps whereas Visual Javascript uses Javascript. But Anvil is very good, and supports Javascript now, so try it!


### How does Visual Javascript compare to Mendix?
Mendix is a commercial low code product owned by Siemens, and is a very different thing since it is closed source.

### How does Visual Javascript compare to Outsystems?
Outsystems is a commercial low code product and is a very different thing since it is closed source

### How does Visual Javascript compare to Node Red?
Node Red is a very intuitive system to process events and actions by linking nodes together. It has a different use case than Visual Javascript as Node Red is mostly used for IoT applications.

### How does Visual Javascript compare to Huginn
Huginn is a very intuitive personal task handler. Visual Javascript is more for applications that need user interaction.

### How does Visual Javascript compare to IFTTT
IFTTT is a paid web only SAAS task automator. Visual Javascript is more for applications that need user interaction.

### How does Visual Javascript compare to Zapier
Zapier is a paid web only SAAS task automator. Visual Javascript is more for applications that need user interaction.

### How does Visual Javascript compare to Autocode
Autocode is great cross platform event handler. It is very text based and aims to link systems together. Visual Javascript is more for applications that need user interaction.

### How does Visual Javascript compare to Delphi
Delphi was a desktop IDE from the 1990s using Pascal as the programming language, and had a great set of controls and was even VBX (Visual Basic Custom Controls) compatible. Some people use Deplhi today for desktop Windows apps, and it is definitely one of the inspirations for Visual Javascript. Delphi used Pascal as the language and Visual Javascript uses Javascript.

### How does Visual Javascript compare to Dynamic Land
Dynamic Land has been a big inspiration for Visual Javascript in that we think that the model Dynamic Land uses, of spatial computing will be the future, hence the built-in VR in Visual Javascript. We see a future where the Visual Javascript editor could be used in a spatial way with VR to build programs.


### How does Visual Javascript compare to Bubble.io?
As of June 2021 Bubble is a paid hosted web app builder and is good for building a public facing website. Bubble is excellenet for build your low code startup's public facing site, so it is a different market space than Visual Javascript.


### How does Visual Javascript compare to DeFi?
DeFi is more a concept than a single product, but Visual Javascript takes many inspirations from Blockchain and DeFi projects. We have considered how we could run Visual Javascript as a series of nodes, much like DFinity and the Internet Computer.











<br/><br/><br/>
# FAQ - Features and compatibility

### Does Visual Javascript use native libraries?
Yes, but only one. A SQlite native module is used. Everything else is pure Javascript. The reason for this is that Sqlite works almost everywhere. For all other components we like to keep everything as pure Javascript. This often means that we limit ourselves to which third party libraries that we can use. When exporting a Viual Javascript application as a HTML file we use SQLite compiled to Webassembly/Javascript so no native modules are needed.

### Why doesn't Visual Javascript let me edit mutliple files as a tree like a traditional IDE?
Visual Javascript breaks down all problems into single files, each of which contains a single Javascript function, which acts as a component. A component can call other components as well if needed to form larger programs.

###  Does Visual Javascript work with VMWare PKS or other versions of Kubernetes?
Visual Javascript has been tested with Kubernetes, OpenShift, and Docker. We will test with more versions, including Rancher as time goes by, but it should work fine with VMWare PKS, GCP, and other Kubernetes distributions

### What does the Visual Javascript Scheduler do?
The Scheduler is a NodeJS process which decides which worker process to send a server task to. Each process takes about 40MB of RAM and the default number of these "virtual processors" is 6.

### How do Visual Javascript processes communicate with each other?
Visual Javascript processes communicate using IPC (Inter Process Communication) via NodeJS

### What is the basic unit of code in Visual Javascript?
A component is the basic unit of code in Visual Javascript, represented as a function in a .vjs text file

### Does Visual Javascript use AI?
No deep AI yet, but AI is planned for machine vision and learning algorithms. Also AI may be used to match component inputs and outputs and for intelligent code completion in the IDE. We do currently use TensorFlow for computer vision but we don't consider this real AI

### What happens if a server side component goes bad in Visual Javascript?
Visual Javascript runs all server components in their own child NodeJS process, so if a component goes bad then Visual Javascript will restart kill the NodeJS process, restart a new NodeJS process, and return an error code to the caller

### Does Visual Javascript work offline?
Yes! One of the great things about Visual Javascript is that it works offline without an internet connection

### How does version control work in Visual Javascript?
Visual Javascript removes the complexity of separate version control systems like git. Changes to your code are structured using distributed diff algorithms

### Every time I restart Visual Javascript I can't see my apps. How do I save them?
You need to save the apps that you wish to keep by pessing the button "Save as .vjs file" in the editor

### I’m already invested in my favorite text editor. Can I keep using it with Visual Javascript?
Visual Javascript's basic file format is text, so you can use any editor, but your programs will have to be imported into Visual Javascript if you wish to use the interactive editor

### Is it planned to support other languages than Javascript in Visual Javascript?
No

### Do Visual Basic apps run on Visual Javascript?
No. Visual Javascript only run apps written in Visual Javascript itself as .vjs files

### Can I use my VBX/OLE controls in a Visual Javascript app?
No. Visual Javascript apps can only use .vjs components

### Where can I find the app store for Visual Javascript?
It is under development at the moment, but the code is here in this Git Repository for components

### What is the extension for all Visual Javascript apps?
The extension is ".vjs" but you can also use the ".js" extension for loading some simple Javascript apps

### How can I work with Visual Javascript offline when developing Ethereum apps?
You can run Visual Javascript using the Docker Eth node:
    
    docker run -it -p 30303:30303 ethereum/client-go --syncmode "light"












<br/><br/><br/>
# FAQ - Company and team related questions

### Who is involved with Visual Javascript.
Zubair Quraishi is the main developer. There are also other people who also help out from time to time, including people from Google, Microsoft, and other companies.

### Is Visual Javascript looking for investment
No, we don't need money as Visual Javascript has been sponsoring the development of the Visual Javascript tool. We would only consider investment from the outside if it was a very long term partnership, as Visual Javascript is expecting to be unprofitable for many years to come. We have been approached by many investors to invest in us, but we would only consider long term investors who would also bring some strategic value to Visual Javascript/visualjavascript.












<br/><br/><br/>
# FAQ - Getting involved

### I want to write libraries for Visual Javascript - how can I take part in the Visual Javascript community/ecosystem?
We will be releasing developer guidelines soon

### Is there a community that I can join to find out more? - yes, join our Slack group at
https://visualjavascript.slack.com
