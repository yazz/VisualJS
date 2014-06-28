(ns webapp.framework.client.coreclient
  (:require
    [goog.net.XhrIo          :as xhr]
    [clojure.browser.repl    :as repl]
    [cljs.reader             :as reader]
    [goog.dom]
    [goog.Uri.QueryData]
    [goog.events]
    [om.core          :as om :include-macros true]
    [om.dom           :as dom :include-macros true]
    [cljs.core.async :as async :refer [chan close!]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use
    [clojure.browser.event :only [listen]]
    [webapp.framework.client.system-globals  :only  [touch]]
  )
)





(def auto-gen-id (atom 0))

(defn new-dom-id []
  (swap! auto-gen-id inc)
  (str "autodom" @auto-gen-id)
  )

(def gui-html (atom {}))
(def el-fn-mapping (atom {}))
(def debug-mode (atom false))









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




(defn get-time [] (. (new js/Date)  (getTime)))


(defn log [s]
  (.log js/console (str s))
  nil
)


(defn send-request2 [ address ]
      (let
      [
        ch            (chan 1)
        headers       (goog.structs.Map.)
        io-object     (goog.net.XhrIo.)
      ]
      (goog.events.listen
          io-object
          goog.net.EventType.COMPLETE
          (fn [ event ]
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
                                      (go
                                        (>! ch (reader/read-string response-text))
                                        (close! ch)
                                      ))

                                       (go
                                           (>! ch  {:error "true"})
                                           (close! ch)
                                       )
                                    )
                    )
               )
            )
            (. headers set "charset" "UTF-8")
            (. io-object send address "POST" nil headers)
            ch
          ))







(defn remote
([
  action
  ]
     (remote action {}))
([
  action
  parameters-in
  ]
  (let
  [
    parameters  (if parameters-in
                  {:params parameters-in :tclock (get-time)})
    ]
    (send-request2
       (str

         (if (= (first action) "!") "action?systemaction=" "action?action=" )
         action
         "&"
         (apply
           str
           (map
             (fn [x]
               (str
                 (encode-parameter
                   x
                   (get parameters x)) "&" ) )
                 (keys parameters))))



                        )))
  )










(defn sql-fn [sql-str params]
  (go
    (<! (remote
                "!sql" {:sql sql-str :params params}))
  )
)

(defn neo4j-fn [cypher-str params]
  (go
    (<! (remote
                "!neo4j" {:cypher cypher-str :params params}))
  )
)

(go
 (let [env (:value (<! (remote "!get-environment" {})))]
   (if (= env "dev")
     (reset! debug-mode true)
     )))











(defn GET [url]
  (let [ch (chan 1)]
    (xhr/send url
              (fn [event]
                (let [res (-> event .-target .getResponseText)]
                  (go
                      (>! ch res)
                      (close! ch)))))
    ch))







(defn from-server []
  (GET "http://127.0.0.1:3000/main.html")
)





(comment defn debug [html2 fname]


    (let [
            html            (make-el html2)
            current-id      (attr ($ html) "id")
            id              (if current-id
                              current-id
                              (let [new-id (new-dom-id)]
                                (attr  ($ html) "id" new-id)
                                new-id
                              )
                            )
          ]

      (attr  ($ html) "onmouseover"
             (str "webapp.framework.client.coreclient.clicked2('" id  "');")
             )
      (attr  ($ html) "onclick"
             (str "webapp.framework.client.coreclient.showcodepopover('" id  "');")
             )
      (attr  ($ html) "onmouseout"
             (str "webapp.framework.client.coreclient.clicked3('" id  "');")
             )
          (.log js/console (str "ID: " id))
    (.log js/console (str "fname: " fname))
      (swap! el-fn-mapping assoc id fname)

      html)


)






(defn- xml-str
 "Like clojure.core/str but escapes < > and &."
 [x]
  (-> x str (.replace "&" "&amp;") (.replace "<" "&lt;") (.replace ">" "&gt;")))





(defn makeit2 [namespace-name fname args & code]
  (let [
        code-str
                  (str (apply str (map #(if (= "\n" %1) (str "\r\n")  %1) code)))
        ]
       (.log js/console (str "NAMESPACE: " namespace-name))
       (.log js/console (str "NAMESPACE fname: " fname))
       (.log js/console (str "NAMESPACE orig code: " code))
       (.log js/console (str "NAMESPACE code: " code-str))
       (reset!
            webapp.framework.client.coreclient/gui-html
            (assoc
              (deref webapp.framework.client.coreclient/gui-html)
              (str fname)
              (xml-str (str  "(defn-html "
                           namespace-name "/"
                           fname " "
                           args (char 13) (char 13)
                           code-str
                   ""
                   )))
            )
        )
  )









(defn process-ui-component [
                            {absolute-path :absolute-path}
                            ]
  (if absolute-path
    (do
      (touch  absolute-path)))

  )


(defn debug-react [data react-fn]
    (dom/div #js {
                  :onMouseOver #(js/alert "clicked")
                  :onMouseOut #(js/alert "out")
                  } (react-fn data) "")
  )
