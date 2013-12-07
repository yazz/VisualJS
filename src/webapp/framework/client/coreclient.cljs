(ns webapp.framework.client.coreclient
  (:require
    [goog.net.XhrIo          :as xhr]
    [clojure.browser.repl    :as repl]
    [cljs.reader             :as reader]
    [goog.dom]
    [goog.events]
    [crate.core :as crate]
    [cljs.core.async :as async :refer [chan close!]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use
    [domina.events         :only [listen!]]
    [jayq.core             :only [attr html $ css  append fade-out fade-in empty]]
    [domina                :only [value append! by-id destroy! set-text!]]
    [domina.xpath          :only [xpath]]
    [domina.css            :only [sel]]
    [clojure.browser.event :only [listen]]
  )
)





(def auto-gen-id (atom 0))

(defn new-dom-id []
  (swap! auto-gen-id inc)
  (str "autodom" @auto-gen-id)
  )

(def gui-html (atom {}))
(def el-fn-mapping (atom {}))
(def debug-mode (atom {:value false}))









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
  ;(.log js/console (str s))
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


(defn find-el [x]
  (cond
   (and (string? x) (= "<" (first x))) (crate/raw x)
   (string? x) (by-id x)
   (keyword? x) (first ($ x))
   (vector? x) (crate/html x)
   :else x
  )
)



(defmulti
    do-before-remove-element
        (fn [elem]
          (attr ($ (find-el elem)) "id")))




(defmethod do-before-remove-element
    :default
    [elem] (.log js/console (str "Nothing happens when we remove '" (attr ($ (find-el elem)) "id") "'") ))


(defn make-el [x]
  (cond
   (and (string? x) (= "<" (first x))) (crate/raw x)
   (string? x) (str "<div>" x "</div>")
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



(defn clear [this]
  (if (find-el this)
    (goog.dom.removeChildren (find-el this))))
 ;(clear :#main)


(defn remove-element [x]
  (if (find-el x)
        (goog.dom.removeNode (find-el x))

    ))


(defn get-parent [x]
  (if (find-el x)
        (goog.dom.getParentElement (find-el x))

    ))



(defn add-to [this el]
    (goog.dom/appendChild
       (find-el this)
       (find-el el)
    )
)



(defn value-of [x]
  (let [ela (find-el x)]
      (if ela
        (value ela)
      )))







(def action "stuff")


(defn on-click-fn [element  fn-to-call]
    (listen! (find-el element) :click  fn-to-call)
)
(defn on-mouseover-fn [element  fn-to-call]
    (listen! (find-el element) :mouseover  fn-to-call)
)



(defn modal-text []

    (crate/raw "
              <div id='myModal' class='modal fade'>
              <div class='modal-dialog'>
                <div class='modal-content'  style='width: 900px;'>
                  <div class='modal-header'>
                    <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
                    <h4 id='modal-title' class='modal-title'>Modal title</h4>
                  </div>
                  <div id='modal-body' class='modal-body'  >
                  </div>
                  <div class='modal-footer'>
                    <button type='button' class='btn btn-primary' data-dismiss='modal'>Close</button>
                  </div>
                </div><!-- /.modal-content -->
              </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->
           "
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
          popup-el           (find-el "myModal")
          body-el            (make-el body-html)
          ]

        (if popup-el
          (do
              (goog.dom/removeChildren popup-el)
              (goog.dom/removeNode     popup-el)
        ))

        (-> ($ :body)          (append (modal-text) ))
        (-> ($ :#modal-body)   (append body-el))
        (-> ($ :#modal-title)  (html title))


      ;(. ($ "#myModal") (modal))
      (js/showModalPopup)
))







(defn set-text [x text]
    (if (find-el x)
        (-> (find-el x) (set-text! text))))


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
          (goog.dom.appendChild  elem  (find-el child ))
        )
        elem
      )
    )
  )

  ([tag-name]
    (goog.dom.createDom     tag-name    )
    ))






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


(defn is-debug? []
  (go
    (<! (remote
                "get-environment" {}))
  )
)




(extend-type js/HTMLCollection
  ISeqable
  (-seq [array] (array-seq array 0))

  ICounted
  (-count [a] (alength a))

  IIndexed
  (-nth
    ([array n]
       (if (< n (alength array)) (aget array n)))
    ([array n not-found]
       (if (< n (alength array)) (aget array n)
           not-found)))

  ILookup
  (-lookup
    ([array k]
       (aget array k))
    ([array k not-found]
       (-nth array k not-found)))

  IReduce
  (-reduce
    ([array f]
       (ci-reduce array f))
    ([array f start]
       (ci-reduce array f start))))

(extend-type js/NodeList
  ISeqable
  (-seq [array] (array-seq array 0))

  ICounted
  (-count [a] (alength a))

  IIndexed
  (-nth
    ([array n]
       (if (< n (alength array)) (aget array n)))
    ([array n not-found]
       (if (< n (alength array)) (aget array n)
           not-found)))

  ILookup
  (-lookup
    ([array k]
       (aget array k))
    ([array k not-found]
       (-nth array k not-found)))

  IReduce
  (-reduce
    ([array f]
       (ci-reduce array f))
    ([array f start]
       (ci-reduce array f start))))







(defn swap-section
  ([element new-content]
    (do
        (if (find-el element)
          (let [children    (.children ($ (find-el element)))]
            (.log js/console (str "remove children of element name: " (attr ($ (find-el element)) "id"  )))
            (.log js/console (str "children of element name: " children ))
            (if children
              (dorun
               (map
                 (fn [xxx]  (do-before-remove-element xxx))
                 children)
               ))))

        (do-before-remove-element  element)


        (-> ($ (find-el element))
            (fade-out 200
                      #(do
                         (-> ($ (find-el element))
                             (empty)
                             (append (make-el new-content))
                             (fade-in)
                        )
                      )
             )
        )
        nil
     ))
   ([element new-content callback-fn]
    (do
        (-> ($ (find-el element))
            (fade-out 200
                      #(do
                         (-> ($ (find-el element))
                             (empty)
                             (append (make-el new-content))
                             (fade-in)
                             (callback-fn)

                        )
                      )
             )
        )
        nil
     )
))







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





(defn activate-sidebar-item [x]
  (js/deactivateLeftSidebarItems)
  (. ($ (find-el (str "left-sidebar-" x))) addClass "active")

  )


(defn make-sidebar [ & items]
  (let
  [
      the-items    (cons (assoc (first items) :active true) (rest items))
      ]
      (el :div {:id "bs-sidebar" :class "" :style "position:fixed; top:100px;"}
      [
          (el :ul {:class "nav nav-pills nav-stacked"}
              (into []
                (map
                      (fn[x y ] (el :li
                                  {:id (str "left-sidebar-" y)
                                   :class (str (if (:active x) " active" "") " left-menu-button")}
                                  [
                                   (el
                                        :a
                                        {  :href "#"
                                           :onclick
                                           ;:onmouseover
                                               #(do
                                                  (cond
                                                       (:html x)
                                                            (swap-section ($ :#main-section) (make-el (:html x)))
                                                       (:fn x)
                                                            ((:fn x))
                                                  )
                                                  (activate-sidebar-item y)
                                                )
                                           :text (get  x :text)
                                        }
                                    )
                                  ]
                              )
                       )

                             the-items
                             (range 20)
                 )


               )
           )
      ]
)))



(defn header-text [text]
  (el :div {:style "text-align: center; padding: 20px; padding-right: 30px; padding-top: 60px; font-size: 30px;" :text text} ))
(defn body-text [text]
  (el :div {:style "text-align: center; padding: 20px; padding-right: 30px; font-size: 18px;" :text text} ))
(defn body-html [html]
  (el :div {:style "text-align: center; padding: 20px; padding-right: 30px; font-size: 18px;"}
      [html]))





(defn hide-popovers []
    (js/hidePopovers)
)
(defn show-popover [elem text & options]
    (.log js/console
          (str "(show-popover " elem " " text " " options ")"))
    (let [opt         {
                          :placement   "bottom"
;                          :title       "Popup"
                          :container   "body"
                          :html        true
                          :content     (str    "<div id=" (new-dom-id) ">"  text   "</div>")
                      }
          useopt      (merge opt (if options (first options)))
          ]
         (if elem
             (js/showPopover (find-el elem) (clj-to-js useopt))
             (.log js/console (str "cannot find : " elem ))
    ))
)
;(show-popover "logo" "ddd")
;(js/showPopover (find-el "logo") (clj-to-js
;                                  {:container "body" :html true
;                                   :content "d"}))





(defn ^:export clicked2 [id]
  (if (:value @debug-mode)
    (do
      (css
        ($ (find-el id))
        {:border "2px solid lightgray"}
      )
    )
  )
)

(defn ^:export showcodepopover [id]

  (if (:value @debug-mode)
    (do
      (.log js/console (str "code for id: "id ))
      (popup :title "Code"
             :body-html
             (str
             "<div style=''><pre>"
             (get @gui-html (get @el-fn-mapping id))
             "</pre></div>"
             ))
    )
  )
)



(defn ^:export clicked3 [id]
  (if (:value @debug-mode)
    (css
       ($ (find-el id))
        {:border ""})
))




(defn debug [html2 fname]


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






(defprotocol ds
      (-set-text [this text]))



(extend-type js/HTMLDivElement
  ds
  (-set-text
    [this text]  (goog.dom/setTextContent this text)))

;(def a "dd")


(defmulti test :a)
(defmethod test :q [a] "is a q")
(defmethod test :r [a] "is a r")
(defmethod test :default [a] "is something else")

;(test {:a :s})

;(-set-text (.getElementById js/document "main-section") "howdy")




(defn height [element]
    (-> ($ (find-el element) ) (. height))
  )

(defn width [element]
    (-> ($ (find-el element) ) (. width))
  )

