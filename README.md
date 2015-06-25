<img src='http://www.zubairquraishi.com/zubairquraishi/images/screen%20shot%202015-01-23%20at%20065908.jpg' /> 
### Clojure on Coils - Webapps in React, SQL, and Clojurescript


 - [TLDR](#tldr)
 - [What is Coils?](#what-is-coils)
 - [What Problem Does It Solve?](#what-problem-does-it-solve)
 - [Is Coils for me?](#is-coils-for-me)
 - [Product roadmap](#product-roadmap)
 - [Quick start](#quick-start)
 - [Long story](#long-story)



### TLDR
Build a Postgres backed webapp by inserting SQL statements directly into React components:

    (defn-ui-component     my-todo-app   [app] {}
        
        (select id, item from todo_items where item like '%' 
            {}
            (container
                (inline "10%" (str (<-- :id)))  (inline "80%" (str (<-- :item))))))
                


### What is Coils?

Coils is a web framework written in Clojure and Clojurescript, running on the JVM on the server side and Javascript on the browser. The resulting artifact is a war file, so it can be deployed on any Java web or application server, including Jetty, Tomcat, JBoss, Glassfish, Weblogic, or Websphere.

- Uses SQL directly in React/Om components
- Uses Clojure for the server side
- Uses ClojureScript client-side
- Live coding using Figwheel


### What Problem Does It Solve?
When building an SPA on top of a database there are many considerations:

- Build the UI
- Bind the UI to a back end using AJAX callbacks
- Code the server side
 
Coils makes this simple by moving the SQL statements directly into the UI react components. So instead of writing code in 3 places, you just write it in one place, in the react component itself:

    (select id, item from todo_items where item like '%' 
                {}
                (container
                    (inline "10%" (str (<-- :id)))  (inline "80%" (str (<-- :item))))))



### Is Coils for me?
Clojure on Coils may be for you if you can answer yes to the following:

1. You  want a batteries included opinionated web framework like Rails or Meteor
2. You believe that Clojure/Clojurescript is cool
3. The Postgres database and SQL is a good match for your problem domain




### Product Roadmap
As of 2015 Clojure on Coils is in active development and is used in production systems. The future product roadmap is as follows:
 - November 2015 - make all SQL queries fully realtime like Meteor.js
 - July 2016 - hosted development environment so you can build Clojurescript database webapps using just a web browser



### Quick start

#####1) Install a Postgres database:

Make the following two tables in a schema called Coils:

    CREATE TABLE todo_items
    (
      id serial NOT NULL,
      item character varying,
      CONSTRAINT todo_items_pkey PRIMARY KEY (id)
    );
    
    CREATE TABLE users
    (
      id serial NOT NULL,
      user_name character varying,
      CONSTRAINT users_pkey PRIMARY KEY (id)
    );
    

#####2) Install and build Coils from Github:

    git clone https://github.com/zubairq/coils.git my_new_application
    cd my_new_application
    lein with-profile base figwheel


#####3) Open the application

    http://127.0.0.1:3449
    
    
#####4) Make a change and see Figwheel reload the changes live. 

Edit the file 

    src/webapp/framework/client/components/main.cljs 

and change 

    "Build database webapps with Clojure" 

to 

    "Figwheel made a live change!". 

Save the file and the text should change in the live web app


#####4) To see debug mode open:

    http://127.0.0.1:3449/main.html?livedebug=true















### Long story
The Coils framework started because of one web developers pain over many years building web applications. Zubair Quraishi worked in the 1990s as a C++ and Java programmer, building mostly server side web applications, only to find the whole develop, compile, test cycle hugely unproductive.

Then one day in 2008 Zubair discovered Ruby on Rails. He realised that there was a better way to develop web software by using interactive languages such as Ruby with easy database access via ActiveRecord. However, he soon became frustrated again, as the UI in Rails was generated on the server and fine grained control of the DOM was not easy to do without resorting to heavy Javascript. So, in true developer style, Zubair did the "wrong thing", and took the long and painful route of trying to find his programming Nirvana, going to Erlang, Vaadin, Grails, JQuery, Javascript, GWT, Google Closure, Dart, and finally deciding to use Clojure and ClojureScript for a project he was involved with. That project Zubair was NemCV, the CV system for Denmark (http://www.meetup.com/CV-help/). Zubair took inspiration from Ruby on Rails (also from Denmark) and extracted the reuseable parts of NemCV to make the Coils framework in June 2013.

After around a year of development of Coils against relational databases (NemCV used Postgres), Zubair met Peter Neubauer from Neo4j when he came to do a talk about Neo4j at MatchingHeads, a Danish startup organisation (http://www.meetup.com/copenhagen-it-people/events/127072702/). Zubair realised that Neo4j could make developing web applications simpler as it allows schema-less development using a powerful SQL like language called Cypher. So Coils has first class support for Neo4j using it as the default datastore.

Then, in early 2014 Zubair listened to a Javascript Jabber postcast with Pete Hunt of Facebook, and learnt about Facebook React and how Facebook used it for building reactive UIs. Then he discovered a ClojureScript library called Om, made by David Nolen (https://github.com/swannodette/om) which provided a Clojurescript wrapper on top of Facebook React. He wanted to use React/Om in Coils, but this meant that previous Coils applications such as NemCV would have to be totally rewritten, as the old Coils used imperative UI libraries like Domina. Zubair decided that a reactive front end would be worth it and all new Coils webapps would be built using React/Om.

However, there was still something missing, and this piece of the puzzle fell into place when Zubair's business partner in NemCV, Franco Soldera introduced Zubair to Meteor, a realtime Javascript framework which had both Reactive capabilities and also excellent databinding capabilities. In Zubair's opinion Meteor was the best full stack Javascript framework that he had seen (and yes, Zubair had seen Derby, Angular, Ember and Knockout). The reason he loved Meteor was not just because of its features such as a Reactive front end and data-binding, but also because Meteor is opinionated (like Ruby on Rails), which solves the problem of having to continually choose which Javascript frameworks to use, thereby saving alot of time wasted with experimenting with different Javascript libraries and glueing them together.

Meteor's realtime databinding uses a Document based database called MongoDB on the server and MiniMongo on the client, but Coils already had full client side data access to both relational databases and Neo4j. So the goal of Coils changed to make Neo4j and Relational Databases work more seamlessly with the front-end development in Coils, just as Meteor does with MongoDb.

Another core feature of Coils was the Time Travelling Debugger. This is based on the principle that program code is read 99% of the time, and written only 1% of the time. See this Dougas Crockford video on Software Quality who explains it better than I ever could:

https://www.youtube.com/watch?v=t9YLtDJZtPY

So Coils allows all programs to be examined visually using a GUI time travelling debugger, which is one of the killer features, as it reduces the cost of maintenance of complex applications. 

... long period of time passes ...

There felt like a long gap of time in Coils land, where not much was committed to GitHub, and during this time Zubair first tried to learn more about Meteor.js, to see how they implemented Real Time client side data. He attended meetups with Franco in Copenhagen and learn as much as he could. His first idea was to implement the Meteor real time protocol DDP, and connect it to Neo4j on the back end. There were a few problems with this, the main one being with how real time works. Real time in Meteor works by having a small client side cache of MongoDb, called MiniMongo which runs in the Metoer web application. With Neo4j implementing a real time client side cache was orders of magnitude more tricky than it is for MongoDB because of the way Neo4j has a totally schemaless (not including Neo4j labels) graph.

So Zubair decided to build the first version of the real time facilities on top of the Postgres relational database which , since that is what NemCV used as the candidate database, and created his own client side SQL cache which works pretty well. He intends to revisit Neo4j and create a real time solution for this in the future though.








What is Coils "killer" feature?
-------------------------------
Coils **killer feature** is the **time travelling debugger**. This time travelling debugger lets you replay your GUI and select parts of the UI, and trace back the UI and any data used to make that part of the UI in time. This is an absolute "must" for the maintenance of complex web applications. This allows rapid interations for webapps that must change frequently, and live over a long period of time, much in the vein of the Lean Startup philisophy. See here for a live demo:

http://connecttous.co/connecttous/connecttous.html?livedebug=true


What is Coils not good for?
---------------------------
Because Coils is based around a principle of being **maintenance first**, this makes Coils unsuitable for quite a wide variety of web projects. This is because Coils uses a langauge called Clojurescript, based on Lisp which is unsuitable for most developers, since most developers **hate Lisp**. So why use a Lisp language then, if it is so unpopular? Well, Coils does not use a Lisp language for the sake of it. Since Clojurescript is a Lisp it has a feature called Macros which make the time travelling debugger and runtime code inspection possible, which would not be possible in a non-Lisp language. So there is a larger learning curve with Coils, but maintenance time is reduced. So for a variety of use cases the following may be a better choice:

**Multi page informational websites** - Wix, Weebly, Adobe Muse, Wordpress, and many others are perfect for this

**Simple websites with a bit of interactivity** - HTML, JQuery, Kendo UI are much better choices for this where Javascript widgets can be added to HTML pages as needed

**SEO friendly large websites** - Ruby on Rails, Derby.js are a much better fit for this

**Fast to get up and running web applications using web standards** - Meteor.js and Derby.js are a much better for for this as they use standard Javascript




Why Neo4j?
----------
One of the features of Coils is that allows all user's web sessions to be replayed by the company hosting the website made with Coils, see here for a demo:

http://connecttous.co/connecttous/connecttous.html?playback=true

Since user sessions are saved, they must be stored somewhere on the server. Coils uses Neo4j for this and as its default datastore. While Coils does natively support relational databases, and also can support other backends such as MongoDb through Clojure, Neo4j was chosen for the following reasons:

- Easy to setup Neo4j on a developer machine, without having to create a schema first
- Rich data model, using Neo4j labels can also mimic database tables
- Expressive and powerful Cypher query language
- Excellent support for bug fixes from the Neo4j team
- Neo4j has funding and a large customer base, so they should be around a long time
- Neo4j has a dual licensing model, similar to Coils
- Some of the Neo4j guys are very active in the Clojure community

One of the other questions has been around whether Neo4j can have a realtime interface to Neo4j, like Meteor does with Mini Mongo and MongoDb. MongoDb uses a very simple document model which is why this works so well with MondoDb, but Coils goes one step further and has full client side access to Cypher queries, so it doesn't need a MiniNeo4j on the client side. So the answer is yes, Coils can have real time client side access to Neo4j, which is currently in development.


Deprecated features from April 2013 to July 2014
------------------------------------------------
In 2013 Facebook created React, a Virtual Dom based Javascript library. David Nolen then created Om, a ClojureScript wrapper on top of React, which changed the ClojureScript client side story forever! Upon seeing Om I immediately knew that this was the future of ClojureScript development, using a Reactive GUI paradigm, also similar to Angular.js, Ember.js, and Meteor. So I had to take the tough decision to deprecate almost the whole UI that I had created in the previous version of Clojure on Coils. So the following features are now a thing of the past:

- Can use Crate for HTML.
- Uses Dommy.
- Uses Domina.
- JayQ for JQuery integration.
- Google Closure UI Library - the same library used to build Google.com, Gmail, and Google+.
- Google Maps integration for AJAX-based maps. (Can be swapped on/off.)

:and the following things stay or are added:

- React.js via Om for the front end
- Interactive client and server side development with LightTable IDE.
- Integration with Mandrill for sending transactional emails.
- Twitter Bootstrap 3.0 for styling.
- Google Closure for advanced compression.
- clj-http for server side HTTP requests.
- SQL Korma for database requests.
- Neocons for Neo4j access.
- Compojure, Ring, and Shoreleave for server side code.
- core.async for a client-side synchronous programming model.

The reason for the discontinued features is that they all require explicit calls to manipulate the DOM, which is oppisite to the way that Facebook React works.

If you still wish to use the discontinued features then use an older version of the Coils framework.


Deprecated features from August 2014 to July 2015
------------------------------------------------
In 2014 Coils switched to using React.js via David Nolen's awesome Om library. However, building applications still didn't feel as natural as it should. This was mostly because data access still didn't feel right. 
One thing that was a huge influence was meteor.js, which provided reasl time webapps ove Mongodb. Realtime
may seem simple, but to program a web application to update data as data changes without asomething like meteor.js soon becomes very complicated, as you need to add timers and callbacks for data everywhere. Since Coils used Neo4j as a backend I wanted to create a similar live uploading method for Coils. It was not as simple as I thought, as Neo4j has a far more complex data structure than MongoDb. So I had to make the tough decision to postpone Neo4j work on Coils for the time being. Since NemCV used a database backend anyway I decided to base it on a database instead. My idea is that you can program SQL directly in react.js components, for which I also chose Instaparse, which blows my mind!
Another thing that was dropped was something very dear to my heart, LighttTable. The latest version of Light Tavble was not able to support interactive development with the latest clojurescript versions. Also, it kept pauses every minute or so for several seconds, so I started to look for alternatives. I used Cursive and Intellij, although emacs or any other text editor works fine too. To replace the killer Light Table feature of live browser code changes I discovered Figwheel, which lets you save a file, then sends the recompiled javascript to the browser.

- Exclusive use of the Light Table IDE
- Neo4j as the main data provider
- Records all web sessions for playback to understand customer behaviour (using Neo4j) - (there are better web UI recording tools on the market anyway)
- AB testing built in (will be added in futurew maybe, but not for now)

:and the following things stay:

- React.js via Om for the front end
- Instaparse for parsing client side SQL
- Integration with Mandrill for sending transactional emails.
- Twitter Bootstrap 3.0 for styling.
- Google Closure for advanced compression.
- clj-http for server side HTTP requests.
- SQL Korma for database requests.
- Compojure, Ring, and Shoreleave for server side code.
- core.async for a client-side synchronous programming model.

Again, if you still wish to use the discontinued features then use an older version of the Coils framework from March 2015.


Unique features
---------------

- In debug mode press the Debug button at the top of the web page and you can rewind and forward the application and browse the source code behind any GUI element by left clicking on the element

- Secure client side SQL. All calls are encrypted and use a server side key to avoid SQL injection attacks, yet at the same time the SQL calls appearing in client side code are easy to understand.

- Web development without callback hell. Coils uses Clojure's core.async library to set of sychronous server side calls.

All features
------------

- Clojurescript Om by David Nolen
- True client side SQL witgh commands like (select id, name from employees where ...)
- Interactive client and server side development with Figwheel
- Integration with Mandrill for sending transactional emails
- Twitter Bootstrap 3.x for styling
- Google Closure for advanced compression
- clj-http for server side HTTP requests
- SQL Korma for database requests
- Neocons for Neo4j access
- Compojure, Ring, and Shoreleave for server side code
- Core.async for a client-side synchronous programming model




Differences from Om
-------------------
The only part of Om that Coils uses is the rendering engine and the change listeners (for GUI playback). This means that Coils does not use the component local state features on Om. The implications of this are very important. For example, in Om when the end user clicks on a button in a react/Om component then the button event will be passed back via a core.sync channel. However, in Coils, when the user presses a button then the Application model used to generate the DOM itself is changed, with a property :click being set to true. This :click property is then watched via an event watcher to make any changes.




Project page
------------
The website for this project is online at [coils.cc](http://coils.cc).





Comparison with other Clojure web frameworks
--------------------------------------------

[Hoplon](http://hoplon.io/) - In my mind Hoplon is the most complete of all the Clojure web frameworks, and I think that Coils has alot of catching up to do to get as full featured as Hoplon. Hoplon uses Reactive programming and has an amazing is web designer friendly as GUIs can be made from HTML, instead of Clojurescript

<br>


[Luminus](http://www.luminusweb.net/) - The main difference between Luminus and Clojure-on-Coils is that Luminus uses a HTML templating system for rendering web pages, whereas Coils currently only supports rendering from within Clojure itself. This makes Luminus at the moment a better choice for companies with seperate design and development teams. Designers will be more comfortable working in clean HTML files.

<br>

[Pedestal](http://pedestal.io/) - Pedestal is an amazing Clojure web framework made by the main Clojure developers at [Relevance](http://thinkrelevance.com/), now called Cognitect. It has a number of differences to Coils, but in 2014 the front end part of Pedestal was dropped, probably to be replaced by Facebook React/Om. The frontend of Coils is actually based on the pedestal model, which did so much right, especially having a seperate data and UI model





Installation
------------

    - Install Coils from Github:

    git clone  https://github.com/zubairq/coils.git  my_new_application



    - Then install Neo4j:

    http://neo4j.com
    http://www.zubairquraishi.com/zubairquraishi/clojure-neocons-for-neo4j.html




Anatomy of a Coils application
------------------------------

    my_new_application
        └ links.txt
          ... links to common resources of your web applicaiton
        └ README.md
          project.clj

        └ srcbase
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

                        data_tree.cljs
                        ui_tree.cljs
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
            └ settings.clj - create this yourself to define your production environemnt

    srctest
        └ webapp_config
            └ settings.clj - create this yourself to define your test environemnt



Getting started
---------------

1) Compile clojurescript and Start the self-refreshing web server:

    cd my_new_application
    lein with-profile base figwheel

2) Open a browser and point to [127.0.0.1:3449](127.0.0.1:3449)

3) To see the live debugging mode go to [127.0.0.1:3449/main.html?livedebug=true](127.0.0.1:3449/main.html?livedebug=true)





Adding something to the web page
--------------------------------

1) In a browser and point to 127.0.0.1:3449

2) Go to the clojurescript view in my_new_application/src/webapp/framework/client/components/main.cljs

3) This is the default page that you see when you start Coils as a web app, so there should be a function which looks something like this:

    (c/defn-ui-component     main-view   [app] 

        (c/div nil
            (c/h2 nil "Coils")
            "Build webapps with Neo4j"))


4) Change the text from "Build webapps with Neo4j" to "Hello World" so that it looks like this:

    (c/defn-ui-component     main-view   [app] 

        (c/div nil
            (c/h2 nil "Coils")
            "Hello World"))     <-- This line changed

You may wonder what the **c/** is for. This is for the Coils namespace, defined with Om at the top of every Clojurescript file:

    [webapp.framework.client.coreclient   :as c  :include-macros true]

4) Save the file and the figwheel should swap out the whole page with the text "Hello world" in the web browser, no browser reload required!

We actually cheated in the above example as we edited the Coils framework itself, but it was just to get you to make a change as fast as possible. In an actual applicaiton we would ask you to make another file for your own GUI components


Adding debuggable elements to the page
--------------------------------------

In the past Coils used Domina, and other imperative libraries to add elements to a webpage, something like this, where "logged-in-panel" defines some HTML, and "swap-section" manipulates the DOM:

    (defn-html logged-in-panel []
        (el :div {:class "row" :style "padding: 5px; width:400px;"} [
            (el :div
                          {:id    "signed-in-as-text"
                           :text  "Signing in..."
                           :class "pull-left"
                           :style "margin-right: 20px; margin-top:10px;"
             })

             (el :button
                          {:id      "logout-button"
                           :class   "btn btn-default "
                           :text    "Logout"
                           :style   "margin-right: 20px;"
                           :onclick #(do-action "show login signup panel")})

             (el :button
                          {:id      "settings-button"
                           :class   "btn btn-default"
                           :text    "Settings"
                           :style   "margin-right: 20px;"
                          })
    ]))


    (swap-section "main" (logged-in-panel))

However, since Facebook react, via David Nolen's Clojurescript Om library is now used to define the interface, the method of defining the web UI has drastically changed. To understand how the UI is defined an explanation is needed:

        DATA STATE
            .
            .
            .
            V
        UI STATE
            .
            .
            .
            V
    Om/React Components

So React/Om components make up the user interface. When we say React/Om components this means that there is a piece of UI code and a corresponding piece of data. So for example there may be the following piece of coe to render a UI:

    (c/defn-ui-component     say-hello-ui-component   [person-data] 
        (c/div
            nil
            (str "Hello " (read-ui person-data [:name]))))

This component would have to be passed in a structure like follows from the UI state:

    {
        :name     "Pete"
        :age      40
    }

and the result would be a HTML div like:

    Hello Pete

So, the diagram would now look something like this:


        DATA STATE
            .
            .
            .
            .
            V

        UI STATE
            .
            .
            .
        {
            :name     "Pete"
            :age      40
        }
            .
            .
            .
            V

    Om/React Components

        (c/defn-ui-component     say-hello-ui-component [ person-data ] 
            (c/div
                nil
                (str "Hello " (c/read-ui person-data [:name]))))
            .
            .
            .
            .
            V

    Outputs "Hello Pete" in the browser



List of functions
-----------------
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






Client side message passing system (a.k.a. events)
-----------------------------------------------
This was part of the old Coils. This has now been fully deprecated so that the UI and DATA trees are watched for events. The old method worked like this:

Define an action:

    (redefine-action "Say something"
        (js/alert "Hello"))


Call an action:

    (do-action "Say something")

So in the new version of Coils if you want to execute an event you have to decide whether you are listening to the data tree or the UI tree. For example, if you want to perform an action when the use presses a button then you would do something like this:

    (==ui  [:ui   :company-details   :clicked]    true
          (-->ui  [:ui  :company-details   :clicked  ] false)
          (-->ui  [:ui  :tab-browser    ] "top companies"))

So this means that with Coils, the preferred way to do things is with events, which are triggered by any of the following:

- timers
- changes in the UI tree (because of user actions such a clicking a button)
- chnages in the data tree (such as data being read from Neo4j)



Calling server side code
------------------------

From the client side:

    (server-call
         (js/alert
             (:text (remote  say-hello  {:name "Johnny"}))))



Define in fns.clj on the server side (using core.async):

    (defn say-hello [{name :name}]
        {:text (str "Hello " name))})







Client side SQL
---------------

    (go
        (log (pr-str (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))


Please note that the raw SQL is not visible from web browsers since it's encryted through a server side macro. Such macros are a feature unique to Clojure and other [Lisps](https://en.wikipedia.org/wiki/Lisp_(programming_language)#List_structure_of_program_code.3B_exploitation_by_macros_and_compilers).




Client side Neo4j Cypher
------------------------

    (go
        (log (pr-str (neo4j "START x = node(11) RETURN x" {} ))))

Please note that the raw Cypher code is not visible from web browsers as it is encryted via a server side macro, like the SQL calls are.




How secure client side SQL works
--------------------------------

It may seem strange that you can call SQL synchronously from the client yet the call is sent to the server, is secure, and behaves asynchronous internally. Welcome to the world of Lisp!

To understand a bit more about this you need to realise that Clojure is an implementation of Lisp for the JVM, and Clojurescript is Lisp on Javascript. Lisp itself has alot of special features which are not available in other languages, such as the ability to write code itself, also known as Lisp Macros. This ability is not available as a first class feature in any other language!

Before I stray too much away from the point, there are two parts of the Clojure implementation of Lisp that allows synchronous secure client-side SQL/Cypher:

- core.async
- macros (no, not your C++ macros)

When you make a client side SQL/Cypher call it is encyrpted using a Macro at compile time:

    (defmacro sql [sql-str params]
        `(webapp.framework.client.coreclient.sql-fn
            ~(encrypt sql-str)
            ~params))

This means that the string in a client side call...

    (go
        (log (pr-str (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))

... will be rewritten at compile time, making it impossible for anyone who does "View source" on your web page to see the SQL code!




Functions available
-------------------------------------------------------
There are many library functions available, although it is a bit of a mess having to :require and :use everything in the Clojurescript namespace header:

    (ns webapp.client.views.loginpanel
        (:refer-clojure :exclude [val empty remove find next parents])
        (:require
            [cljs.reader :as reader]
            [crate.core :as crate]
            [cljs.core.async :as async :refer [chan close!]]
            [clojure.string]
        )
        (:use
            [webapp.framework.client.coreclient :only [body-html new-dom-id debug popup hide-popovers
                                                       show-popover set-text value-of find-el sql-fn neo4j-fn
                                                       swap-section el clear remote  add-to on-mouseover-fn on-click-fn]]
            [jayq.core                          :only [$ css  append fade-out fade-in empty attr bind]]
            [webapp.framework.client.help       :only [help]]
            [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
            [domina                             :only [ by-id value destroy! ]]
      )
      (:require-macros
        [cljs.core.async.macros :refer [go alt!]])
      (:use-macros
            [webapp.framework.client.eventbus :only [redefine-action define-action]]
            [webapp.framework.client.coreclient :only [ns-coils makeit defn-html on-click on-mouseover sql defn-html defn-html2 neo4j]]
            [webapp.framework.client.interpreter :only [! !! !!!]]
         )
    )
    (ns-coils 'webapp.client.views.loginpanel)




**show-popover** - Shows a Bootstrap 3 style popover above an element

    (show-popover   "email-input"
                    "Email can not be blank")

    (show-popover   "password-input"
                    "Password is incorrect"
                    {:placement "top"})



**swap-section** - Swaps a HTML element with a new element

    (swap-section   "my-section"
                    "<div>Replace the element with ID my-section" with this text</div>")



**do-action** - Puts a message onto the service bus. This can be picked up by zero or more receivers

    (do-action  "say-hello")



**define-action** - Acts on a message sent to the service bus

    (define-action  "say-hello"
      (.log js/console "Hello"))



**do-action message** - Puts a message onto the service bus with paramters. This can be picked up by zero or more receivers

    (do-action  "say-hello" {:name "Peter"})




**define-action** - Acts on a message sent to the service bus. Please note that the message is an implicitly defined variable in an action

    (define-action  "say-hello"
      (.log js/console (str "Hello" (:name message))))





**sql** - Calls the server and executes SQL and returns it to the client

    (go
         (let [
                 search-db-for-user   (sql "SELECT * FROM users where user_name = ?"  [username] )
                 user-already-exists  (pos? (count search-db-for-user))
              ]
                 (if user-already-exists ...

**set-text** - Set the text of an element

    (set-text "message-element" "You must enter an email address")




Deploying an application to a Java server
-------------------------------------------------------

    mkdir srcprod && cd srcprod
    mkdir webapp_config && cd webapp_config

    touch settings.clj
    ... copy and amend the settings from coils/srcdev/webapp_config/settings.clj ...

    cd ../../coils

    lein with-profile prod cljsbuild clean
    lein with-profile prod cljsbuild once

    lein with-profile prod ring uberwar
    ... deploy the resulting war file ...




Recommendations when building your first app
--------------------------------------------

1) Copy **main.html** and make your own **app_name.html** file in the **resources** folder

2) Edit the field in **links.txt** from **127.0.0.1:3000/main.html** to **127.0.0.1:3000/app_name.html**

3) Copy the **src_base** folder and rename it **src_dev**. Edit this profile to be **dev** in **settings.clj**

4) Copy **webapp/framework/client/init.cljs** to **webapp/client/init.cljs**

5) In **webapp/client/init.cljs** change the namespace to **webapp.client.init**

6) In **my_app.html** change the all occurrences of **webapp.framework.client.init.setup** to **webapp.client.init.setup**

7) Copy **src/webapp/framework/client/components/main.cljs** to **src/webapp/client/react/views/main.cljs**

8) Rename the namespace in **webapp.client.components.main.cljs** from **webapp.framework.client.components.main** to **webapp.client.react.components.main**. This will be in two places, one at the top of the file (ns webapp.client.react.views.main) and the other below it as (c/ns-coils 'webapp.client.components.main)

9) In init.cljs change    **[webapp.framework.client.components.main  :only  [main-view]]** to **[webapp.client.react.main   :only   [main-view]]**

10) In **src/webapp/client/react/views/main.cljs** change the text to **Welcome to my new app**

11) Load **127.0.0.1:3000/app_name.html** and you should see your new application page

Alot of steps, I know!!!
