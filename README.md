### Build and share applications by dragging and dropping blocks
<img src='https://github.com/zubairq/yazz/blob/master/resources/public/demoscreen.PNG?raw=true' />





###Quick start for Windows
- Install Postgres database from http://www.postgresql.org/download/windows/
- Download GIT from https://git-scm.com/downloads
- Download the Appshare code using "git clone https://github.com/zubairq/AppShare.git" my_new_application
- cd my_new_application
- Download Leiningen from https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein.bat
- Run "lein.bat self-install"
- Download and install Java 8 from http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
- Run "lein with-profile base figwheel"





[(See why)](http://www.canlabs.com/canlabs/coils-to-appshare.html)

#### MIT licensing
[(As in Ruby on Rails freedom)](http://opensource.org/licenses/mit-license.php)

Click the image to see the video
[![IMAGE Click here to see video](http://coils.cc/coils/images/enterpriseapp.jpg)] (http://www.youtube.com/watch?v=CzwikfCAdws)

<div >

    <span style="float: left">
        <pre>
        React + SQL + Clojurescript
        =
        Amazing realtime enterprise webapps!
        </pre>
    </span>
</div>



 - [TLDR](#tldr)
 - [Is AppShare for me?](#is-appshare-for-me)
 - [How is AppShare different to other web frameworks?](#how-is-appshare-different-to-other-web-frameworks)
 - [Is it secure to have SQL in the UI code?](#is-it-secure-to-have-sql-in-the-ui-code)
 - [Product roadmap](#product-roadmap)
 - [Quick start Postgres](#quick-start-postgres)
 - [Quick start Oracle](#quick-start-oracle)
 - [The long story of AppShare](#the-long-story-of-appshare)
 - [What is AppShare killer feature?](#what-is-appshare-killer-feature)
 - [What is AppShare not good for?](#what-is-appshare-not-good-for)
 - [All features](#all-features)
 - [Differences from Om](#differences-from-om)
 - [Comparison with other Clojure web frameworks](#comparison-with-other-clojure-web-frameworks)
 - [When will Neo4j be back on the scene?](#when-will-neo4j-be-back-on-the-scene)
 - [When will full Oracle realtime support be available?](#when-will-full-oracle-realtime-support-be-available)
 - [When will full Postgres realtime support be available?](#when-will-full-postgres-realtime-support-be-available)
 - [Deprecated features from April 2013 to July 2014](#deprecated-features-from-april-2013-to-july-2014)
 - [Deprecated features from August 2014 to June 2015](#deprecated-features-from-august-2014-to-june-2015)
 - [Anatomy of an AppShare application](#anatomy-of-a-appshare-application)
 - [Getting started](#getting-started)
 - [Adding something to the web page](#adding-something-to-the-web-page)
 - [Firing events](#firing-events)
 - [Calling server side code](#calling-server-side-code)
 - [List of functions](#list-of-functions)
 - [Recommendations when building your first AppShare app](#recommendations-when-building-your-first-appshare-app)
 - [Deploying an AppShare web app to a Java server as a WAR file](#deploying-an-appshare-web-app-to-a-java-server-as-a-war-file)
 - [Developer Resources](#developer-resources)






### TLDR
<img src='http://damiaodias.typepad.com/.a/6a014e882a9af0970d01a3fcbe2289970b-pi' />

AppShare lets you build web apps using Clojure and relational databases, with SQL directly in the UI code:

    (defn-ui-component  my-todo-app   [app] {}

        (select id, item from todo_items
            {}
            (container
                (inline "10%" (str (<-- :id)))  (inline "80%" (str (<-- :item))))))

The language used is Clojure/Clojurescript and the supports Postgres 9+ and Oracle 11+.




### Is AppShare for me?
<img height='350px' src='http://i.imgur.com/QsIsjo8.jpg' />

AppShare may be for you if you can answer 'yes' to the following:

1. You want a batteries included opinionated web framework like Rails or Meteor
2. You believe that Clojurescript is cool
3. The Postgres database and SQL is a good match for your problem domain











### How is AppShare different to other web frameworks?
<img height='350px' src='http://cdn.shopify.com/s/files/1/0070/7032/files/rubberduck.jpg?2841' />

To show data on a webpage most frameworks require a developer to have code in three different places:

- Code to display UI components
- Code to bind UI components to a back end using AJAX callbacks
- Server side code to read a data store and return this to the web browser

This means that a webapp will typically will have code to show data on a webpage spread out in three different places. AppShare simplifies these three steps by moving the data acess directly into the UI components. So instead of writing code in three places, you just write it in one place, in the UI component itself:

    (select id, item from todo_items
                {}
                (container
                    (inline "10%" (str (<-- :id)))  (inline "80%" (str (<-- :item))))))

This greatly simplifies the building of database based webapps.








### Is it secure to have SQL in the UI code?
<img height='350px' src='http://38.media.tumblr.com/b5ae76c4f7f9ca3732eec9d19a5d5663/tumblr_inline_mugyqbcTcZ1qclfey.jpg' />


It may seem strange that you can call SQL synchronously from the client yet the call is sent to the server, is secure, and behaves asynchronous internally. Welcome to the world of Lisp!

To understand a bit more about this you need to realise that Clojure is an implementation of Lisp on the JVM, and Clojurescript is an implementation of Lisp on Javascript. Lisp itself has alot of special features which are not available in other languages, such as the ability to write code itself, also known as Lisp Macros. This ability is not available as a first class feature in almost every other language.

Before I stray too much away from the point, there are two parts of the Clojure implementation of Lisp that allows synchronous secure client-side SQL:

- core.async
- macros (not like C++ macros. Same name, but a totally different thing!)

When you make a client side SQL/Cypher call it is encyrpted using a Macro at compile time:

    (defmacro sql [sql-str params]
        `(webapp.framework.client.coreclient.sql-fn
            ~(encrypt sql-str)
            ~params))

This means that the string in a client side SQL call...

    (go
        (log (pr-str (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))

... will be rewritten at compile time, making it impossible for anyone who does "View source" on your web page to see the SQL code!









### Product Roadmap
<img height='350px' src='http://www.slideteam.net/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/p/r/product_roadmap_timeline_2012_to_2016_road_mapping_future_perspectives_powerpoint_templates_slides_Slide01_2.jpg' />

As of June 2015 AppShare is in active development and is used in production systems. The future product roadmap is as follows:
 - November 2015 - make all SQL queries fully realtime like Meteor.js
 - December 2016 - Renamed product to AppShare
 - January 2016 - Alpha version of Hosted version available
 - July 2016 - hosted development environment so you can build Clojurescript database webapps using just a web browser









### Quick start Postgres
<img height='350px' src='http://www.postgresql.org/media/img/about/press/elephant.png' />

Postgres is described first and is the default in AppShare simply because it is the more common developer setup. and is also easier to setup than Oracle.

#####1) Install the Postgres database product with a user called 'postgres' and password 'manager' in the schema 'postgres'

#####2) Install and build AppShare from Github:

    git clone https://github.com/zubairq/AppShare.git my_new_application
    cd my_new_application
    lein with-profile base figwheel


#####3) Open the application

    http://127.0.0.1:3449


#####4) Make a change and see Figwheel reload the changes live.

Edit the file

    srcbase/myappshare/main_app.cljs

and change

    "Build database webapps with Clojure"

to

    "AppShare made a live change using Figwheel!".

Save the file and the text should change in the live web app


#####5) To see debug mode open:

    http://127.0.0.1:3449/main.html?livedebug=true












### Quick start Oracle
<img height='350px' src='http://littlehandytips.com/wp-content/uploads/2010/08/oraclesw.jpg' />

Oracle is a lot more tricky to set up compared to Postgres. We recommend using the latest version, Oracle 12c, since it has support for auto IDs, which mean that you can have autogenerated IDs on all of your tables.

#####1) Install the Oracle database product

#####2) Create the table

ORACLE 12c and above:

    CREATE TABLE todo_items
    (
      id NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
      item VARCHAR(128) ,
      UNIQUE (id)
    );

For Oracle databases before 12c you will need to use a trigger. See this Stackoverflow question for more details:

http://stackoverflow.com/questions/11296361/how-to-create-id-with-auto-increment-on-oracle


#####3) Install AppShare from Github:

    git clone https://github.com/zubairq/AppShare.git my_new_application
    cd my_new_application



#####4) Confgure Oracle to work with AppShare:

    One problem with using Oracle form Clojure is that Oracle do not supply the Official driver for the database on Clojars which Leiningen uses for libraries. So a third party has supplied an Oracle library which AppShare uses. Unfortunately this means that the following must be added to the oracle sqlnet.ora file:

    SQLNET.ALLOWED_LOGON_VERSION=8




#####4) Configure AppShare to run with Oracle

In the file settings.clj comment out the Postgres settings and uncomment the Oracle settings:


     ;(defonce ^:dynamic *database-type* "postgres")
     ;(defonce ^:dynamic *database-server* "127.0.0.1")
     ;(defonce ^:dynamic *database-user* "postgres")
     ;(defonce ^:dynamic *database-password* "manager")
     ;(defonce ^:dynamic *database-name* "postgres")

     (defonce ^:dynamic *database-type* "oracle")
     (defonce ^:dynamic *database-server* "localhost")
     (defonce ^:dynamic *database-name* "ORCL")
     (defonce ^:dynamic *database-user* "system")
     (defonce ^:dynamic *database-password* "Manager2")


#####5) Build and run AppShare:

    lein with-profile base figwheel



#####6) Open the application

    http://127.0.0.1:3449


#####7) Make a change and see Figwheel reload the changes live.

Edit the file

    srcbase/myappshare/main_app.cljs

and change

    "Build database webapps with Clojure"

to

    "AppShare made a live change using Figwheel!".

Save the file and the text should change in the live web app


#####8) To see debug mode open:

    http://127.0.0.1:3449/main.html?livedebug=true













### The long story of AppShare
<img height='350px' src='http://makeameme.org/media/created/Its-a-long.jpg' />


The AppShare framework started because of one web developer's pain over many years building web applications. Zubair Quraishi worked in the 1990s and 2000s as a C++ and Java programmer, building mostly server side web applications, only to find the whole develop, compile, test cycle hugely unproductive.

Then one day in 2008 Zubair discovered Ruby on Rails. He realised that there was a better way to develop web software by using interactive languages such as Ruby with easy database access via ActiveRecord. However, he soon became frustrated again, as the UI in Rails was generated on the server and fine grained control of the DOM was not easy to do without resorting to heavy Javascript. So, in true developer style, Zubair did the "wrong thing", and took the long and painful route of trying to find his programming Nirvana, going to Erlang, Vaadin, Grails, JQuery, Javascript, GWT, Google Closure, Dart, and finally deciding to use Clojure and ClojureScript for a project he was involved with. That project Zubair was NemCV, the CV system for Denmark (http://www.meetup.com/CV-help/). Zubair took inspiration from Ruby on Rails (also from Denmark) and extracted the reuseable parts of NemCV to make the AppShare framework in June 2013.

After around a year of development of AppShare against relational databases (NemCV used Postgres), Zubair met Peter Neubauer from Neo4j when he came to do a talk about Neo4j at MatchingHeads, a Danish startup organisation (http://www.meetup.com/copenhagen-it-people/events/127072702/). Zubair realised that Neo4j could make developing web applications simpler as it allows schema-less development using a powerful SQL like language called Cypher. So first class support for Neo4j was built into AppShare.

In early 2014 Zubair listened to a Javascript Jabber postcast with Pete Hunt of Facebook, and learnt about Facebook React and how Facebook used it for building reactive UIs. Then he discovered a ClojureScript library called Om, made by David Nolen (https://github.com/swannodette/om) which provided a Clojurescript wrapper on top of Facebook React. He wanted to use React/Om in AppShare, but this meant that previous AppShare applications such as NemCV would have to be totally rewritten, as the old AppShare used imperative UI libraries like Domina. Zubair decided that a reactive front end would be worth it and all new AppShare webapps would be built using React/Om.

However, there was still something missing, and this piece of the puzzle fell into place when Zubair's business partner in NemCV, Franco Soldera introduced Zubair to Meteor, a realtime Javascript framework which had both Reactive capabilities and also excellent databinding capabilities. In Zubair's opinion Meteor is the best full stack Javascript framework that he had seen (and yes, Zubair had seen Derby, Angular, Ember, Knockout and many others). The reason he loved Meteor was not just because of its features such as a Reactive front end and data-binding, but also because Meteor is opinionated (like Ruby on Rails), which solves the problem of having to continually choose which Javascript libraries to use, thereby saving alot of wasted time experimenting with different Javascript libraries and glueing them together.

Meteor's realtime databinding uses a Document based database called MongoDB on the server and MiniMongo on the client, but AppShare already had full client side data access to both relational databases and Neo4j. So the goal of AppShare changed to make Neo4j and Relational Databases work more seamlessly with the front-end development in AppShare, just as Meteor does with MongoDb.

Another core feature of AppShare was the Time Travelling Debugger. This is based on the principle that program code is read 99% of the time, and written only 1% of the time. See this Dougas Crockford video on Software Quality who explains it better than I ever could:

https://www.youtube.com/watch?v=t9YLtDJZtPY

So AppShare in 2014 allowed all programs to be examined visually using a GUI time travelling debugger, which is one of the killer features, as it reduces the cost of maintenance of complex applications.

... long period of time passes ...

There felt like a long gap of time in AppShare land, where not much was committed to GitHub, and during this time Zubair first tried to learn more about Meteor.js, to see how they implemented Real Time client side data. He attended meetups with Franco in Copenhagen and learn as much as he could. His first idea was to implement the Meteor real time protocol DDP, and connect it to Neo4j on the back end. There were a few problems with this, the main one being with how real time works. Real time in Meteor works by having a small client side cache of MongoDb, called MiniMongo which runs in the Metoer web application. With Neo4j implementing a real time client side cache was orders of magnitude more tricky than it is for MongoDB because of the way Neo4j has a totally schemaless (not including Neo4j labels) graph.

So Zubair decided to build the first version of the real time facilities on top of the Postgres relational database since NemCV used Postgres, and he created his own client side SQL cache which works pretty well. He intends to revisit Neo4j and create a real time solution for this in the future though.

The next issue he had to solve was how to access data from the server. Zubair saw how other frameworks did it by having data access sprinkled throughout the framework, but then he thought, why not just use SQL directly in the client side components? This is something that is not possible in languages like Javascript since you cannot redefine the language itself. But since Clojurescript is a Lisp you can define whatever language you like. So uses the amazing Instaparse library he implemented SQL in the GUI components, so that you can do things like "select * from things" within your front end component.











### What is AppShare's killer feature?
<img height='350px' src='http://blog.wiserspread.com/wp-content/uploads/2014/07/Killer.jpg' />


AppShare killer feature is the **client side SQL**. This enables you to insert SQL statements directly inside the code for the UI. For a developer this is a HUGE time saver as it saves having to put code to display data on the screen in several parts of the codebase.

AppShare also has a **time travelling debugger**. This time travelling debugger lets you replay your GUI and select parts of the UI, and trace back the UI and any data used to make that part of the UI in time. This is an absolute "must" for the maintenance of complex web applications. This allows rapid interations for webapps that must change frequently, and live over a long period of time, much in the vein of the Lean Startup philisophy. Just add ***?livedebug=true*** to the end of the broswer URL when making a AppShare appliction to see the application in debug mode.












### What is AppShare not good for?
<img height='350px' src='http://918thefan.com/wp-content/uploads/2012/05/anthony-taber-square-peg-looking-at-round-hole-thinking-with-a-proper-diet-moderate-bu-new-yorker-cartoon-e1336682469227.jpg' />


AppShare is unsuitable for quite a wide variety of web projects. This is because AppShare uses a langauge called Clojure, which is a Lisp language, and most developers **hate Lisp**. However, AppShare does not use Lisp for the sake of it. Lisp it has a feature called Macros which makes the client side SQL in AppShare possible, which would not be possible in a non-Lisp language. So for a variety of use cases the following may be a better choice:

**Multi page informational websites** - Squarespace, Wix, Weebly, Adobe Muse, Wordpress, and many others are perfect for this

**Simple websites with a bit of interactivity** - HTML, JQuery, Kendo UI are much better choices for this where Javascript widgets can be added to HTML pages as needed

**SEO friendly interactive websites** - Ruby on Rails, Derby.js are a much better fit for this

**Fast to get up and running web applications using web standards** - Meteor.js is a much better for fit for this as it uses standard Javascriptinstead of Clojurescript






### All features
<img src='https://fundraising.myevent.com/images/common/features.png' />


- Clojurescript Om by David Nolen for React.js components on the frontend
- Mark Engelberg's Instaparse for client side SQL with commands like (select id, name from employees where ...)
- Interactive client and server side development with Bruce Hauman's Figwheel
- Integration with Mandrill for sending transactional emails
- Twitter Bootstrap 3.x for styling
- Google Closure for advanced Javascript compression
- Chris Granger's SQL Korma for database access
- Michael Klishin's Neocons for Neo4j access
- Core.async for a client-side synchronous programming model
- James Reeves's Compojure for server side access
- AppShare web apps are deployed using Java WAR files to Jetty, Tomcat, JBoss, Glassfish, Weblogic, or Webspher








### Differences from Om
<img height='350px' src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Om.svg/993px-Om.svg.png' />

The only part of Om that AppShare uses is the rendering engine and the change listeners (for GUI playback). This means that AppShare does not use the component local state features of Om, except for internal framework use. The implications of this are very important. For example, in Om when the end user clicks on a button in a react/Om component then the button event will be passed back via a core.sync channel. However, in AppShare, when the user presses a button then the Application model used to generate the DOM itself is changed, with a property :click being set to true. This :click property is then watched via an event watcher to make any changes.










### Comparison with other Clojure web frameworks
<img height='350px' src='https://upload.wikimedia.org/wikipedia/commons/4/40/Human-allosaurus_size_comparison.png' />

[Hoplon](http://hoplon.io/) - In my mind Hoplon is the most complete of all the Clojure web frameworks, and I think that AppShare has alot of catching up to do to get as full featured as Hoplon. Hoplon uses Reactive programming and has an amazing is web designer friendly as GUIs can be made from HTML, instead of Clojurescript

<br>


[Luminus](http://www.luminusweb.net/) - The main difference between Luminus and AppShare is that Luminus uses a HTML templating system for rendering web pages, whereas AppShare currently only supports rendering from within Clojure itself. This makes Luminus at the moment a better choice for companies with seperate design and development teams. Designers will be more comfortable working in clean HTML files.

<br>

[Pedestal](http://pedestal.io/) - Pedestal is an amazing Clojure web framework made by the main Clojure developers at Cognitect. It has a number of differences to AppShare, but in 2014 the front end part of Pedestal was dropped. The frontend of AppShare is actually based on the Original Pedestal model, which did so much right, by having a seperate data and UI model






### When will Neo4j be back on the scene?
<img height='350px' src='http://www.opencredo.com/wp-content/uploads/2013/06/neo4j-logo.png' />

Those of you who have followed AppShare for a long time will know that one of the big features was the Neo4j integration. Since AppShare is moving to a real time model we dropped full Neo4j realtime support in June 2015. Neo4 still works with AppShare, and Cypher queries can still be issued from Clojurescript, but just not in realtime mode as Neo4j does not have a client side cache in AppShare and it is too tricky to implement right now. At the time Neo4j was chosen for the following reasons:

- Easy to setup Neo4j on a developer machine, without having to create a schema first
- Rich data model, using Neo4j labels can also mimic database tables
- Expressive and powerful Cypher query language
- Neo4j has funding and a large customer base, so they should be around a long time
- Neo4j has a dual licensing model, similar to AppShare

Once AppShare has finished the realtime support of Postgres and other databases then Neo4j support can be revisited.
















### When will full Oracle realtime support be available?
<img height='350px' src='http://siliconangle.com/files/2013/03/Oracle-Empire-Under-Threat.jpg' />

Postgres is the first database to be supported, and Oracle is being developed.





### When will full Postgres realtime support be available?
<img height='350px' src='https://scottlinux.com/wp-content/uploads/2014/11/postgres.png' />

Postgres is supported now.

The realtime support for AppShare is based around the pinciples of the Meteor.js realtime system. Just like Meteor, AppShare also uses a client side cache connected to a server which contains the full data for each connected client.

With Meteor.js it uses a client side cache called MiniMongo which gets updates from the MongoDb server by uses Mongo Oplog tailing to get changes from the Mongo database. The first version of AppShare realtime database support uses the Postgres database to detect when changes are made.




### Deprecated features from April 2013 to July 2014
<img height='350px' src='http://www.pixelle.be/wp-content/uploads/2014/01/2013-origami.jpg' />

In 2013 Facebook created React, a Virtual Dom based Javascript library. David Nolen then created Om, a ClojureScript wrapper on top of React, which changed the ClojureScript client side story forever! Upon seeing Om I immediately knew that this was the future of ClojureScript development, using a Reactive GUI paradigm, also similar to Angular.js, Ember.js, and Meteor. So I took the tough decision to deprecate the whole UI that I had created in the previous version of AppShare. So the following features are now a thing of the past:

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
- Neocons for Neo4j access
- Compojure, Ring, and Shoreleave for server side code
- core.async for a client-side synchronous programming model

The reason for the discontinued features is that they all require explicit calls to manipulate the DOM, which is oppisite to the way that Facebook React works. If you still wish to use the discontinued features then you can use an older version of the AppShare framework.







### Deprecated features from August 2014 to June 2015
<img height='350px' src='http://www.weather.gov/images/gid/events/2014/dec/yearend2014/images/2014_logo.jpg' />

Even though in 2014 AppShare switched to using React.js via David Nolen's awesome Om library, building applications still didn't feel as natural as it should. This was mostly because data access still didn't feel right. One thing that was a huge influence was meteor.js, which provided real time webapps ove Mongodb. Realtime may seem simple, but to program a web application to update data as data changes without something like meteor.js soon becomes very complicated, as you need to add timers and callbacks for data everywhere. Since AppShare used Neo4j as a backend I wanted to create a similar live uploading method for AppShare. It was not as simple as I thought, as Neo4j has a far more complex data structure than the document based MongoDb. So I had to make the tough decision to postpone Neo4j work on AppShare for the time being. Since NemCV used a database backend anyway I decided to base it on a database instead. My idea is that you can program SQL directly in React.js components, for which I also chose Instaparse, which blows my mind!

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

Again, if you still wish to use the discontinued features then use an older version of the AppShare framework from March 2015.









### Anatomy of a AppShare application
<img height='350px' src='http://st2.depositphotos.com/1036342/6768/v/380/depositphotos_67681953-Searching-computer-code-with-a-magnifying-glass-HD-video-1080.jpg' />

    my_new_application
        └ links.txt
          ... links to common resources of your web applicaiton
        └ README.md
          project.clj

        └ srcbase - the default environment when you install AppShare
            └ srcbase
                └ myappshare
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

#####2) Install and build AppShare from Github:

    git clone https://github.com/zubairq/AppShare.git my_new_application
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



3) This is the default page that you see when you start AppShare as a web app, so there should be a function which looks something like this:

    (defn-ui-component     main-view   [app]

        (div nil
            (h2 nil "AppShare")
            "Build webapps with Neo4j"))


4) Change the text from "Build webapps with Neo4j" to "Hello World" so that it looks like this:

    (defn-ui-component     main-view   [app]

        (div nil
            (h2 nil "AppShare")
            "Hello World"))     <-- This line changed

You may wonder where the elements div, h2 , and so on are defined. They are defined at the top of the file in the AppShare namespace, defined with Om at the top of every Clojurescript file:

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

We actually cheated in the above example as we edited the AppShare framework itself, but it was just to get you to make a change as fast as possible. In an actual applicaiton we would ask you to make another file for your own GUI components













### List of functions
<img height='350px' src='http://blogs.ukoln.ac.uk/good-apis-jisc/files/2009/03/api1.gif' />

There are many AppShare framework functions available:


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

So this means that with AppShare, the preferred way to do things is with events, which are triggered by any of the following:

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











### Recommendations when building your first AppShare app
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












### Deploying an AppShare web app to a Java server as a WAR file
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

Building an application with AppShare? https://groups.google.com/forum/#!forum/appshareco

Ask a question: http://stackoverflow.com/search?q=appshare
Interested in contributing to AppShare?

Issue tracker: https://github.com/zubairq/AppShare/issues
Contribution guidelines: https://github.com/zubairq/AppShare/graphs/contributors
