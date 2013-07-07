(ns webapp.framework.client.help

  ;----------------------------------------
  (:require
    [goog.net.XhrIo          :as xhr]
    [clojure.browser.repl    :as repl]
    [cljs.reader             :as reader]
    [goog.net.XhrIo]
    [goog.dom]
    [goog.events]
    [crate.core :as crate]
  )

  ;----------------------------------------
  (:use
    [domina :only [append! by-id value destroy! ]]
    [domina.events :only [listen!]]
    [domina.xpath :only [xpath]]
    [domina.css            :only [sel]]
    [webapp.framework.client.coreclient :only [clear addto  remote  add-to]]
    [jayq.core                          :only [$ append ]]
  )

  ;----------------------------------------
  (:use-macros [crate.def-macros :only [defpartial]]
  )
)








(defn help-text []
(crate/html
        [:div
            {
               :id "myModal"
               :class "modal hide fade"
               :tabindex "-1"
               :role "dialog"
               :aria-labelledby "myModalLabel"
               :aria-hidden"true"
            }

            [
                :div
                {
                  :id "myModal" :class "modal-header"}
                  [:button
                   {
                    :type "button"
                    :class "close"
                    :data-dismiss "modal"
                    :aria-hidden "true"}
                       "x"]
                  [:h3  {:id "myModalLabel"} "Modal header"]
            ]



            [
                 :div {:class "modal-body"}
                    [:p {} "One fine body…"]
            ]



            [
                 :div {:class "modal-footer"}
                  [:button {:class "btn"
                            :data-dismiss "modal"
                            :aria-hidden "true"} "Close"]
                  [:button {:class "btn btn-primary"} "Save changes"]
            ]
         ]
)
)



(defn help []
  (if (not (by-id "myModal"))
      (append! (xpath "//body") (help-text))
  )

  ;(-> ($ :#main) (append "<div>GOTOMETTERUG</div>"))
  (js/showHelp)
  nil
)


;xpath

;(xpath "//body")

;(sel "myModal")


;(help-text)


