## GoShareData - Share your Team Data on the Raspberry PI


<div style='text-align: center; width: 100%;'>
<p align="center">
    <img src='https://github.com/zubairq/GoShareData/blob/master/public/gosharedata_logo.PNG' />
    </p>
</div>

<p align="center">
    <img src='http://gosharedata.com/gosharedata/images/img_1514.jpg' />
    </p>
</div>
	
	
	
As a hobby, in October 2016 I started building GoShareData as an Open Source Project to solve a problem that I have faced at every large company, which is "How do I access and share frequently used data on my computer"?

The product is built with:

- VueJS 2 and Vuex
- GunDB
- Javascript
- NodeJS
- Express



The current progress so far from October 2016 - May 2017:

- 259 stars on Guthub: https://github.com/zubairq/gosharedata
- I am still the only user of the product
- The product is a downloadable Windows application that can be downloaded and run for Windows or Mac within 1 minute on a fast connections
- There is a test homepage at gosharedata.com where you can download the product
- Used for very basic tasks like making queries to different databases so far, mainly because it is so fast to load compared to other data access tools like TOAD
- Support for Postgres and Oracle databases works
- A meetup group at https://www.meetup.com/gosharedata/ has had 11 events, a couple from me, and the rest which Suomen Chatterjee uses to promote his work with the SQL Server databases
- The product works on Internet explorer, Safari, Firefox and Chrome
- One click .exe for Windows


Upcoming tasks scheduled for June 2017:

- Only have the 2 dedicated servers until 10 June. I have asked to get another 3 months trial. If they say no then I have to find the cheapest hosting provider that I can get, since this is open source
- Need to make a clear message on the website
- Allow all local Excel and CSV files to be read in
- Build a file browser in to be able to select a file to link to
- Add MySQL, Microsoft SQL Server, Maria DB
- Be able to browse the SQL Schemas
- Show the product at a GoShareData meetup
- Get small companies to use it to share their databases
- Make Links work on the product
- Write more data articles on LinkedIn 



Future roadmap

- Enable an export to the Eve Language
- Send data or SQL snippets to your colleagues
- See what data your colleagues are working on
- Ability to see other users in my organisation
- Ability to browse datasets


Current thinking about monetization:

- Free for up to 5 users in an organisation and then $10 per user per month
- Free for personal use. $200 per year for commercial use per user





GoShareData currently is:

- a download for Windows that lets you query a Postgres databas (Down here http://GoShareData.com)

Command line options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --type [type]          Add the specified type of app [type]
    -p, --port [port]          Which port should I listen on? [port]
    -h, --host [host]          Server address of the central host [host]
    -s, --hostport [hostport]  Server port of the central host [hostport]




## The GoShareData Data solution
### GoShareData is building a system so that you can see everything in your organisation
<img src='https://github.com/zubairq/GoShareData/blob/master/public/screenshot.PNG' />









### Quick start Windows
<img height='350px' src='http://vignette4.wikia.nocookie.net/uncyclopedia/images/b/bb/Xplogo.jpg/revision/latest?cb=20140331164120' />


#####1) Install GIT from https://git-scm.com/downloads
#####2) Install Node.js 6.9.1 32 bit installer from https://nodejs.org/en/blog/release/v6.9.1/
#####3) git clone https://github.com/zubairq/GoShareData.git
#####4) cd GoShareData
#####5) npm install
#####6) npm run build
#####7) node src\index.js

###If you wish to edit GoShareData in realtime on Windows then you need the following additional steps

#####8) Make a note of the machine's IP address from the shell, something like:
    node src\index.js
    '192.168.2.87'
    addr: 192.168.2.87

#####9) Open GoShareData\src\main.js

#####10) Find the line:
    const gun_ip_address = '43.47.1.45'

#####11) Replace it with the IP address from above:
    const gun_ip_address = '192.168.2.87'

#####12) Open a new command line prompt in Windows which should opoen to the "GoShareData" folder 

#####13) Type into the command line:
    npm run dev

#####14) Open http://localhost:8080/public/

#####15) Go to GoShareData\src\components\App.vue

#####16) Change the text "Browse Data" to "Live Editing"

#####17) When you save the file then your changes should be updated in real time in the browser









### Quick start Mac
<img height='350px' src='http://www.alessioatzeni.com/mac-osx-lion-css3/res/img/MacOSX.png' />

#####1) Install GIT from https://git-scm.com/downloads
#####2) Install Node.js 6.9.1 for Mac OS X from https://nodejs.org/en/blog/release/v6.9.1/
#####3) git clone https://github.com/zubairq/GoShareData.git
#####4) cd GoShareData
#####5) npm install
#####6) npm run build
#####7) sudo node src/index.js

###If you wish to edit GoShareData in realtime on OS X then you need the following additional steps

#####8) Make a note of the machine's IP address from the shell, something like:
    $ sudo node src/index.js
    '192.168.2.87'
    addr: 192.168.2.87

#####9) Open GoShareData/src/main.js

#####10) Find the line like:
    const gun_ip_address = '43.47.1.45'

#####11) Replace it with the IP address from above:
    const gun_ip_address = '192.168.2.87'

#####12) Open a new shell.

#####13) sudo npm run dev

#####14) Open http://localhost:8080/public/

#####15) Go to GoShareData/src/components/App.vue

#####16) Change the text "Browse Data" to "Live Editing"


#####17) when you save the file then your changes should be updated in real time in the browser
















### The long story of GoShareData
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












### What is GoShareData not good for?
<img height='350px' src='http://918thefan.com/wp-content/uploads/2012/05/anthony-taber-square-peg-looking-at-round-hole-thinking-with-a-proper-diet-moderate-bu-new-yorker-cartoon-e1336682469227.jpg' />


GoShareData is unsuitable for quite a wide variety of data needs, since it is a desktop product. it is NOT suitable for:

**Small businesses** - Since GoShareData needs an intranet to work, it is unsuitable for most small businesses, as they do not have their own network

**Regulatory reporting** - GoShareData Data is a tool to help you understand and share your data, but it is not for full blown professional reporting

**Web based forms** - Survey Monkey, Typeform and others are a much better fit for this

**Realtime data analysis** - Up coming tools such as Appollo, and Eve are much better suited for this






### All features
<img src='https://fundraising.myevent.com/images/common/features.png' />


- connect to different data sources such as Oracle and postgres
- Share data with colleagues
- no dedicated servers required to install - can work off user's machines
- fast setup - can install in seconds
- free to use up to 5 users
- Google Closure for advanced Javascript compression







### Differences from TOAD
<img height='350px' src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Om.svg/993px-Om.svg.png' />

the main different from TOAD is that GoShareData only does simple queries. but is FAST.






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






### When will Excel support be available?
<img height='350px' src='https://udemy-images.udemy.com/course/750x422/164058_e914_2.jpg' />

Excel support is under development





### When will other databases be supported?
<img height='350px' src='https://scottlinux.com/wp-content/uploads/2014/11/postgres.png' />

Only Oracle and Postgres is supported now.

Other data sources that are planned to be supported are MySql, MongoDB, GunDB, RethinkDB, CSV files, IBM DB2, Microsoft SQL Server and many others.




### Deprecated features from April 2013 to December 2016
<img height='350px' src='http://www.pixelle.be/wp-content/uploads/2014/01/2013-origami.jpg' />

In 2013 GoShareData aimed to be a full framework for viewing, editing, and building applications on data. The scope has been drastically reduced now to just be a system to share data.








### Developer Resources
<img height='350px' src='https://webkori.files.wordpress.com/2009/12/billgates_microsoft_support_team-santosh-kori.jpg' />

GoShareData on gitter: https://gitter.im/GoShareDatadevs/

Building an application with GoShareData? https://groups.google.com/forum/#!forum/GoShareDataco

Ask a question: http://stackoverflow.com/search?q=GoShareData
Interested in contributing to GoShareData?

Issue tracker: https://github.com/zubairq/GoShareData/issues
Contribution guidelines: https://github.com/zubairq/GoShareData/graphs/contributors
