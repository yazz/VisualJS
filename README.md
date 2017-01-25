##The Problem
####People working in large enterprises would like to share the data they have access to with their colleagues
<img src='https://github.com/zubairq/yazz/blob/master/public/collab.gif' />

##Possible solutions
####Email, Excel, Qlik Sense, Tableue, and many other data tools
<img src='https://github.com/zubairq/yazz/blob/master/public/landscape.jpg' />


## The Yazz Data solution
### Yazz is building a system so that you can see everything in your organisation
<img src='https://github.com/zubairq/yazz/blob/master/public/screenshot.PNG' />

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
        Think of Yazz as a way to see all the data that your colleagues are working on
    </span>
</div>



 - [TLDR](#tldr)
 - [Is Yazz for me?](#is-yazz-for-me)
 - [How is Yazz different to other data tools?](#how-is-yazz-different-to-other-data-tools)
 - [Product roadmap](#product-roadmap)
 - [Quick start Windows](#quick-start-windows)
 - [Quick start Mac](#quick-start-mac)
 - [Quick start for Windows](#quick-start-for-windows)
 - [MIT licensing](#mit-licensing)
 - [The long story of Yazz](#the-long-story-of-yazz)
 - [What is Yazz killer feature?](#what-is-yazz-killer-feature)
 - [What is Yazz not good for?](#what-is-yazz-not-good-for)
 - [All features](#all-features)
 - [Differences from TOAD](#differences-from-toad)
 - [Comparison with other Data access tools](#comparison-with-other-data-access-tools)
 - [When will Excel support be available?](#when-will-excel-support-be-available)
 - [When will full Postgres realtime support be available?](#when-will-full-postgres-realtime-support-be-available)
 - [Deprecated features from April 2013 to July 2014](#deprecated-features-from-april-2013-to-july-2014)
 - [Deprecated features from August 2014 to June 2015](#deprecated-features-from-august-2014-to-june-2015)
 - [Anatomy of an Yazz application](#anatomy-of-a-yazz-application)
 - [Getting started](#getting-started)
 - [Adding something to the web page](#adding-something-to-the-web-page)
 - [Firing events](#firing-events)
 - [Calling server side code](#calling-server-side-code)
 - [List of functions](#list-of-functions)
 - [Recommendations when building your first Yazz app](#recommendations-when-building-your-first-yazz-app)
 - [Deploying an Yazz web app to a Java server as a WAR file](#deploying-an-yazz-web-app-to-a-java-server-as-a-war-file)
 - [Developer Resources](#developer-resources)






### TLDR
<img src='https://github.com/zubairq/yazz/blob/master/resources/public/demoscreen.PNG?raw=true' />

Yazz is a a tool for people who work wiht data in enterprises. For Windows it canbe downloaded as a .exe file. It is free for personal use or for teams of less than 5 people. Above 5 people it costs USD 50 per person per month.




### Is Yazz for me?
<img height='350px' src='http://i.imgur.com/QsIsjo8.jpg' />

Yazz may be for you if you can answer 'yes' to the following:

1. You need to see what data your colleagues are working on
2. You use Postgres or Oracle as your data store











### How is Yazz different to other data tools?
<img height='350px' src='http://cdn.shopify.com/s/files/1/0070/7032/files/rubberduck.jpg?2841' />

Most data tools fall into either low level data access tools such as TOAD, or high end visualisation tools such as Qlik sense. Yazz fits into the middle as it can be downloaded on an individuals PC like TOAD, yet it lets you share and explore data like Qlik Sense








### Product Roadmap
<img height='350px' src='http://www.slideteam.net/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/p/r/product_roadmap_timeline_2012_to_2016_road_mapping_future_perspectives_powerpoint_templates_slides_Slide01_2.jpg' />

As of January 2017 Yazz is in active development. The future product roadmap is as follows:
 - January 2017 - Basic data tool released
 - February 2017 - Team sharing tool released






### Quick start Windows
<img height='350px' src='http://vignette4.wikia.nocookie.net/uncyclopedia/images/b/bb/Xplogo.jpg/revision/latest?cb=20140331164120' />


#####1) Install GIT from https://git-scm.com/downloads
#####2) Install Node.js 6.9.1 32 bit installer from https://nodejs.org/en/blog/release/v6.9.1/
#####3) git clone https://github.com/zubairq/yazz.git
#####4) cd yazz
#####5) npm install
#####6) npm run build
#####7) node src\index.js

###If you wish to edit Yazz in realtime on Windows then you need the following additional steps

#####8) Make a note of the machine's IP address from the shell, something like:
    node src\index.js
    '192.168.2.87'
    addr: 192.168.2.87

#####9) Open yazz\src\main.js

#####10) Find the line:
    const gun_ip_address = '43.47.1.45'

#####11) Replace it with the IP address from above:
    const gun_ip_address = '192.168.2.87'

#####12) Open a new command line prompt in Windows which should opoen to the "yazz" folder 

#####13) Type into the command line:
    npm run dev

#####14) Open http://localhost:8080/public/

#####15) Go to yazz\src\components\App.vue

#####16) Change the text "Browse Data" to "Live Editing"

#####17) When you save the file then your changes should be updated in real time in the browser









### Quick start Mac
<img height='350px' src='http://www.alessioatzeni.com/mac-osx-lion-css3/res/img/MacOSX.png' />

#####1) Install GIT from https://git-scm.com/downloads
#####2) Install Node.js 6.9.1 for Mac OS X from https://nodejs.org/en/blog/release/v6.9.1/
#####3) git clone https://github.com/zubairq/yazz.git
#####4) cd yazz
#####5) npm install
#####6) npm run build
#####7) sudo node src/index.js

###If you wish to edit Yazz in realtime on OS X then you need the following additional steps

#####8) Make a note of the machine's IP address from the shell, something like:
    $ sudo node src/index.js
    '192.168.2.87'
    addr: 192.168.2.87

#####9) Open yazz/src/main.js

#####10) Find the line like:
    const gun_ip_address = '43.47.1.45'

#####11) Replace it with the IP address from above:
    const gun_ip_address = '192.168.2.87'

#####12) Open a new shell.

#####13) sudo npm run dev

#####14) Open http://localhost:8080/public/

#####15) Go to yazz/src/components/App.vue

#####16) Change the text "Browse Data" to "Live Editing"


#####17) when you save the file then your changes should be updated in real time in the browser
















### The long story of Yazz
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






### What is Yazz's killer feature?
<img height='350px' src='http://blog.wiserspread.com/wp-content/uploads/2014/07/Killer.jpg' />


Yazz's killer feature is being able to share snippets of your data with your colleagues. So for example, you may have some SQL to show you a total of monthly sales. this can be shared as a data snippet, instead of cutting and pasting SQL results and emailing them to colleagues.












### What is Yazz not good for?
<img height='350px' src='http://918thefan.com/wp-content/uploads/2012/05/anthony-taber-square-peg-looking-at-round-hole-thinking-with-a-proper-diet-moderate-bu-new-yorker-cartoon-e1336682469227.jpg' />


Yazz is unsuitable for quite a wide variety of data needs, since it is a desktop product. it is NOT suitable for:

**Small businesses** - Since yazz needs an intranet to work, it is unsuitable for most small businesses, as they do not have their own network

**Regulatory reporting** - yazz Data is a tool to help you understand and share your data, but it is not for full blown professional reporting

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

the main different from TOAD is that Yazz only does simple queries. but is FAST.






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
<img height='350px' src='http://siliconangle.com/files/2013/03/Oracle-Empire-Under-Threat.jpg' />

Excel support is under development





### When will full Postgres realtime support be available?
<img height='350px' src='https://scottlinux.com/wp-content/uploads/2014/11/postgres.png' />

Postgres is supported now.

The realtime support for Yazz is based around the pinciples of the Meteor.js realtime system. Just like Meteor, Yazz also uses a client side cache connected to a server which contains the full data for each connected client.

With Meteor.js it uses a client side cache called MiniMongo which gets updates from the MongoDb server by uses Mongo Oplog tailing to get changes from the Mongo database. The first version of Yazz realtime database support uses the Postgres database to detect when changes are made.




### Deprecated features from April 2013 to July 2014
<img height='350px' src='http://www.pixelle.be/wp-content/uploads/2014/01/2013-origami.jpg' />

In 2013 Facebook created React, a Virtual Dom based Javascript library. David Nolen then created Om, a ClojureScript wrapper on top of React, which changed the ClojureScript client side story forever! Upon seeing Om I immediately knew that this was the future of ClojureScript development, using a Reactive GUI paradigm, also similar to Angular.js, Ember.js, and Meteor. So I took the tough decision to deprecate the whole UI that I had created in the previous version of Yazz. So the following features are now a thing of the past:

- Crate for HTML
- Dommy
- Domina
- JayQ for JQuery integration
- Google Closure UI Library

:and the following things stayed or were added:

- React.js via Om for the front end
- Interactive client and server side development with LightTable IDE
- Integration with Mandrill for sending transactional emails
- Twitter Bootstrap 3.0 for styling
- Google Closure for advanced compression
- clj-http for server side HTTP requests
- SQL Korma for database requests
- Compojure, Ring, and Shoreleave for server side code
- core.async for a client-side synchronous programming model

The reason for the discontinued features is that they all require explicit calls to manipulate the DOM, which is oppisite to the way that Facebook React works. If you still wish to use the discontinued features then you can use an older version of the Yazz framework.







### Deprecated features from August 2014 to June 2015
<img height='350px' src='http://www.weather.gov/images/gid/events/2014/dec/yearend2014/images/2014_logo.jpg' />

Even though in 2014 Yazz switched to using React.js via David Nolen's awesome Om library, building applications still didn't feel as natural as it should. This was mostly because data access still didn't feel right. One thing that was a huge influence was meteor.js, which provided real time webapps ove Mongodb. Realtime may seem simple, but to program a web application to update data as data changes without something like meteor.js soon becomes very complicated, as you need to add timers and callbacks for data everywhere. Since Yazz used Neo4j as a backend I wanted to create a similar live uploading method for Yazz. It was not as simple as I thought, as Neo4j has a far more complex data structure than the document based MongoDb. So I had to make the tough decision to postpone Neo4j work on Yazz for the time being. Since NemCV used a database backend anyway I decided to base it on a database instead. My idea is that you can program SQL directly in React.js components, for which I also chose Instaparse, which blows my mind!

Another thing that was dropped was something very dear to my heart, LighttTable. The latest version of Light Tavble was not able to support interactive development with the latest Clojurescript versions. Also, it kept pauses every minute or so for several seconds, so I started to look for alternatives. I used Cursive and Intellij, although emacs or any other text editor works fine too. To replace the killer Light Table feature of live browser code changes I discovered Figwheel, which lets you save a file, then sends the recompiled javascript to the browser. When the new Atom based LightTable comes out the story may change again however.

So the following features were dropped:

- Exclusive use of the Light Table IDE
- Neo4j as the main data provider
- Web session playback to understand customer behaviour - (there are better web UI recording tools on the market anyway)
- AB testing built in (will be added in future maybe, but not for now)

:and the following things stay:

- React.js via Om for the front end
- Instaparse for parsing client side SQL
- Integration with Mandrill for sending transactional emails
- Twitter Bootstrap 3.0 for styling
- Google Closure for advanced compression
- clj-http for server side HTTP requests
- SQL Korma for database requests
- Compojure, Ring, and Shoreleave for server side code
- core.async for a client-side synchronous programming model

Again, if you still wish to use the discontinued features then use an older version of the Yazz framework from March 2015.









### Anatomy of a Yazz application
<img height='350px' src='http://st2.depositphotos.com/1036342/6768/v/380/depositphotos_67681953-Searching-computer-code-with-a-magnifying-glass-HD-video-1080.jpg' />

    my_new_application
        └ links.txt
          ... links to common resources of your web applicaiton
        └ README.md
          project.clj

        └ srcbase - the default environment when you install Yazz
            └ srcbase
                └ myYazz
                    └ main_app.cljs

            └ webapp_config
                └ settings.clj

          src
              └ webapp
                  └ client
                      └ react
                          └ components
                              └ company_details.cljs
                                ... more Om/React components you define...
                          └ views
                              └ main.cljs
                                ... more main views which you define...

                        init.cljs

                             ...
                    server
                        └ fns.clj - server side functions go here

                    framework
                        └ client
                              ...
                          server
                              ...

          resources
              └ public
                    main.html - copy this for your own main page


    srcprod
        └ webapp_config
            └ settings.clj - copy srcbase to define your production environemnt

    srctest
        └ webapp_config
            └ settings.clj - copy srcbase yourself to define your test environemnt

    srcdev
        └ webapp_config
            └ settings.clj - copy srcbase to define your development environemnt









### Getting started
<img height='350px' src='http://cookbooks.ca.com/caarcserve/wp-content/uploads/sites/52/2014/06/getting-started-new.jpg' />

#####1) Install a Postgres database with user name 'postgres' and password as 'manager'

#####2) Install and build Yazz from Github:

    git clone https://github.com/zubairq/Yazz.git my_new_application
    cd my_new_application
    lein with-profile base figwheel


#####3) Open the application

    http://127.0.0.1:3449











### Adding something to the web page
<img height='350px' src='http://beckswebsites.com/wp-content/uploads/2014/05/Web-Designer.jpg' />

#####1) Make a change and see Figwheel reload the changes live.

Edit the file

    src/webapp/framework/client/components/main.cljs

and change

    "Build database webapps with Clojure"

to

    "Figwheel made a live change!".

Save the file and the text should change in the live web app


#####2) To see debug mode open:

    http://127.0.0.1:3449/main.html?livedebug=true



3) This is the default page that you see when you start Yazz as a web app, so there should be a function which looks something like this:

    (defn-ui-component     main-view   [app]

        (div nil
            (h2 nil "Yazz")
            "Build webapps with Neo4j"))


4) Change the text from "Build webapps with Neo4j" to "Hello World" so that it looks like this:

    (defn-ui-component     main-view   [app]

        (div nil
            (h2 nil "Yazz")
            "Hello World"))     <-- This line changed

You may wonder where the elements div, h2 , and so on are defined. They are defined at the top of the file in the Yazz namespace, defined with Om at the top of every Clojurescript file:

    (:require
        [webapp.framework.client.coreclient   :as c ])
    (:use-macros
        [webapp.framework.client.coreclient  :only [defn-ui-component def-coils-app
                                                    container  map-many  inline  text
                                                    div img pre component h2 input section
                                                    write-ui read-ui container input component <--
                                                    h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect
                                                    ]]))

4) Save the file and the figwheel should swap out the whole page with the text "Hello world" in the web browser, no browser reload required!

We actually cheated in the above example as we edited the Yazz framework itself, but it was just to get you to make a change as fast as possible. In an actual applicaiton we would ask you to make another file for your own GUI components













### List of functions
<img height='350px' src='http://blogs.ukoln.ac.uk/good-apis-jisc/files/2009/03/api1.gif' />

There are many Yazz framework functions available:


**sql** - Calls the server and executes SQL and returns it to the client

    (go
         (let [
                 search-db-for-user   (sql "SELECT * FROM users where user_name = ?"  [username] )
                 user-already-exists  (pos? (count search-db-for-user))
              ]
                 (if user-already-exists ...


**read-ui** - Only can be called from GUI components. Note that GUI components can
only read and write the UI tree, NOT the data tree

    (c/div  {:style {:height "100%" :width "100%"}}
          (let [all-company-records    (c/read-ui  companies [:values] )]
               ....


**write-ui** - Used to write to the UI tree from GUI components. Again, only the UI tree
can be written to, NOT the data tree when in a GUI component

    (c/dom/button {:onClick (fn [e] (c/write-ui  ui-data [:submit :value]  true))
                     :style {:margin-top "10px"}}

                "Connect")



**==ui** - Test for a value in the UI tree. In this case we are saying that
when the splash screen is clicked then 1) Remove the click event, 2) Stop
showing the splash screen

    (==ui  [:ui :splash-screen :click]   true

        (do
            (-->ui [:ui  :splash-screen  :click]  false)
            (-->ui [:ui  :splash-screen  :show]   false)))




**-->ui** - Write to the UI tree a value

    (==ui  [:ui :splash-screen :click]   true

        (do
            (-->ui [:ui  :splash-screen  :click]  false)
            (-->ui [:ui  :splash-screen  :show]   false)))










### Firing events
<img height='350px' src='http://blog.vanillasoft.com/wp-content/uploads/2014/08/trigger-event.jpg' />

If you want to execute an event you have to decide whether you are listening to the data tree or the UI tree. For example, if you want to perform an action when the use presses a button then you would do something like this:

    (==ui  [:ui   :company-details   :clicked]    true

          (-->ui  [:ui  :company-details   :clicked  ] false)
          (-->ui  [:ui  :tab-browser    ] "top companies"))

So this means that with Yazz, the preferred way to do things is with events, which are triggered by any of the following:

- timers
- changes in the UI tree (because of user actions such a clicking a button)
- changes in the data tree







### Calling server side code
<img height='350px' src='http://www.realtime.co/cache_bin/XPQlr0QXX291A7SyScZMb1ZKU.jpg' />

From the client side core.async is used:


    (go
        (let [server-response   (remote  say-hello  {:name "Johnny"})]
            (js/alert (:text server-response))))

: which can also be written as:

    (server-call
        (let [server-response   (remote  say-hello  {:name "Johnny"})]
            (js/alert (:text server-response))))



Define in fns.clj on the server side:

    (defn say-hello [{name :name}]
        {:text (str "Hello " name))})







### Client side SQL
<img height='350px' src='https://basichackingskills.files.wordpress.com/2013/04/sql_injection.jpg' />

    (go
        (let [results (sql "SELECT * FROM test_table where name = ?" ["shopping"] )]
            ... do something with results

:or with the SQL directly:

    (go
        (let [results (select * FROM test_table where name = ? ["shopping"] )]
            ... do something with results


Please note that the raw SQL is not visible from web browsers since it's encryted through a server side macro. Such macros are a feature unique to Clojure and other [Lisps](https://en.wikipedia.org/wiki/Lisp_(programming_language)#List_structure_of_program_code.3B_exploitation_by_macros_and_compilers).









###Quick start for Windows
- Install Postgres database from http://www.postgresql.org/download/windows/
- Download GIT from https://git-scm.com/downloads
- Download the Yazz code using "git clone https://github.com/zubairq/Yazz.git" my_new_application
- cd my_new_application
- Download Leiningen from https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein.bat
- Run "lein.bat self-install"
- Download and install Java 8 from http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
- Run "lein with-profile base figwheel"




#### MIT licensing
[(As in Ruby on Rails freedom)](http://opensource.org/licenses/mit-license.php)





### Recommendations when building your first Yazz app
<img height='350px' src='http://www.lonelyplanet.com/travel-blog/tip-article/wordpress_uploads/2012/08/126978435_full_cs.jpg' />

1) Copy **main.html** and make your own **app_name.html** file in the **resources** folder

2) Copy the **srcbase** folder and rename it **srcdev**. Edit this profile to be **dev** in **settings.clj**

3) Copy **webapp/framework/client/init.cljs** to **webapp/client/init.cljs**

4) In **webapp/client/init.cljs** change the namespace to **webapp.client.init**

5) Copy **src/webapp/framework/client/components/main.cljs** to **src/webapp/client/react/views/main.cljs**

6) Rename the namespace in **webapp.client.components.main_view.cljs** from **webapp.framework.client.components.main-view** to **webapp.client.react.components.main-view**. This will be at the top of the file (ns webapp.client.react.views.main-view)

7) In init.cljs change    **[webapp.framework.client.components.main-view  :only  [main-view]]** to **[webapp.client.react.main-view   :only   [main-view]]**

8) In **src/webapp/client/react/views/main.cljs** change the text to **Welcome to my new app**

9) Load **127.0.0.1:3449/app_name.html** and you should see your new application page

Alot of steps, I know!!!












### Deploying an Yazz web app to a Java server as a WAR file
<img height='350px' src='https://host4asp.net/ckfinder/images/deploy-with-webmatrix-using-web-deploy.jpg' />

    mkdir srcprod && cd srcprod
    mkdir webapp_config && cd webapp_config

    touch settings.clj
    ... copy and amend the settings from coils/srcdev/webapp_config/settings.clj ...

    cd ../../coils

    lein with-profile prod cljsbuild clean
    lein with-profile prod cljsbuild once

    lein with-profile prod ring uberwar
    ... deploy the resulting war file ...



















### Developer Resources
<img height='350px' src='https://webkori.files.wordpress.com/2009/12/billgates_microsoft_support_team-santosh-kori.jpg' />

Building an application with Yazz? https://groups.google.com/forum/#!forum/Yazzco

Ask a question: http://stackoverflow.com/search?q=Yazz
Interested in contributing to Yazz?

Issue tracker: https://github.com/zubairq/Yazz/issues
Contribution guidelines: https://github.com/zubairq/Yazz/graphs/contributors
