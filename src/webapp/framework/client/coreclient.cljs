(ns webapp.framework.client.coreclient
  (:require
    [goog.net.XhrIo          :as xhr]
    [clojure.browser.repl    :as repl]
    [cljs.reader             :as reader]
    [goog.net.XhrIo]
    [goog.dom]
    [goog.events]
    [crate.core :as crate]
  )
  (:use
    [domina.events         :only [listen!]]
    [jayq.core             :only [$ html append]]
    [domina                :only [append! by-id value destroy! ]]
    [domina.xpath          :only [xpath]]
    [domina.css            :only [sel]]
    [clojure.browser.event :only [listen]]
  )

)

(defn to-el [x]
  (cond
   (and (string? x) (= "<" (first x))) (crate/raw x)
   (string? x) (by-id x)
   (keyword? x) (first ($ x))
   (vector? x) (crate/html x)
   :else x
  )
)


(defn to-tag-name [x]
  (cond
   (string? x) x
   (keyword? x) (name x)
   :else x
  )
)


(to-tag-name :div2)
;(to-el "main")
;(gn :#main)



(defn clear [this]
  (if (to-el this)
    (goog.dom/removeChildren (to-el this))))
 (clear :#main)


(defn add-to [this el]
    (goog.dom/appendChild
       (to-el this)
       (to-el el)
    )
)




(defn get-time [] (. (new js/Date)  (getTime)))




(defn make-js-map
  "makes a javascript map from a clojure one"
  [cljmap]
  (let [out (js-obj)]
    (doall
     (map
      #(aset out (name (first %)) (second %)) cljmap))
    out))







(defn clj-to-js
  "Recursively transforms ClojureScript maps into
  Javascript objects, other ClojureScript colls
  into JavaScript arrays, and ClojureScript keywords
  into JavaScript strings."
  [x]

  (clj->js x))





(defn encode-parameter [name value]
          (.
            (goog.Uri.QueryData/createFromMap
              (goog.structs.Map.
                (make-js-map
                  { name value}
                )
              )
            )
            (toString)
           ))







(defn send-request [ address  fn-callback ]
      (let
      [
        headers       (goog.structs.Map.)
        io-object     (goog.net.XhrIo.)
        cb            (fn [ event ]
                          (let
                            [
                              target          (.-target event)
                              status          (. target (getStatus))
                            ]
                                (if (= status 200)
                                  (let
                                    [
                                      response-text   (. target (getResponseText))
                                    ]
                                      (fn-callback  response-text)
                                   )
                                   (js/alert address)
                                )
                              )
                            )
      ]
          (do
            (goog.events.listen    io-object    goog.net.EventType.COMPLETE cb)
            (. headers set "charset" "UTF-8")
            (. io-object send address "POST" nil headers)
          )))




(defn remote
[
  action
  parameters-in
  fn-process-reply2
  ]
  (let
  [
    parameters  (if parameters-in
                  {:params parameters-in :tclock (get-time)})
    ]
    (send-request
       (str "action?action=" action "&"
         (apply
           str
           (map
             (fn [x]
               (str
                 (encode-parameter
                   x
                   (get parameters x)) "&" ) )
                 (keys parameters))))

                 (fn [ response ]
                     (let
                     [
                         data      (reader/read-string response)
                     ]
                        (fn-process-reply2 data) )))))




(defn onclick-fn [element  fn-to-call]
    (listen! (to-el element) :click  fn-to-call)
)



(defn modal-text []

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
                  [:h3  {:id "myModalLabel"} ""]
            ]



            [
                 :div {:id "modal-body" :class "modal-body"}

            ]



            [
                 :div {:class "modal-footer"}
                  [:button {:class "btn"
                            :data-dismiss "modal"
                            :aria-hidden "true"} "Close"]
;                  [:button {:class "btn btn-primary"} "Save changes"]
            ]
         ]
    )
)



(defn popup [& {:keys
        [
             title
             body-html
        ]
       }
    ]
    (let [
          ela     (to-el body-html)
          m       (by-id "myModal")
          ]
        (if m
          (do
              (goog.dom/removeChildren m)
              (goog.dom/removeNode m)
        ))

      (-> ($ :body) (append (modal-text) ))
      (-> ($ :#modal-body) (append ela))
      (-> ($ :#myModalLabel) (html title))


     (. ($ :#myModal) modal)
))


;(popup "Pup" "<div>dd</div>")





(defn el


  ([tag-name attributes]

  (let
  [
      attributes-js-array   (make-js-map    attributes)
      text-content          (get attributes :text)
      elem                  (goog.dom.createDom     (to-tag-name tag-name)    attributes-js-array)
  ]

    (if text-content
      (. goog.dom setTextContent elem text-content))
    elem))



  ([tag-name attributes children]

    (let
      [
          attributes-js-array   (make-js-map    attributes)
          elem                  (goog.dom.createDom     (to-tag-name tag-name)    attributes-js-array)
      ]
      (do
        (doseq [child children]
          (goog.dom.appendChild  elem  child )
        )
        elem
      )
    )
  )

  ([tag-name]
    (goog.dom.createDom     tag-name    )
    ))




;clear homepage
;(add-to "main" (el "div"  ))



;(to-el "<div>eef</div>")


;(+ 1 1)
;add-to

;(el "div" [])

;el
