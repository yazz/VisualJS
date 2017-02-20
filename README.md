<img src='https://github.com/zubairq/GoShareData/blob/master/public/gosharedata_logo.PNG' />

GoShareData may be for you if:

- You work in a large enterprise
- You work with SQL
- You often send data or SQL snippets to your colleagues
- You would like to see what data your colleagues are working on
- Privacy is important to you and your company
- You would like an easy to install and use tool

##Other Possible Solutions to share data in your company
####Email, Excel, Qlik Sense, Tableue, and many other data tools
<img src='https://github.com/zubairq/GoShareData/blob/master/public/landscape.jpg' />


## The GoShareData Data solution
### GoShareData is building a system so that you can see everything in your organisation
<img src='https://github.com/zubairq/GoShareData/blob/master/public/screenshot.PNG' />

I are still building this data collaboration tool. Here is my progress so far:

* Connect to Oracle and Postgres databases.DONE
* Execute SQL.DONE
* One click .exe for Windows.DONE
* Development environment realtime with Vue.js and GunDB.DONE ***<--- We are here***
* Ability to see other users in my organisation
* Ability to browse datasets



#Table of contents



<div >

    <span style="float: left">
        Think of GoShareData as a way to see all the data that your colleagues are working on
    </span>
</div>



 - [TLDR](#tldr)
 - [Is GoShareData for me?](#is-GoShareData-for-me)
 - [How is GoShareData different to other data tools?](#how-is-GoShareData-different-to-other-data-tools)
 - [Product roadmap](#product-roadmap)
 - [Quick start Windows](#quick-start-windows)
 - [Quick start Mac](#quick-start-mac)
 - [Quick start for Windows](#quick-start-for-windows)
 - [MIT licensing](#mit-licensing)
 - [The long story of GoShareData](#the-long-story-of-GoShareData)
 - [What is GoShareData killer feature?](#what-is-GoShareData-killer-feature)
 - [What is GoShareData not good for?](#what-is-GoShareData-not-good-for)
 - [All features](#all-features)
 - [Differences from TOAD](#differences-from-toad)
 - [Comparison with other Data access tools](#comparison-with-other-data-access-tools)
 - [When will Excel support be available?](#when-will-excel-support-be-available)
 - [When will other databases be supported?](#when-will-other-databases-be-supported)
 - [Deprecated features from April 2013 to December 2016](#deprecated-features-from-april-2013-to-december-2016)
 - [Developer Resources](#developer-resources)






### TLDR
<img src='https://github.com/zubairq/GoShareData/blob/master/resources/public/demoscreen.PNG?raw=true' />

GoShareData is a a tool for people who work wiht data in enterprises. For Windows it canbe downloaded as a .exe file. It is free for personal use or for teams of less than 5 people. Above 5 people it costs USD 50 per person per month.




### Is GoShareData for me?
<img height='350px' src='http://i.imgur.com/QsIsjo8.jpg' />

GoShareData may be for you if you can answer 'yes' to the following:

1. You need to see what data your colleagues are working on
2. You use Postgres or Oracle as your data store











### How is GoShareData different to other data tools?
<img height='350px' src='http://cdn.shopify.com/s/files/1/0070/7032/files/rubberduck.jpg?2841' />

Most data tools fall into either low level data access tools such as TOAD, or high end visualisation tools such as Qlik sense. GoShareData fits into the middle as it can be downloaded on an individuals PC like TOAD, yet it lets you share and explore data like Qlik Sense








### Product Roadmap
<img height='350px' src='http://www.slideteam.net/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/p/r/product_roadmap_timeline_2012_to_2016_road_mapping_future_perspectives_powerpoint_templates_slides_Slide01_2.jpg' />

As of January 2017 GoShareData is in active development. The future product roadmap is as follows:
 - January 2017 - Basic data tool released
 - February 2017 - Team sharing tool released






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
