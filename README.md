Coils - Build Neo4j Web Applications
====================================

Debugger Demo
-------------

http://connecttous.co/connecttous/connecttous.html?livedebug=true

Quick start for a blank project
-------------------------------

1) Install Neo4j from:

    http://www.neo4j.org/

2) Install and run Coils from Github:

    /neo4j-home-directory/bin/neo4j start
    git clone  https://github.com/zubairq/coils.git  my_new_application
    cd my_new_application
    lein with-profile base cljsbuild clean
    lein with-profile base cljsbuild once
    lein with-profile base ring server
    
3) To see debug mode open:

    http://127.0.0.1:3000/main.html?livedebug=true

Introduction
------------

Originally called "Clojure on Coils", this project has now been renamed to just "Coils". The Coils framework was born out of one web developer's pain over many years developing both web and desktop software. Zubair Quraishi started professionally in the early 1990s as a C++ programmer, and then moved to Java, getting heavily involved in developing server side Java web applications, only to find the whole develop, compile, test loop hugely cumbersome and time wasting.

Then one day, like many developers before him, around 2008, he discovered Ruby on Rails.

Wow! Suddenly the world opened up for Zubair and he realised there was a better way to develop web software by using interactive languages such as Ruby and easy SQL queries via ActiveRecord. Soon however, he soon became frustrated again, as with Rails everything was generated on the server and control of the web page on the client was not fine-grained enough. So, in true developer style, Zubair did the "wrong thing", and took the long and painful route of trying to find his programming Nirvana, going to Erlang, Vaadin, Grails, JQuery, Javascript, GWT, Google Closure, Dart, and finally deciding to use Clojure and ClojureScript for a project he was involved with.

That project was NemCV, and it is the CV system for Denmark. Seeing that there was alot of good work in NemCV that could be reused Zubair took inspiration from Ruby on Rails, which coincidently came from Denmark too, where a developer called David Heinemeier Hansson made Ruby on Rails based on a project called BaseCamp which he had made for his company 37 Signals. So thus, Coils was born!

After around a year of development of Coils against relational databases (as NemCV used Postgres), Zubair met Peter Neubauer from Neo4j when Peter came to do a talk at http://matchingheads.com, a Danish startup organisation. He realised that Neo4j could make developing applications simpler as it allows schema-less development and had a powerful SQL like language called Cypher to query the graph.

Then in early 2014 he also discovered Facebook React and incorporated a ClojureScript library called Om (https://github.com/swannodette/om) by David Nolen into Coils. This was a breaking for all previous Coils apps (such as NemCV) which used imperative UI libraries like Domina, whereas the new Coils would use Om and a reactive UI. Zubair felt that the change however is worth it however as all future UIs will be built in a reactive way.

However, there was still something missing, and this piece of the puzzle fell into place when Zubair's business partner in NemCV, Franco Soldera introduced Zubair to Meteor, a realtime Javascript framework which had both Reactive capabilities and also excellent databinding capabilities. In Zubair's opinion Meteor was the best full stack Javascript framework that he had seen (and yes, Zubair had seen Derby, Angular, Ember and Knockout). The reason he loved Meteor was not just because of its features such as a Reactive front end and data-binding, but also because Meteor is opinionated (like Ruby on Rails), which solves the problem of having to continually choose which Javascript frameworks to choose, thereby saving alot of time wasted with experimenting with different Javascript frameworks and glueing them together.

Meteor's realtime databinding uses a Document based database called MongoDB on the server and MiniMongo on the client, but Coils already had full client side data access to both relational databases and Neo4j. So the current goal of Coils is to make Neo4j and Relational Databases work more seamlessly with the frontend, just as Meteor does with Mongo.

Another core feature of Coils is the Time Travelling Debugger. This is based on the principle that programs are read 99% of the time, and written only 1% of the time. See this Dougas Crockford video on Software Quality who explains it better:

https://www.youtube.com/watch?v=t9YLtDJZtPY

So Coils allows all programs to be examined visually using a GUI time travelling debugger, which is one of the killer features, as it reduces the cost of maintenance of large Javascript applications. For a demo see here:

http://connecttous.co/connecttous/connecttous.html?livedebug=true

: The demo code is from a demo application made just as an example. It does not use NemCV as:

1) NemCV is a closed source application
2) NemCV was the inspiration for Coils, but the code based is based on imperative UI updates, not Reactive UI updates, so the code base has diverged from Coils now

Anyway, the source code for the example application is available here:

https://github.com/zubairq/coils/tree/connecttous

It is the Coils branch called 'connecttous'. Please feel free to clone it, modify, and play around with it locally, although you will need Neo4j installed locally too.






What is Coils?
--------------

Coils is a web framework where development is done in Clojure and Clojurescript and the software runs on the JVM so it can be deployed on any Java web or application server, including Jetty, Tomcat, JBoss, Glassfish, Weblogic, or Websphere.

A few notes:

- Uses Neo4j for data storage
- Uses Clojure for the server side
- Uses ClojureScript client-side
- Exclusively uses the LightTable IDE




What is Coils "killer" feature?
-------------------------------
Coils **killer feature** is the **time travelling debugger**. This is an absolute "must" for maintenance of large web applications, meaning applications that may change fast, and live over a long period of time, where fast development interations are a must, much in the vein of the Lean Startup philisophy.


What is Coils not good for?
---------------------------
Because coils is based around "Maintenance first" as its tagline, it is not suitable for quite a wide variety of web projects. In fact, Coils does not even use Javascript, it uses Clojurescript, which compiles down to Javascript, so this makes it unsuitable for many types of developers. It does not use Clojurescript for the sake of it though. Clojurescript is a version of "Lisp" which compiles down to Javascript, and being a Lisp it has a features called Macros which make the time travelling debugger possible. So there is a larger learning curve with Coils, but maintenance time is reduced. So for a variety of websites the following may be a better choice:

**Multi page informational websites** - Wix, Weebly, Adobe Muse, Wordpress, and many others are perfect for this

**Simple websites with a bit of interactivity** - HTML, JQuery, Kendo UI are much better choices for this where Javascript widgets can be added to HTML pages as needed

**SEO friendly large websites** - Ruby on Rails, Derby.js are a much better fit for this

**Fast to get up and running web applications using web standards** - Meteor.js and Derby.js are a much better for for this as they use standard Javascript




Why Neo4j?
----------
One of the features of Coils is that allows all sessions to be replayed by the company developing a website using Coils, see here for a demo:

http://connecttous.co/connecttous/connecttous.html?playback=true

: So Coils is forced to choose something as the default. While Coils does natively support relational databases, and also can support other backends such as MongoDb through Clojure, Neo4j was chosen for the following reasons:

- Easy to setup Neo4j on a developer machine, withut having to create a schema first like with a database
- Rich data model, using Neo4j labels, as opposed to document databases like MongoDB
- Expressive and powerful Cypher query language
- Zubair has requested support in the past for bugs and the Neo4j team were super responsive
- Neo4j has funding and a large customer base, so they should be around a long time
- Neo4j has a dual licensing model, similar to Coils
- Neo4j is based close by in Malmo, not far from Copenhagen, so the core team are near by
- Some of the Neo4j guys are very active in the Clojure community
- Peter Neubauer, one of the foundof Neo4j is awesome and has always been helpful when there have been problems. Even though he is not at Neo4j anymore (now he is at Mapillary) he has always provided first class support

One of the other questions has been around whether Neo4j can have a realtime interface to Neo4j, like Meteor does with Mini Mongo and MongoDb. MongoDb uses a very simple document model which is why this works so well with MondoDb, but Coils goes one step further and has full client side access to Cypher queries, so it doesn't need a MiniNeo4j on the client side. So the answer is yes, Coils can have real time client side access to Neo4j.


Deprecated features from April 2013 to July 2014
------------------------------------------------
In 2013 Facebook created React, a Virtual Dom based Javascript library. David Nolen then created Om, a ClojureScript wrapper on top of React, which changed the ClojureScript client side story forever! Upon seeing Om I immediately knew that this was the future of ClojureScript development, using a Reactive GUI paradigm, also similar to Angular.js, Ember.js, and Meteor. So I had to take the tough decision to deprecate almost the whole UI that I had created in the previous version of Clojure on Coils. So the following features are now a thing of the past:

- Can use Crate for HTML.
- Uses Dommy.
- Uses Domina.
- JayQ for JQuery integration.
- Google Closure UI Library - the same library used to build Google.com, Gmail, and Google+.
- Google Maps integration for AJAX-based maps. (Can be swapped on/off.)

:and the following things stay:

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



Unique features
---------------

- Build the default app and then click on debug at the top and you can Browse the source code behind any GUI element by left clicking on the element

- Secure client Neo4j Cypher. All calls are encrypted and use a server side key to avoid Cypher injection attacks, yet at the same time the Cypher calls appearing in client side code are easy to understand.

- Secure client side SQL. All calls are encrypted and use a server side key to avoid SQL injection attacks, yet at the same time the SQL calls appearing in client side code are easy to understand.

- Web development without callback hell. Coils uses Clojure's core.async library to set of sychronous server side calls.

- Replay all web sessions as all sessions are recorded using Neo4j

All features
------------

- hard dependency on Neo4j now
- Clojurescript Om by David Nolen
- Records all web sessions for playback to understand customer behaviour (using Neo4j)
- AB testing built in
- Interactive client and server side development with LightTable IDE
- Integration with Mandrill for sending transactional emails
- Twitter Bootstrap 3.x for styling
- Google Closure for advanced compression
- clj-http for server side HTTP requests
- SQL Korma for database requests
- Neocons for Neo4j access
- Compojure, Ring, and Shoreleave for server side code
- core.async for a client-side synchronous programming model




Differences from Om
-------------------
The only part of Om that Coils uses is the rendering engine and the change listeners (for GUI playback). This means that Coils does not use the component local state features on Om. The implications of this are very important. For example, in Om when the end user clicks on a button in a react/Om component then the button event will be passed back via a core.sync channel. However, in Coils, when the user presses a button then the Application model used to generate the DOM itself is changed, with a property :click being set to true. This :click property is then watched via an event watcher to make any changes.




Project page
------------
The website for this project is online at [coils.cc](http://coils.cc).





Comparison with other Clojure web frameworks
--------------------------------------------

[Hoplon](http://http://hoplon.io/) - In my mind Hoplon is the most complete of all the Clojure web frameworks, and I think that Coils has alot of catching up to do to get as full featured as Hoplon. Hoplon uses Reactive programming and has an amazing is web designer friendly as GUIs can be made from HTML, instead of Clojurescript

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
    lein with-profile base cljsbuild clean
    lein with-profile base cljsbuild once
    lein with-profile base ring server

2) Open LightTable

3) Create a new workspace in lightTable

4) Add the project directory my_new_application to the LightTable workspace

5) Open a Browser tab in LightTable and point to [127.0.0.1:3000](127.0.0.1:3000)

6) To see past sessions go to [127.0.0.1:3000/main.html?playback=true](127.0.0.1:3000/main.html?playback=true)

7) To see the live debugging mode go to [127.0.0.1:3000/main.html?livedebug=true](127.0.0.1:3000/main.html?livedebug=true)

The easiest way to get started is to just play around with the demo app online at http://coils.cc. Click on the logo in the top left and then you enter the debug mode. You can click on most elements on the page and you can see the code used to generate them.




Adding something to the web page
--------------------------------

1) In LightTable open the browser and point to 127.0.0.1:3000

2) Go to the clojurescript view in my_new_application/src/webapp/framework/client/components/main.cljs

2) This is the default page that you see when you start Coils as a web app, so there should be a function which looks something like this:

    (defn-ui-component     main-view   [app]
        {:absolute-path []}

        (div nil
            (h2 nil "Coils")
            "Build webapps with Neo4j"))


3) Change the text from "Build webapps with Neo4j" to "Hello World" so that it looks like this:

    (defn-ui-component     main-view   [app]
        {:absolute-path []}

        (div nil
            (h2 nil "Coils")
            "Hello World"))

4) press press Ctrl-Alt-Enter and the view should swap out the whole page with the text "Hello world" in the web browser, no browser reload required!

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

    (defn-ui-component     say-hello-ui-component   [person-data] {}
        (div
            nil
            (str "Hello " (:name person-data))))

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

        (defn-ui-component     say-hello-ui-component   [person-data] {}
            (div
                nil
                (str "Hello " (:name person-data))))
            .
            .
            .
            .
            V

    Outputs "Hello Pete" in the browser







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
- changes in the UI tree (because of user actions suh a sclicking a button)
- chnages in the data tree (such as data being read from Neo4j)



Calling server side code
------------------------

From the client side:

    (go
         (js/alert
             (:text (<! (remote "say-hello" {:name "Johnny"})))))



Define in fns.clj on the server side (using core.async):

    (defn say-hello [{name :name}]
        {:text (str "Hello " name))})







Client side SQL
---------------

    (go
        (.log js/console (str (<! (sql "SELECT * FROM test_table where name = ?" ["shopping"] )))))


Please note that the raw SQL is not visible from web browsers since it's encryted through a server side macro. Such macros are a feature unique to Clojure and other [Lisps](https://en.wikipedia.org/wiki/Lisp_(programming_language)#List_structure_of_program_code.3B_exploitation_by_macros_and_compilers).




Client side Neo4j Cypher
------------------------

    (go
        (.log js/console (str (<! (neo4j "START x = node(11) RETURN x" {} )))))

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
        (.log js/console (str (<! (sql "SELECT * FROM test_table where name = ?" ["shopping"] )))))

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
                 search-db-for-user   (<! (sql "SELECT * FROM users where user_name = ?"
                                      [username] ))
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

