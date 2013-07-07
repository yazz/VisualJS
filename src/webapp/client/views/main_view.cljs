(ns webapp.client.main-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [clear addto remote  add-to]]
;        [jayq.core                          :only [$ css  append ]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [onclick]]
     )
)


(defn homepage-html []
      [:div {}

        [:h1 {:style "padding: 20px;"} "Clojure on Coils"]

        [:div {:style "padding: 20px;"} "Welcome to Clojure on Coils."]

        [:div {:style "padding: 20px;"}
         "Clojure on Coils is a Clojure based webapp framework
         for single page database backed webapps"]

        [:div {:style "padding: 20px;"}
                  "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"]


        [:button#help-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Help"]

        [:button#who-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Who are we"]

        [:button#disappear-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Dissappear"]

        [:button#show-esb-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "ESB"]
     ]
)




(defn add-homepage-listeners []

  (comment onclick "show-esb-button"
           (esb))

  (comment onclick "disappear-button"
           ;(-> ($ :#main) (append "")
     nil
               ;(toggle "explode")
               ;(toggle "explode")
  ;             )
  )

  (onclick "help-button" (help))



  (onclick  "who-button"

            (do-action "show who page"))


  (comment onclick  "remote-db-button"
            (remote "get-db-data" {:a 1}
                    (fn [reply]
                      (js/alert reply))))
  )



(define-action
    "show homepage"
    (do
        (addto "main" (homepage-html))
       (add-homepage-listeners)
))


