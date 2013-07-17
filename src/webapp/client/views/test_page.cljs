(ns webapp.client.test-page
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
    )
    (:use
        [webapp.framework.client.coreclient :only [clear add-to help remote  add-to]]
;        [jayq.core                          :only [$ css   append]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [on-click]]
     )
)





(defn show-testpage []
  (do-action      "clear homepage")

            (add-to :body [:div#main])

            (add-to "main" [:h1 {:style "padding: 20px;"}
                                    "Test page"])

            (add-to "main" [:div {:style "padding: 20px;"}
                                    "Welcome to Clojure on Coils."])



            (add-to "main" [:div {:style "padding: 20px;"}
                                      "Clojure on Coils is a Clojure based webapp framework
                                       for single page database backed webapps"])

            (add-to "main" [:div {:style "padding: 20px;"}
                  "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"])


            (add-to
                 "main"
                 [:button#help-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Help"])



            (add-to
                 "main"
                 [:button#remote-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Remote call"])

            (add-to
                 "main"
                 [:button#remote-db-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Remote DB call"])

            (add-to
                 "main"
                 [:button#disappear-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "Dissappear"])

            (add-to
                 "main"
                 [:button#show-esb-button
                      {:style "margin: 20px;"
                       :class "btn btn-large"}
                       "ESB"])
            (on-click :#show-esb-button
                     (esb))


            (on-click "help-button" (help))



            (on-click  "remote-button"

                      (remote "test-call" {:a {:c 2 :d 3}}
                              (fn [reply]
                                (js/alert reply))))


            (on-click  "remote-db-button"
                      (remote "get-db-data" {:a 1}
                           (fn [reply]
                               (js/alert reply))))
)

(define-action
    "show testpage"
    (do
        (show-testpage)
))

