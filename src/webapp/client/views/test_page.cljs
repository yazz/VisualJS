(ns webapp.client.test-page
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
    )
    (:use
        [webapp.framework.client.coreclient :only [clear addto help remote  add-to]]
;        [jayq.core                          :only [$ css   append]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [onclick]]
     )
)





(defn show-testpage []
  (do-action      "clear homepage")

            (addto :body [:div#main])

            (addto "main" [:h1 {:style "padding: 20px;"}
                                    "Test page"])

            (addto "main" [:div {:style "padding: 20px;"}
                                    "Welcome to Clojure on Coils."])



            (addto "main" [:div {:style "padding: 20px;"}
                                      "Clojure on Coils is a Clojure based webapp framework
                                       for single page database backed webapps"])

            (addto "main" [:div {:style "padding: 20px;"}
                  "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"])


            (addto
                 "main"
                 [:button#help-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Help"])



            (addto
                 "main"
                 [:button#remote-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Remote call"])

            (addto
                 "main"
                 [:button#remote-db-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Remote DB call"])

            (addto
                 "main"
                 [:button#disappear-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Dissappear"])

            (addto
                 "main"
                 [:button#show-esb-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "ESB"])
            (onclick :#show-esb-button
                     (esb))


            (onclick "help-button" (help))



            (onclick  "remote-button"

                      (remote "test-call" {:a {:c 2 :d 3}}
                              (fn [reply]
                                (js/alert reply))))


            (onclick  "remote-db-button"
                      (remote "get-db-data" {:a 1}
                           (fn [reply]
                               (js/alert reply))))
)

(define-action
    "show testpage"
    (do
        (show-testpage)
))

