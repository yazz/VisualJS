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




Adding something to the page
============================

Go to a clojurescript view in src/webapp/client/views

From the Lighttable IDE:

    (add-to "main" "<div>hello world</div>")




Message passing system (AKA events)
===================================

    (define-action "Say something"
        (js/alert "Hello")
    )

    (do-action "Say something")

    (undefine-action "Say something")



Calling server side code
========================

    (defn say-hello [params]
        {:text (str "Hello " (:name params))}
    )


    (remote "say-hello"
            {:name "Johnny"}
            #(str (:text %1))
    )

