Clojure on Coils
================
This website for this repository is online at http://coils.cc


Clojure on Coils
================

A web framework for Clojure. A few notes:

- Uses Clojure for the server side
- Uses ClojureScript for the client side
- Best developed and run using the LightTable IDE



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
