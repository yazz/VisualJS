(ns webapp.client.main-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql el clear addto remote  add-to]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)


(defn homepage-html []

  (el
    :div {}
     [

        (el :div {:style "padding: 20px;"
                  :text "Welcome to Clojure on Coils."} )

        (el :div {:style "padding: 20px;"
                  :text "Clojure on Coils is a Clojure based webapp framework for single page database backed webapps"})

        (el :div {:style "padding: 20px;"
                  :text "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"})


        (el :button
                      {:id    "help-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "Help"
                       :onclick #(help)})

        (el :button
                      {:id    "dissappear-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "Dissappear"
                       :onclick  #(! clear)
                       })

        (el :button
                      {:id "show-esb-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "ESB"
                       :onclick #(esb)})

        ;(el :div {:id "popup"})
     ]
  )
)






(defn top-nav-bar []
        "<div class=navbar>
              <div class=navbar-inner>
                <a class=brand href='#'>Coils.cc</a>
                <ul class=nav>
                  <li id='home-button' class=active><a href='#'>Home</a></li>
                  <li><a href='#'>Docs</a></li>
                  <li><a href='#'>Case studies</a></li>
                  <li><a id='contact-button' href='#'>Contact</a></li>
                </ul>
              </div>
            </div>
   <div id=main-content-area ></div>
  "
  )


(defn add-nav-listeners []
    (on-mouseover
              "contact-button"
              (do-action "show who page"))
    (on-mouseover
              "home-button"
              (do-action "show home page"))
)








(define-action
    "show homepage"
    (do
        (add-to "main" (top-nav-bar))
        (add-nav-listeners)

        (add-to "main-content-area" (homepage-html))

))

(define-action
    "refresh homepage"
    (do
      (do-action "clear homepage")
      (do-action "show homepage")
    )
)



(comment remote "say-hello"
        {:name "Johnny"}
        (fn [reply] (js/alert (str (:text reply))))
)



(comment  remote "!say-hello"
        {:name "Johnny"}
        (fn [reply] (js/alert (str (:text reply))))
)


(comment remote "get-db-data" {:a 1}
                           (fn [reply]
                               (js/alert reply)))


;(sql "" {} (fn[reply] (js/alert (str reply))))


;(do-action "refresh homepage")


(define-action
    "show home page"
    (do
        (-> ($ :#main-content-area)
            (fade-out 200
                      #(do
                         (-> ($ :#main-content-area)
                             (empty)
                             (append (homepage-html))
                             (fade-in)
                        )
                      )
             )
        )
        nil
     )
)

