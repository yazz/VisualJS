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
    [jayq.core             :only [html $ css  append fade-out fade-in empty]]
    [domina                :only [value append! by-id destroy! set-text!]]
    [domina.xpath          :only [xpath]]
    [domina.css            :only [sel]]
    [clojure.browser.event :only [listen]]
  )
)


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
[
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


(defn find-el [x]
  (cond
   (and (string? x) (= "<" (first x))) (crate/raw x)
   (string? x) (by-id x)
   (keyword? x) (first ($ x))
   (vector? x) (crate/html x)
   :else x
  )
)


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


(to-tag-name :div2)
;(find-el "main")
;(gn :#main)



(defn clear [this]
  (if (find-el this)
    (goog.dom.removeChildren (find-el this))))
 (clear :#main)


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
                <div class='modal-content'>
                  <div class='modal-header'>
                    <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
                    <h4 class='modal-title'>Modal title</h4>
                  </div>
                  <div class='modal-body'>
                    <p>One fine body&hellip;</p>
                  </div>
                  <div class='modal-footer'>
                    <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
                    <button type='button' class='btn btn-primary'>Save changes</button>
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
          ela     (find-el body-html)
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


      ;(. ($ "#myModal") (modal))
      (js/showHelp)
))

;(-> (js/$ "#myModal") (.modal))

;(popup "Pup" "<div>dd</div>")


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




(defn swap-section
  ([element new-content]
    (do
        (-> element
            (fade-out 200
                      #(do
                         (-> element
                             (empty)
                             (append new-content)
                             (fade-in)
                        )
                      )
             )
        )
        nil
     ))
   ([element new-content callback-fn]
    (do
        (-> element
            (fade-out 200
                      #(do
                         (-> element
                             (empty)
                             (append new-content)
                             (fade-in)
                             (callback-fn)

                        )
                      )
             )
        )
        nil
     )
))

;clear homepage
;(add-to "main" (el "div"  ))



;(find-el "<div>eef</div>")


;(+ 1 1)
;add-to

;(el "div" [])

;el


(defn GET [url]
  (let [ch (chan 1)]
    (xhr/send url
              (fn [event]
                (let [res (-> event .-target .getResponseText)]
                  (go
                      (>! ch res)
                      (close! ch)))))
    ch))




(comment go
   (log (:text (<! (remote "say-hello" {:name "1"}))))
   (log (:text (<! (remote "say-hello" {:name "2"}))))
   (log (:text (<! (remote "say-hello" {:name "3"}))))
   (log (:text (<! (remote "say-hello" {:name "4"}))))
   (log (:text (<! (remote "say-hello" {:name "5"}))))
   (log (:text (<! (remote "say-hello" {:name "6"}))))
   (log (:text (<! (remote "say-hello" {:name "7"}))))
   (log (:text (<! (remote "say-hello" {:name "8"}))))
   (log (:text (<! (remote "say-hello" {:name "9"}))))
   (log (:text (<! (remote "say-hello" {:name "10"}))))

)





(log "df")

(defn from-server []
  (GET "http://127.0.0.1:3000/main.html")
)

(go
  (log (count (<! (from-server))))
  (log (count (<! (GET "http://127.0.0.1:3000/main.html"))))
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
                      (fn[x] (el :li
                                  {:class (str (if (:active x) " active" "") " left-menu-button")}
                                  [
                                   (el
                                        :a
                                        {  :href "#"
                                           ;:onclick #(js/alert "fd")
                                           :onmouseover
                                               #(swap-section ($ :#main-section) (make-el (:html x)))
                                           :text (get  x :text)
                                        }
                                    )
                                  ]
                              )
                       )

                             the-items
                 )


               )
           )
      ]
)))


(defn header-text [text]
  (el :div {:style "text-align: center; width: 100%; padding: 20px; padding-right: 150px; padding-top: 60px; font-size: 30px;" } [
            (el :div {:text text} )]))

(defn body-text [text]
  (el :div {:style "text-align: center; padding: 20px; padding-right: 150px; font-size: 18px;" :text text} ))

(defn body-html [html]
  (el :div {:style "text-align: center; padding: 20px; padding-right: 150px; font-size: 18px;"}
      [html]))



(defn show-popover [elem text & options]
    (let [opt         {
                          :placement   "bottom"
                          :container   "body"
                          :html        true
                          :content     (str    "<div id=popover>"  text   "</div>")
                      }
          useopt      (merge opt (if options (first options)))
          ]
         (do
             (js/showPopover (find-el elem) text (clj-to-js useopt))
    ))
)



