# VisiFile
Effortless search for intranet documents

<img src='http://visifile.com/visifile_screenshot.png' />

Demo here: http://139.162.228.5/






VisiFile is a desktop program that scans one or multiple PC on your network and allows you to search and monitor changes in deocuments. It works with:
<br><br>

* Excel
* Word
* CSV
* MySQL
* Oracle
* Postgres
* MariaDB
* SqLite
* PDF
* GTLF 3d 
	
	




<br>
<br>
<br>
<br>
<p align="center">
    <img src='http://gosharedata.com/gosharedata/images/pasted%20image%202844x1458.jpg' />
    </p>
</div>
I work in Big Pharma, trying to cure Diabetes, so I care about things working in Windows Networks. Therefore I also care about cross platform compatiblity which means IE 11 and Windows. Since I always seem to take things to extremes this means I also made sure that GoShare Data works in VR and also on the Raspberry PI!







<br>
<br>
<br>
<br>
<br>
<br>
As a hobby, in October 2016 I started building GoShareData as an Open Source Project to solve a problem that I have faced at every large company, which is "How do I access and share frequently used data on my computer"?

The product is built with:

- VueJS 2 and Vuex
- AFrame 3d from Mozilla
- Sqlite
- AlaSQL
- Javascript
- NodeJS
- Express



Future roadmap

- See changes to all my own documents
- See what data your colleagues are working on
- Ability to see other users in my organisation
- Ability to browse data sources
- Ability to query between Excel, Word, and relational databases


Current thinking about monetization:

- Free for up to 5 users in an organisation and then $10 per user per month
- Free for personal use. $200 per year for commercial use per user





VisiFile currently is:

- a download for Windows that scans your hard disk and indexes the documents (Down here http://VisiFile.com)

Command line options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --type [type]          Add the specified type of app [type]
    -p, --port [port]          Which port should I listen on? [port]
    -h, --host [host]          Server address of the central host [host]
    -s, --hostport [hostport]  Server port of the central host [hostport]










### Developer quick start for Windows
<img height='350px' src='http://vignette4.wikia.nocookie.net/uncyclopedia/images/b/bb/Xplogo.jpg/revision/latest?cb=20140331164120' />


#####1) Install GIT from https://git-scm.com/downloads
#####2) Install Node.js 6.9.1 32 bit installer from https://nodejs.org/en/blog/release/v6.9.1/
#####3) git clone https://github.com/zubairq/visifile.git
#####4) cd visifile
#####5) npm install
#####6) npm run build
#####7) node src\index.js

###If you wish to live edit the UI of visifile in realtime on Windows then you need the following additional steps

#####8) Open a new command line prompt in Windows which should opoen to the "visifile" folder 

#####9) Type into the command line:
    npm run dev

#####10) Open http://localhost:8080/public/

#####11) Go to visifile\src\components\App.vue

#####12) Change the text "Browse Data" to "Live Editing"

#####13) When you save the file then your changes should be updated in real time in the browser









### Quick start Mac
<img height='350px' src='http://www.alessioatzeni.com/mac-osx-lion-css3/res/img/MacOSX.png' />

#####1) Install GIT from https://git-scm.com/downloads
#####2) Install Node.js 6.9.1 for Mac OS X from https://nodejs.org/en/blog/release/v6.9.1/
#####3) git clone https://github.com/zubairq/GoShareData.git
#####4) cd visifile
#####5) npm install
#####6) npm run build
#####7) sudo node src/index.js

###If you wish to edit visifile in realtime on OS X then you need the following additional steps

#####8) Open a new shell.

#####9) sudo npm run dev

#####10) Open http://localhost:8080/public/

#####11) Go to visifile/src/components/App.vue

#####12) Change the text "Browse Data" to "Live Editing"


#####13) when you save the file then your changes should be updated in real time in the browser
















### The long story of Visifile
<img height='350px' src='http://makeameme.org/media/created/Its-a-long.jpg' />


My name is Zubair Quraishi and I worked in the 1990s and 2000s as a C++ and Java programmer, building mostly server side web applications, only to find the whole develop, compile, test cycle hugely unproductive. Starting around 2007 I tried to build a web framework unsuccessfully, and then again in 2013. In 2016 I realised that I was trying to "boil the ocean" with far to ambitious an idea, and also frameworks like Vue.js, React, GoMix, and Eve had started to make web development a lot less painful, so they solved the problem I had and they were doing a far better job than I could ever do. As a postmorten for why the web framework failed, despite some amazing features I had:

 - client side SQL
 - Front end react based UI
 - Fully real time access to oracle and postgress databases

I think the reason for the failure was:

 - very small market of front end developers since Clojure was the language
 - It was hard to integrate with other technologies, being a huge framework. Developers sometimes just want a library

I did start building a new frontend in Blockly, a drag and drop builder from google so that I could turn it into a hosted service. Suddenly I started to see some traction, but I knew it was too late. It would take far too long to make it a really viable product, so I decided to pivot on my pet project.

I did however have a new itch to scratch, and that was that I also needed to share data with my colleagues. So I dumped my old project, and am trying a new experiment now!






### What is GoShareData's killer feature?
<img height='350px' src='http://blog.wiserspread.com/wp-content/uploads/2014/07/Killer.jpg' />


GoShareData's killer feature is being able to share snippets of your data with your colleagues. So for example, you may have some SQL to show you a total of monthly sales. this can be shared as a data snippet, instead of cutting and pasting SQL results and emailing them to colleagues.












### What is Visifile not good for?
<img height='350px' src='http://918thefan.com/wp-content/uploads/2012/05/anthony-taber-square-peg-looking-at-round-hole-thinking-with-a-proper-diet-moderate-bu-new-yorker-cartoon-e1336682469227.jpg' />


Visifile is unsuitable for quite a wide variety of data needs, since it is a desktop product. it is NOT suitable for:

**Web based forms** - Survey Monkey, Typeform and others are a much better fit for this, as VisFile is for exploring documents only, not for input of data

**Business intelligence** - Qlik Sense, Tableau, Power BI are much better for showing business intelligence information






### All features
<img src='https://fundraising.myevent.com/images/common/features.png' />


- connect to different data sources such as Oracle and postgres
- Share data with colleagues
- no dedicated servers required to install - can work off user's machines
- fast setup - can install in seconds















### Comparison with other Data access tools
<img height='350px' src='https://upload.wikimedia.org/wikipedia/commons/4/40/Human-allosaurus_size_comparison.png' />

[PL/SQL Developer](https://www.allroundautomations.com/) - This is a very in depth Oracle SQL tool.

<br>


[RazorSQL](https://razorsql.com/) - A multi-platform database browser

<br>

[Qlik Sense](http://qlik.com) - Qlik allows end users to get reports based on data from multiple data sources in an organisation


<br>

[Tableu](https://www.tableau.com) - Tableu allows end users to get reports based on data from multiple data sources in an organisation


<br>

[IBM Watson analytics](https://www.ibm.com/us-en/marketplace/watson-analytics) - Watson Analytics is used to query Watson's AI datastore


[TOAD](https://www.quest.com/toad/) - the main different from TOAD is that VisiFile only does simple queries. but is FAST.




