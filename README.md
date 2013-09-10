Clojure on Coils
================
Java/Clojure web development without the pain




Demo site
=========
This website for this repository is online at http://coils.cc




What is Clojure on Coils?
=========================

Clojure on Coils is a web framework where development is done with Clojure, a JVM language, so it
can be deployed on any Java web or application server. A few notes:

- Uses Clojure for the server side
- Uses ClojureScript for the client side
- Best developed and run using the LightTable IDE



Unique features
===============

- Click on the Coils.cc logo in the top left of the screen to toggle the debug mode, then click on any element to see the code used to generate that element

- Secure client side SQL. All calls are encrypted uses a server side key to avoid SQL injection attacks, yet at the same time allowing easy to understand SQL calls appear to be made in client side code

- Secure client Neo4j Cypher. All calls are encrypted uses a server side key to avoid Cypher injection attacks, yet at the same time allowing easy to understand Cypher calls appear to be made in client side code

- Web development without callback hell. Clojure on Coils uses a special feature of Clojure  called core.async to make all server side calls be written in a synchronous style


Installation
============

git clone https://github.com/zubairq/coils.git

Then rename the folder coils to the name of your project




Compiling and running
=====================

    cd coils
    lein with-profile dev cljsbuild clean
    lein with-profile dev cljsbuild once
    lein with-profile dev ring server





Adding something to the page
============================

Go to a clojurescript view in src/webapp/client/views

From the Lighttable IDE:

    (add-to "main" "<div>hello world</div>")




Client side message passing system (AKA events)
===============================================

Define an action:

    (redefine-action "Say something"
        (js/alert "Hello")
    )


Call an action:

    (do-action "Say something")



Calling server side code
========================

Define in fns.clj on the server side (using core.async):

    (defn say-hello [params]
        {:text (str "Hello " (:name params))}
    )



From the client side:

    (go
         (js/alert
             (:text (<! (remote "say-hello" {:name "Johnny"})))))





Client side SQL
===============

    (go
        (.log js/console (str (<! (sql "SELECT * FROM test_table where name = ?" ["shopping"] ))))
     )


 Please note that the SQL is not visible from web browsers as it is encryted via a server side macro.



Client side Cypher
==================

    (go
        (.log js/console (str (<! (neo4j "START x = node(11) RETURN x" {} ))))
    )

 Please note that the Cyoher is not visible from web browsers as it is encryted via a server side macro.
