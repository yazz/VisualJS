Clojure on Coils
================

                   
        
                   ...Z:~~~~=~~=:$.             
                ..Z~~~~~=7I~~?7+~~~~~O..        
              ..:~~~= ......... ...~~~~=..      
            . I~~+....~=~~~~~~~~~~ ...~~~?.     
            .~~~....~~~~~?....?=~~~:....~~$.    
           .~~?...:~~$ .. .....  .+~~=...=~$    
          .+~:  .~~~....:~~~~~~~,...:~~...~~ .               .__.__           
          ~~~...=~?...=~~7....$~~~...+~=. 7~~.    ____  ____ |__|  |   ______        ____  ____  
          :~7..~~$ .7~~?.. ..  .$~~:..~~7..~~.   / ___\/  _ \ __|  |  /  ___/       / ___\/ ___\ 
          ~~. +~~...~~.    ..   .~~~ .?~~..~~7  |  \__(  <_> )  |  |__\___ \       |  \__\  \___ 
         .~~..~~7..+~I.  .........:~=..~~..7~+   \____ \____/|__|____/_____/   /\   \____/ ____/
         ,~~I+~~?:O~~~?..........:I?$. ~~. I~~                                 \/        
         .~~.~~~I..~~?.    .. 8=~    .I~~..7~?  
         .~~..I~~..$~~  .IZ..        .~~I..~~+  
          ~~=..~~...~~Z..  ..      ..~~~..I~~.  
          Z~:..$~:...~~=.  ..  ... $~~Z...~~,.  
          .~~$..:~=...I~~~?=...=+~~~~....~~Z..  
          ..~~...:~~....,~~~~~~~~~=....7~~=.    
            7~~,. Z~~:.........  ....?~~~.      
            .,~~$...?~~=~Z.......O~~~~:...      
              .:~~?.. .I=~~~~~~~~~~I.. .        
                ,~~~=.. ......... .             
                 ..?~~~~=7=....                 
                  ....=?~~~~~I.                 
                       ........     
                       

Clojure web development without the pain
----------------------------------------

Clojure on Coils was born from one web developer's pain over many years of both web and desktop software development. Zubair Quraishi started in the early 1990s as a C++ programmer, and then moved to Java, and got heavily involved in Java web applications, only to find the whole make developer, compile, test loop hugely cumbersome and time wasting. Then one day, like many developers before him, around 2008 he discovered Ruby on Rails.

Wow! Suddenly the world opened up for Zubair and he realised there was a better way with interactive languages and easy SQL queries. Soon however, he became frustrated again, as with Rails everything was generated on the server and it did not allow enough fine grained control of the web page on the client. So, in true developer style, Zubair took the long and painful route, going to Erlang, Clojure and Vaadin, Grails, JQuery, Javascript, Google Closure, Dart, and finally deciding to use Clojurescript for a project he was involved with.

That project was NemCV, and it is the CV system for Denmark. Seeing that there was alot of good work in NemCV that could be reused Zubair took inspiration from Ruby on Rails, which coincidently also came from Denmark, where a developer called David Heinemeier Hansson made Ruby on Rails based on a project called BaseCamp which he had made. So thus, Clojure on Coils was born!






What is Clojure on Coils?
-------------------------

Clojure on Coils is a web framework where development is done with Clojure and Clojurescript, and runs on the JVM so it can be deployed on any Java web or application server, including Jetty, Tomcat, JBoss, Glassfish, Weblogic, or Websphere. A few notes:

- Uses Clojure for the server side
- Uses ClojureScript for the client side
- Best developed and run using the LightTable IDE





Unique features
---------------

- Click on the Coils.cc logo in the top left of the screen to toggle the debug mode, then click on any element to see the code used to generate that element

- Secure client side SQL. All calls are encrypted uses a server side key to avoid SQL injection attacks, yet at the same time allowing easy to understand SQL calls appear to be made in client side code

- Secure client Neo4j Cypher. All calls are encrypted uses a server side key to avoid Cypher injection attacks, yet at the same time allowing easy to understand Cypher calls appear to be made in client side code

- Web development without callback hell. Clojure on Coils uses a special feature of Clojure  called core.async to make all server side calls be written in a synchronous style



All features
------------

- Interactive client and server side development with LightTable IDE

- Integration with Mandrill for sending transactional emails

- Twitter Bootstrap 3.0 for styling

- Can use Crate for HTML

- Uses Dommy

- Uses Domina

- JayQ for JQuery integration

- Google Closure for advanced compression

- Google Closure UI Library - the same library used to build Google.com, Gmail, and Google+

- CLJ HTTP for server side HTTP requests

- SQL Korma for database requests

- Neocons for Neo4j access

- Compojure, Ring, and Shoreleave for server side code

- Clojure core.async for client side synchronous programming model

- Google Maps integration for true Ajax maps (can be swapped ina nd out)



Demo site
---------
This website for this repository is online at http://coils.cc





Comparison with other Clojure web frameworks
--------------------------------------------

<a hre='http://www.luminusweb.net/'>Luminus</a> - The main difference between Luminus and Clojure on Coils is that Luminus using a HTML templating system to render the web pages, whereas Clojure on Coils currently only support rendering from within Clojure itself. This makes Luminus currently a better choice than Clojure on Coils, especially for companies where there are seperate design and development teams, and designers will be more comfortable working in clean HTML files.

<br>

<a hre='http://pedestal.io/'>Pedestal</a> - Pedestal is an amazing Clojure web framework made by the main Clojure developers themselves at Relevance. It has a number of differences to Clojure on Coils, the main one being that Pedestal does not support Windows environments, whereas Clojure on Coils works fine on Windows.





Installation
------------

git clone https://github.com/zubairq/coils.git

Then rename the folder coils to the name of your project




Anatomy of a Coils application
------------------------------

    coils app name
        └ README.md
          project.clj

          src
              └ webapp
                  └ client
                      └ views
                          └ page_structure.cljs
                            ... more views ...

                        main.cljs
                        gui_actions.cljs
                        session.cljs
                        actions.cljs

                             ...
                    server
                        └ fns.clj - server side functions go here



                    framework
                        └ client
                              ...
                          server

          resources
              └ public
                main.html


    srcprod
        └ webapp_config
            └ settings.clj

    srctest
        └ webapp_config
            └ settings.clj



Getting started
---------------

1)

    cd coils
    lein with-profile dev cljsbuild clean
    lein with-profile dev cljsbuild once
    lein with-profile dev ring server

2) Open LightTable

3) Add the coils project directory

4) Open a Browser tab and point to 127.0.0.1:3000

The easiest way to get started is to get the projects and just play around with the demo app first. The demo app is online at http://coils.cc. Click on the logo in the top left and then you enter the debug mode. Now you can click on most elements on the page and you can see the code used to generate them.




Adding something to the web page
--------------------------------

1) Go to a clojurescript view in src/webapp/client/views/main_view.cljs

2) Add to main_view.cljs

    (swap-section "main" "<div>hello world</div>")

3) press Ctrl/Alt Enter on the line and the view should swap out the whole page with the text "Hello world"


Adding debuggable elements to the page
--------------------------------------

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



Client side message passing system (AKA events)
-----------------------------------------------

Define an action:

    (redefine-action "Say something"
        (js/alert "Hello")
    )


Call an action:

    (do-action "Say something")



Calling server side code
------------------------

From the client side:

    (go
         (js/alert
             (:text (<! (remote "say-hello" {:name "Johnny"})))))



Define in fns.clj on the server side (using core.async):

    (defn say-hello [{name :name}]
        {:text (str "Hello " name))}
    )







Client side SQL
---------------

    (go
        (.log js/console (str (<! (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))
     )


 Please note that the raw SQL is not visible from web browsers as it is encryted via a server side macro, a feature unique to Clojure and Lisp.




Client side Neo4j Cypher
------------------------

    (go
        (.log js/console (str (<! (neo4j "START x = node(11) RETURN x" {} ))))
    )

 Please note that the raw Cypher code is not visible from web browsers as it is encryted via a server side macro.




How secure client side SQL works
--------------------------------

It may seem strange that you can call SQL synchronously from the client yet the call is sent to the server, is secure, and behaves asynchronously internally. All I can say is welcome to the world of Lisp! To understand a bit more about this you need to realise that Clojure is an implementation of Lisp for the JVM, and Clojurescript is Lisp on Javascript. Lisp itself has alot of special features which are not available in other languages, such as the ability to write code itself, also known as Lisp Macros. This ability is not available as a first class feature in any other language!

Anyway, before I stray too much away from the point, there are two features of the Clojure implementation of Lisp that allows synchronous secure client side SQL:

- core.async
- macros (no, not your C++ macros)

So when you make a client side SQL call the SQL is encyrpted using a Macro at compile time:

    (defmacro sql [sql-str params]
        `(webapp.framework.client.coreclient.sql-fn
            ~(encrypt sql-str)
            ~params
        )
    )
    
So this means that the SQL string in a client side SQL call:

    (go
        (.log js/console (str (<! (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))
     )

: will be rewritten at compile time, so it will be impossible for anyone who does "View source" on your web page to see the SQL code




Functions available
-------------------------------------------------------
There are many library functions available, although it is a bit of a mess having to require and use everything in the Clojurescript namespace header:

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
      (.log js/console "Hello")
    )  



**do-action message** - Puts a message onto the service bus with paramters. This can be picked up by zero or more receivers

    (do-action  "say-hello" {:name "Peter"})  




**define-action** - Acts on a message sent to the service bus. Please note that the message is an implicitly defined variable in an action

    (define-action  "say-hello"
      (.log js/console (str "Hello" (:name message)))
    )  

  
    
  
    
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

    mkdir srcprod
    cd srcprod
    mkdir webapp_config
    cd webapp_config
    touch settings.clj
    ... copy and amend the settings from coils/srcdev/webapp_config/settings.clj ...
    cd ..
    cd ..
    cd coils
    lein with-profile prod cljsbuild clean
    lein with-profile prod cljsbuild once
    lein with-profile prod ring uberwar
    ... deploy the resulting war file ...

