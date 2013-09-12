Clojure on Coils
================
Java/Clojure web development without the pain
---------------------------------------------

Clojure on Coils was born from one web developers pain over many years of both web and desktop software development. Zubair Quraishi started in the early 1990s as a C++ programmer, and then moved to Java, and got heavily involved in Java web applications, only to find the whole make developer, compile, test loop hugely cumbersome and time wasting. Then one day, like many developers before him, around 2008 he discovered Ruby on Rails.

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




Demo site
---------
This website for this repository is online at http://coils.cc






Installation
------------

git clone https://github.com/zubairq/coils.git

Then rename the folder coils to the name of your project




Compiling and running
---------------------

    cd coils
    lein with-profile dev cljsbuild clean
    lein with-profile dev cljsbuild once
    lein with-profile dev ring server




Deploying an application to a Java server as a war file
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


Adding something to the page
----------------------------

Go to a clojurescript view in src/webapp/client/views

From the Lighttable IDE:

    (add-to "main" "<div>hello world</div>")




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

Define in fns.clj on the server side (using core.async):

    (defn say-hello [params]
        {:text (str "Hello " (:name params))}
    )



From the client side:

    (go
         (js/alert
             (:text (<! (remote "say-hello" {:name "Johnny"})))))





Client side SQL
---------------

    (go
        (.log js/console (str (<! (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))
     )


 Please note that the raw SQL is not visible from web browsers as it is encryted via a server side macro.



Client side Neo4j Cypher
------------------------

    (go
        (.log js/console (str (<! (neo4j "START x = node(11) RETURN x" {} ))))
    )

 Please note that the raw Cypher code is not visible from web browsers as it is encryted via a server side macro.
