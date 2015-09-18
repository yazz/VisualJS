(ns webapp.framework.client.coreclient
  (:refer-clojure :exclude [val empty remove find next parents])
  (:require
   [clojure.string]
   [goog.net.XhrIo          :as xhr]
   [clojure.browser.repl    :as repl]
   [cljs.reader             :as reader]
   [goog.dom]
   [om.core                 :as om :include-macros true]
   [clojure.data            :as data]
   [om.dom                  :as dom]
   [clojure.zip]
   [clojure.set]
   [goog.Uri.QueryData]
   [goog.events]
   [cljs.core.async         :as async :refer [chan close!]]
   )

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]])

  (:use
   [clojure.browser.event :only [listen]]
   [webapp.framework.client.system-globals  :only  [touch
                                                    debugger-ui
                                                    record-pointer-locally
                                                    app-state
                                                    reset-app-state
                                                    data-views-v2
                                                    ui-watchers
                                                    call-stack
                                                    data-watchers
                                                    data-state
                                                    update-data
                                                    add-debug-event
                                                    component-usage
                                                    gui-calls
                                                    app-watch-on?
                                                    data-accesses
                                                    paths-for-refresh
                                                    data-views
                                                    record-ui
                                                    touch-data
                                                    assoc-in-atom
                                                    add-init-state-fn
                                                    global-om-state
                                                    data-session-id
                                                    data-view-requests-v2
                                                    data-query-requests-v2
                                                    data-record-requests-v2
                                                    data-queries-v2
                                                    data-records-v2
                                                    ui-paths-v2
                                                    datasource-fields]])
  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils
                                               sql log sql-1
                                               watch-data
                                               -->ui
                                               <--data
                                               remote
                                               defn-ui-component
                                               container
                                               map-many
                                               inline
                                               text
                                               div
                                               ]]))
(ns-coils 'webapp.framework.client.coreclient)



(def debug-mode (atom false))

(def data-views-proxy  data-views)



(defn  data-tree!
  "
  Updates the data tree
  "
  [path value]
   (reset! data-state (assoc-in @data-state path value)))





(defn replace-nil-with [val1 val2]
  (if (nil? val1)
    val2
    val1))




(defn  data-tree
  "
  "
  [path]
  (get-in @data-state path))








(defn  -->data-fn
  "
  "
  [path value]
   (reset! data-state (assoc-in @data-state path value)))








(defn  <--data-fn
  "
  "
  [path]
  (get-in @data-state path))






(defn remove-debug-event
  "
  "
  [did]
  (reset! call-stack
          (into [] (filter #(not= %1 did) @call-stack))
          )
  )



;-----------------------------------------------------
; watch when the data changes
;
;
;-----------------------------------------------------
(add-watch data-state
           :change
           (fn [_ _ old-val new-val]
             (if @app-watch-on?
               (let [debug-id (add-debug-event
                               :event-type  "DATA"
                               :old         old-val
                               :new         new-val
                               :parent-id   (last @call-stack)
                               )]
                 (remove-debug-event debug-id)))))






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



(defn ok [response]
  (not (:error response)))



(defn send-request2 [ address   action  parameters-in  ch]
  (let
    [
     headers       (goog.structs.Map.)
     io-object     (goog.net.XhrIo.)
     ]
      (do
;        (log (str "send-request2: " action " || " parameters-in ))
      (goog.events.listen
       io-object
       goog.net.EventType.COMPLETE

       (fn [event]
         (let
           [target          (.-target event)
            status          (. target (getStatus))]
           (if (= status 200)
             (let [
                   response-text   (. target (getResponseText))
                   response        (reader/read-string response-text)
                   ]
                (let [
                      debug-id (add-debug-event
                                :event-type  "remote"
                                :action-name (str action)
                                :input       parameters-in
                                :result      response
                         )]

               (go
;        (log (str "             : " response ))
                  (>! ch response)
                  (close! ch))
                  (remove-debug-event  debug-id)
                  ))

              (let [debug-id
                    (add-debug-event
                     :event-type  "remote"
                     :action-name (str action)
                     :input       parameters-in
                     :result      (str "ERROR IN RESPONSE, HTTP : " status)
                     )]
             (go
                (>! ch  {:error "true"})
                (close! ch))
                (remove-debug-event  debug-id)
                )



             ))))
      (. headers set "charset" "UTF-8")
      (. io-object send address "POST" nil headers)
    ch)))







(defn remote-fn
  ([action]
   (remote-fn action {}))



  ([action  parameters-in]
   (let
     [
      parameters  (if parameters-in {:params parameters-in :tclock (get-time)})
      ch          (chan)
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
           (do
             (str
              (encode-parameter
               x
               (get parameters x)) "&" ))
           )
         (keys parameters))))
      action
      parameters-in
      ch
      ))))










(defn sql-fn [sql-str params]
  (go
    (<! (remote-fn
                "!sql" {:sql sql-str :params params}))))







(go
 (let [env (:value (<! (remote-fn "!get-environment" {})))]
   (if (or (= env "dev") (= env "base"))
     (reset! debug-mode true))))



(go
 (let [record-pointer-locally-value (:value
                                     (<! (remote-fn "!get-record-pointer-locally" {})))]
     (reset! record-pointer-locally
             record-pointer-locally-value)))




(go
 (let [record-ui-value (:value
                    (<! (remote-fn "!get-record-ui" {})))]
     (reset! record-ui
             record-ui-value)))





(defn GET [url]
  (let [ch (chan 1)]
    (xhr/send url
              (fn [event]
                (let [res (-> event .-target .getResponseText)]
                  (go
                      (>! ch res)
                      (close! ch)))))
    ch))







(defn- xml-str
 "Like clojure.core/str but escapes < > and &."
 [x]
  (-> x str
      ;(clojure.string/replace #" " "  " )
      (clojure.string/replace #"&amp;" "&" )
      (clojure.string/replace #"&lt;" "<")
      (clojure.string/replace #"&gt;" ">" )))






(defn record-path= [namespace-name  path  value  tree-name  &  code]
  (let [
        code-str
        (str (apply str (map #(if (= "\n" %1) (str "\r\n")  %1) code)))
        ]

    (reset!
     webapp.framework.client.system-globals/debugger-ui
     (assoc-in
      (deref webapp.framework.client.system-globals/debugger-ui)
      [:watchers-code (str "==" tree-name " " path " " value) ]
      (xml-str (str
                "(ns  " namespace-name ")"
                (char 13) (char 13)


                "(==" tree-name " " path "  " value
                     (char 13) (char 13)
                     code-str
                     ""
                     ))))))




(defn delete-data-watcher [watcher-name]
  (reset!
   webapp.framework.client.system-globals/data-watchers
   (into []
         (filter
          #(not (=
                 (get %1 :name)
                 watcher-name))
          @webapp.framework.client.system-globals/data-watchers))))


(count @data-watchers)
(map :name @data-watchers)


;(reset! data-watchers [])
(comment reset! data-watchers (into [] (filter #(not (=
          (get %1 :name)
          "component-cv-browser [:ui :cvs :values] List of the users") )
        @data-watchers)))


;(filter #(= %1 2) [1 2 3])

(defn record-watcher [namespace-name path tree-name & code]
  (let [
        code-str
        (str (apply str (map #(if (= "\n" %1) (str "\r\n")  %1) code)))
        ]

    (reset!
     webapp.framework.client.system-globals/debugger-ui
     (assoc-in
      (deref webapp.framework.client.system-globals/debugger-ui)
      [:watchers-code (str "watch-" tree-name " " path) ]
      (xml-str (str
                "(ns  " namespace-name ")"
                (char 13) (char 13)


                "(watch-" tree-name " " path "  "
                     (char 13) (char 13)
                     code-str
                     ""
                     ))))))





(defn record-defn-ui-component [namespace-name fn-pointer fname args & code]
  (let [
        code-str
        (str (apply str (map #(if (= "\n" %1) (str "\r\n")  %1) code)))
        ]

    ;(.log js/console (str "NAMESPACE: "            namespace-name))
    ;(.log js/console (str "NAMESPACE fname: "      fname))
    ;(.log js/console (str "NAMESPACE orig code: "  code))
    ;(.log js/console (str "NAMESPACE code: "       code-str))

    (reset!
     webapp.framework.client.system-globals/debugger-ui
     (assoc-in
      (deref webapp.framework.client.system-globals/debugger-ui)
      [:react-components-code (str fname)]
      (xml-str (str
                "(ns  " namespace-name ")"
                (char 13) (char 13)


                "(defn-ui-component  "
                     fname "  "
                     args (char 13) (char 13)
                     code-str
                     ""
                     ))))


    (reset!
     webapp.framework.client.system-globals/debugger-ui
     (assoc-in
      (deref webapp.framework.client.system-globals/debugger-ui)
      [:react-components-fns (str fname)]
      fn-pointer))


    ))


(comment
  (record-defn-ui-component nil
   "a.b" "start" '[a b] '(def 1)))









(defn process-ui-component [fn-name]
  ;(js/alert @paths-for-refresh)
  (let [paths (get @paths-for-refresh (str fn-name))]
    (if paths
      (do
        (map
         (fn [path]
           (if (get-in @app-state path) (touch  path)))
         paths
         )
        ))))












(defn display-debug-code []
  (let [component-name  (last (get @debugger-ui :react-components))]
    (reset! debugger-ui
            (assoc-in @debugger-ui [:current-component]
                      component-name))))



;(get @debugger-ui :current-component)




(defn component-clicked [x]
  (if js/debug_live
    (do
      (reset! debugger-ui (assoc-in @debugger-ui [:mode]              "show-event"))
      (reset! debugger-ui (assoc-in @debugger-ui [:current-component] (last (get @debugger-ui :react-components))))

      (if (get @component-usage  (get @debugger-ui :current-component))
        (do
          (reset! debugger-ui (assoc-in @debugger-ui [:mode] "show-event"))

          (reset! debugger-ui (assoc-in @debugger-ui [:pos]
                                        (first
                                         (drop-while
                                          (fn[xx] (> xx
                                                     (get-in @debugger-ui [:pos])
                                                     ))
                                          (reverse (get @component-usage (get @debugger-ui :current-component))))
                                         ))))))))


;@component-usage
;(get-in @debugger-ui [:pos])
;(get @debugger-ui :current-component)
;(get @component-usage (get @debugger-ui :current-component))


(defn set-debug-component [component-name  component-path]
  (let [component-identifier   {:fn-name component-name :fn-path component-path}]
    (if (not-any? #(= %1 component-identifier) (get @debugger-ui :react-components))
      (reset! debugger-ui
              (assoc-in @debugger-ui [:react-components]
                        (conj (get @debugger-ui :react-components)
                              component-identifier
                              )))
      (reset! debugger-ui
              (assoc-in @debugger-ui [:mode]
                        "show-event"))
      )
    (display-debug-code)

    ))








(defn unset-debug-component [component-name   component-path]
  (let [component-identifier   {:fn-name component-name :fn-path component-path}]
    (reset! debugger-ui

            (assoc-in
             @debugger-ui
             [:react-components]
             (into []
                   (filter #(not= %1 component-identifier)
                           (get @debugger-ui :react-components))
                   ))
            )
    (display-debug-code)
    ))







(defn debug-react [str-nm owner data react-fn path parent-id]
  (let
    [
     react-fn-name    (str str-nm)
     ]
      (do

        (dom/div
       #js {
            :onMouseEnter #(if js/debug_live (om/set-state! owner :debug-highlight true))

            :onMouseLeave #(if js/debug_live (om/set-state! owner :debug-highlight false))

            :onClick component-clicked

            :style (if js/debug_live
                     #js {:backgroundColor

                          (if
                            (om/get-state owner :debug-highlight)
                            (do
                              (if (not= (:mode @debugger-ui) "component")
                                (set-debug-component  react-fn-name   (om/get-state owner :parent-path)))
                              "lightGray")
                            (do
                              (if (not= (:mode @debugger-ui) "component")
                                (unset-debug-component  react-fn-name  (om/get-state owner :parent-path)))
                              "")
                            )
                          })
            }
       (react-fn data)
       ""))))




(defn attrs [attributes]
  (if attributes
    (if (:style attributes)
      (clj->js (merge attributes {:style (clj->js (:style attributes))}))
      (clj->js attributes)
      )
    nil)
  )















(defn when-path-equals [watcher path value fn-def]
  (swap! watcher conj
         {
          :type     "path equals"
          :path     path
          :value    value
          :fn       fn-def
          }))





(defn when-value-changes [watcher watcher-path path fn-def]
  (swap! watcher conj
         {
          :name     watcher-path
          :type     "value change"
          :path     path
          :fn       fn-def
          }))







(defn amend-record [records field value amend-fn]
  (into [] (map
            (fn[x] (if (= (get x field) value) (amend-fn x) x))
            records )))







(defn when-property-equals-in-record  [watcher path field value fn-def]
 (swap! watcher conj
         {
          :type     "record property equals"
          :path     path
          :field    field
          :value    value
          :fn       fn-def
          }))







(defn when-ui-path-equals-fn
  [path value ui-fn]

  (when-path-equals
   ui-watchers
   path
   value
   ui-fn))






(defn when-ui-value-changes-fn
  [path ui-fn]

  (when-value-changes
   ui-watchers
   ""
   path
   ui-fn))






(defn when-ui-property-equals-in-record
  [path field value ui-fn]

  (when-property-equals-in-record
   ui-watchers
   path
   field
   value
   ui-fn))







(defn when-data-path-equals-fn
  [path value data-fn]

  (when-path-equals
   data-watchers
   path
   value
   data-fn))






(defn when-data-value-changes-fn
  [watcher-name  path  data-fn]

  (when-value-changes
   data-watchers
   watcher-name
   path
   data-fn))






(defn when-data-property-equals-in-record
  [path field value data-fn]

  (when-property-equals-in-record
   data-watchers
   path
   field
   value
   data-fn))





(defn component-fn [coils-fn  state  parent-path  rel-path]
  (let
    [full-path   (into [] (flatten (conj parent-path rel-path)))]

    ;(log (str "-------------------------------------------------"))
    ;(log (str "full path: " full-path))
    ;(log (str "parent path: " parent-path))
    ;(log (str "rel path: " rel-path))
    ;(log (pr-str "(get-in state rel-path): " (get-in state rel-path)))
    (om/build
     coils-fn
     (get-in state rel-path)
     {:init-state  {:parent-path  full-path}}
     )))









(defn add-refresh-path  [str-nm  path]
  (if (get @paths-for-refresh (str str-nm))

    (reset! paths-for-refresh
            (assoc @paths-for-refresh (str str-nm)
                      (conj (get @paths-for-refresh (str str-nm))
                            path)))

    (reset! paths-for-refresh
            (assoc @paths-for-refresh (str str-nm) #{path}))))









(defn record-component-call [caller-namespace-name
                             called-fn-name
                             state
                             full-path]

  (let [
        entry-name    (str caller-namespace-name ": " full-path)
        is-diff?      (not (= (pr-str state) (last (get @gui-calls  entry-name) )))
        debug-id      (add-debug-event   :event-type      "render"
                                         :component-name  called-fn-name
                                         :component-path  full-path
                                         :component-data  state)
        ]
    (do
      (add-refresh-path  called-fn-name  full-path)
      (reset! gui-calls (assoc @gui-calls entry-name


                          (if is-diff?
                            (conj
                             (if (get @gui-calls entry-name) (get @gui-calls  entry-name) [])   (pr-str state))
                            (get @gui-calls  entry-name))))
      ;(log (str "DEBUG ID: "debug-id))
      debug-id
      )))




;(keys @gui-calls)

;(get @gui-calls "splash-screen: []:[:ui :splash-screen]")

;@gui-calls

;clojure.zip/down


(defn write-ui-fn [tree path sub-path value parent-id]

  (let [
        full-path         (into [] (flatten (conj path sub-path)))
        old-val           @app-state
        data-access-key   {:tree "UI"
                           :path full-path}

        current-value     (get @data-accesses data-access-key)
        ]

    ;(log (str "(om/update! " full-path) " = " value )
    (om/update! tree sub-path value)
    ;(om/update!  @global-om-state  full-path  value)
    ;(assoc-in-atom  app-state  full-path  value)
    ;(touch  [:ui])

    (let [debug-id (add-debug-event
                     :event-type "UI"
                     :old old-val
                     :new @app-state
                     :parent-id parent-id
                     )]
      ;(log (str "    parent id: " parent-id))
      (reset! data-accesses (assoc @data-accesses
                              data-access-key
                              (if current-value
                                (conj current-value debug-id)
                                [debug-id])))

      (remove-debug-event debug-id)
      )))









(defn write-data-fn [tree  path  value  parent-id]
  (let [
        full-path          path
        old-val            @ data-state
        data-access-key    {:tree  "DATA"
                            :path  full-path}
        current-value      (get @data-accesses  data-access-key)
        ]
    (om/update!     tree     path  value)
    ;(assoc-in-atom  app-state     full-path  value)
    ;(om/update!  @global-om-state  full-path  value)
    ;(touch  full-path)
    (let [debug-id       (add-debug-event
                          :event-type  "DATA"
                          :old         old-val
                          :new         @app-state
                          :parent-id   parent-id
                          )]
      (reset!  data-accesses (assoc @data-accesses
                               data-access-key
                               (if current-value
                                 (conj current-value  debug-id)
                                 [debug-id])))

      (remove-debug-event debug-id)
      )))



(defn read-ui-fn [tree  path  sub-path  parent-id]
  (let [
        full-path          (into [] (flatten (conj path sub-path)))
        value              (get-in  tree  sub-path)
        data-access-key    {:tree  "UI"
                            :path  full-path}
        current-value      (get @ data-accesses  data-access-key)
        debug-id           (last @ call-stack)
        ]
    ;(log (str "*read-ui-fn: " full-path "    parent id: " debug-id))
    (reset!  data-accesses (assoc @data-accesses
                             data-access-key
                             (if current-value
                               (conj current-value  debug-id)
                               [debug-id])))

    ;(remove-debug-event  debug-id)
    value))




(defn get-in-tree
  "
  "
  [app path]
  (let
    [
     calls          @call-stack
     parent-id      (last calls)
     ]
  (read-ui-fn   app   []  path   parent-id)
  ))

@ data-accesses



(defn update-ui [app  path  value]
  (let
    [
     calls          @call-stack
     parent-id      (last calls)
     ]
  (write-ui-fn  app  [] path value parent-id)))


(defn add-many-fn [items]
  (apply
   om.dom/div nil items))




(defn order-by-id [x]
  (apply hash-map
         (flatten
          (map
           (fn [y] [(first (keys y)) (first (vals y))])
           (map
            (fn [z] {(:id z)
                     {:value  z}
                     })
            x)))))

(def mm  [{:id 1 :a 1} {:id 2 :a 2}])
(order-by-id mm)


(defn fields-to-sql-str [fields]
  (apply str (interpose ", " (map #(-> % name) fields))))

;(fields-to-sql-str [:a :e :w])














(defn admin-fn []
  (swap!  app-state  assoc     :admin (not (get @app-state :admin)))

  (if (nil? (get-in  app-state  [:system :ui :tab :value]))
	(swap!  app-state  assoc-in  [:system :ui :tab :value]  "data sources"))

  (swap!  app-state  assoc-in  [:system :ui :data-sources :values]  (:data-sources @data-state))
  (swap!  app-state  assoc-in  [:system :ui :views :values]  @data-views)
  )

















;zzz
;-----------------------------------------------------------
; this is the queue where query and record requests are sent
; when they are needed. They requests are not processed in
; real time, but due to reactivity in the UI then the UI
; is automatically updated when the data is ready
;-----------------------------------------------------------



;(-> @data-records-v2 vals first deref :values deref keys count)
;(-> @data-queries-v2 keys count)
;(-> @data-views-v2 vals first deref)
;(-> @app-state :ui :login :admins :values)








"-----------------------------------------------------------

(does-range-contain-values?  start  end  values)

-----------------------------------------------------------"
(defn does-range-contain-values? [start end values]

  (clojure.set/superset?
   (into #{} (keys values))
   (into #{} (range start (inc end)))))











"-----------------------------------------------------------
(update-view-for-query  view  query )




-----------------------------------------------------------"
(defn update-view-for-query [ view-key  query-key ]

  (let [   data-view-atom   (get @data-views-v2  view-key)    ]
    ;(log (pr-str "Full path   : " (:full-path view-key)))
    ;(log (pr-str "Active view : " (get @ui-paths-v2  (:full-path view-key))))
    ;(log (pr-str "View key    : " view-key))

    (cond

     ; if the query doesn't match then do nothing - kind of an error condition. I think that
     ; this should never happen
     (not (= (@data-view-atom :query) query-key))

     (do
       ;(log (pr-str "No view matched:" query-key))
       nil)





     ; if the query does match and is the current live view
     (and
         (= (@data-view-atom :query) query-key)
         (= (get @ui-paths-v2  (:full-path view-key))  view-key)
        )

     (let [
           ui-state         (get @data-view-atom  :ui-state)
           view-start       (:start @data-view-atom)
           view-end         (:end @data-view-atom)

           data-source      (:data-source view-key)
           full-path        (:full-path view-key)
           ui-full-path     (conj full-path  :values)

           value-path   (conj full-path :values)
           count-path   (conj full-path :count)
           end-path     (conj full-path :end)
           start-path   (conj full-path :start)
           order-path   (conj full-path :order)

           rel-path         (get view-key :relative-path)
           rel-value-path   (conj rel-path :values)
           rel-count-path   (conj rel-path :count)
           rel-end-path     (conj rel-path :end)
           rel-start-path   (conj rel-path :start)
           rel-order-path   (conj rel-path :order)
           rel-touch-path   (conj rel-path :touch)

           data-query-atom  (get @data-queries-v2 query-key)
           query-start      (:start @data-query-atom)
           query-end        (:end @data-query-atom)
           query-count      (if (:count @data-query-atom) (:count @data-query-atom) 0)
           end-marker       (min view-end query-count)

           ui-list-of-records     (into
                                   {}
                                   (filter (fn[e] (first e))

                                           (into
                                            {}
                                            (map
                                             (fn [record-position]

                                               (let [ record-id      (get  (get @data-query-atom :values) record-position)
                                                      table-atom     (get @data-records-v2  data-source)
                                                      record (if table-atom
                                                               (get @(get @table-atom :values) record-id))
                                                      ]
                                                 {record-id {:pos    record-position
                                                             :value  (if record  @(get @record :value)        {})}}))
                                             (range view-start (inc end-marker))))))


           ui-order-of-records  ;(into
                                 ;{}
                                 ;(map (fn[e] (first e))
                                      (into {}
                                          (map
                                           (fn [record-position]

                                             (let [ record-id      (get  (get @data-query-atom :values) record-position) ]
                                               {   record-position  record-id } ))
                                           (range view-start (inc end-marker)))
                                          )
                                          ;)))

           ]

(comment log (str "Returned " (-> ui-order-of-records keys count) " records from "
             (-> query-key :data-source)
             " where "
             (-> query-key :where) " ?? "
             (get query-key :params) ""

             ))

       ;(log (pr-str "REALCount:" end-marker))
;(log (pr-str "Matched:" (get query-key :params)))
       ;(log (pr-str "View count:" (count (keys @data-views-v2))))

       ;(log (pr-str "Records:" (first (map :value (-> ui-list-of-records vals)))))
       ;(log (pr-str "Records count:" (-> ui-list-of-records count)))
  ;(log (pr-str "Order count:" (-> ui-order-of-records keys count)))

       ;(log (pr-str "Records:" (sort (-> ui-list-of-records keys))))
       ;(log (pr-str "Order:  " ui-order-of-records))
       ;(log (pr-str "Order:  " (filter (fn[g] g) (vals ui-order-of-records))))
       ;(log (pr-str "Query count:" query-count))
       ;(log (pr-str "Total Records:" (-> @data-query-atom :count)))



;(if (> (-> ui-list-of-records count) 0)
  ( do
    (om/transact!  ui-state   rel-count-path   (fn[_] query-count))
    (om/transact!  ui-state   rel-start-path   (fn[_] query-start))
    (om/transact!  ui-state   rel-end-path     (fn[_] query-end))
    (om/transact!  ui-state   rel-order-path   (fn[_] ui-order-of-records))
    (om/transact!  ui-state   rel-value-path   (fn[_] ui-list-of-records))
    )
;)

       (comment do
         (assoc-in-atom  app-state   count-path   query-count)
         (assoc-in-atom  app-state   start-path   query-start)
         (assoc-in-atom  app-state   end-path     query-end)
         (assoc-in-atom  app-state   order-path   ui-order-of-records)
         (assoc-in-atom  app-state   value-path   ui-list-of-records)
       )

;    (swap! app-state  assoc-in  ui-full-path   ui-list-of-records)

     (comment om/update!  ui-state   rel-path
                  {:values     ui-list-of-records
                   :count      query-count
                   :end        end-marker
                   :start      query-start
                   :order      ui-order-of-records
                   })

    ;(js/setTimeout #(om/transact!  ui-state   rel-touch-path   inc) 500)
    ;(log (str "Touch ID: " (get-in @ui-state (conj rel-path :touch-id))))
    ))))
;(into {} (filter (fn[e] (first e)) {1 nil 2 nil nil 2}))
;(touch [:ui])











"-----------------------------------------------------------
(update-all-views-for-query  query  )




-----------------------------------------------------------"
(defn update-all-views-for-query [ query-key ]

  (let [
          data-query         @(get @data-queries-v2  query-key)
          list-of-views      @(get data-query  :list-of-view-keys)
          ]

          (doall
                (map
                    (fn[view-key]
                                 (update-view-for-query  view-key  query-key))
                    list-of-views ))))

























(log (str "Checking server for data updates ..."))
(js/setInterval
 #(go
   ;(log (pr-str (count (keys @data-queries-v2))))
   (let [x (remote  !check-for-server-updates  {:client-data-session-id  @data-session-id} )]
     (log "Client realtime: " x)
     (>! data-query-requests-v2  {
                                  :query-key     (dissoc (dissoc x :start) :end)

                                  :subset-range  {
                                                  :start   (:start  x)
                                                  :end     (:end    x)
                                                  } })

     )) 3000)






















"-----------------------------------------------------------
(add-data-query-watch-v2  query-key  )




-----------------------------------------------------------"
(defn  add-data-query-watch-v2 [ query-key ]

  (let [  data-query-atom       (get @data-queries-v2  query-key)
          list-of-views-atom    (get @data-query-atom  :list-of-view-keys)       ]


    ; this says that whenever the list of views changes then update all of the views. This
    ; is a bit much, as really only the added views need to be updated
    (add-watch list-of-views-atom
               (merge query-key {:type "views"})
               (fn [_ _ old-val new-val]
                 ;(js/alert (pr-str "new view: " new-val))
                 (update-all-views-for-query   query-key)
                 ))

    ; this says that whenever the query information changes then see if
    ; we need to get any more information from the database
    (add-watch data-query-atom
               query-key
               (fn [_ _ old-val new-val]

                 (let [new-query-atom  (get @data-queries-v2  query-key)]

                   (if (or
                        (not (= (:start old-val) (:start new-val)))
                        (not (= (:end   old-val) (:end   new-val)))
                        )
                     (do
                       ;(js/alert (pr-str "Query changed: " query-key))
                       ;(js/alert (pr-str "query :" @new-query-atom))

                       (if (get @new-query-atom :values)
                         (let [already-loaded?
                               (does-range-contain-values? (:start new-val)
                                                           (:end   new-val)
                                                           (get @new-query-atom :values))]
                           (if (not already-loaded?)
                             (go
                              ;(js/alert (str "Query loaded?" already-loaded?))
                              ;(js/alert (pr-str "query values:" (get @new-query-atom :values)))
                              (>! data-query-requests-v2  {
                                                           :query-key     query-key

                                                           :subset-range  {
                                                                           :start   (:start  new-val)
                                                                           :end     (:end    new-val)
                                                                           } })
                              ))))

                       (update-all-views-for-query   query-key)

                       ))

                       )))))

















"-----------------------------------------------------------
(update-or-add-table-data  query  )




-----------------------------------------------------------"
(defn update-or-add-table-data [ query ]

  (if (not (get  @data-records-v2  (query :data-source)))
    (swap!  data-records-v2  assoc (query :data-source)
            (atom {:values (atom {})}))))
;(-> @data-records-v2 :cvs deref :values deref keys)




















(defn get-or-create-record  [data-source
                             record-id]

  (let [table      (get  @data-records-v2   data-source)
        records    (get  @table             :values)
        record     (get  @records           record-id)  ]

    (if (not record)

      (let [ value-atom     (atom nil)
             queries-atom   (atom #{}) ]

        (swap! records assoc record-id (atom { :value    value-atom
                                               :queries  queries-atom }))

        (add-watch  value-atom
                    {:source data-source  :id     record-id}

                    (fn [_ _ old-val new-val]

                      (let [ queries
                             @(:queries  (get-or-create-record   data-source
                                                                 (:id new-val))) ]
                        (doall
                         (for [ query-key    queries ]
                           (let [query (get  @data-queries-v2  query-key)]
                             ;(js/alert (pr-str query))
                             (swap! query assoc :updated (.getTime (js/Date.)))
                             (update-all-views-for-query  query-key)
                             )))))))

      )

    @(get  @records  record-id)))
















(defn get-default-fields-for-data-source [data-source-id]

  (let [fields-atom          (-> @datasource-fields  data-source-id)
        fields-entry         (if fields-atom (into [] @fields-atom))   ]

    ;(log (pr-str "Read fields: " fields-entry))

    (if fields-entry
      fields-entry)))


;(get-default-fields-for-data-source  :cvs)

















"-----------------------------------------------------------

(load-record  query  '324342435')




-----------------------------------------------------------"
(defn load-record [ query
                    record-id ]

  (update-or-add-table-data  query)

  (let [record (get-or-create-record  (query :data-source)  record-id) ]

    (swap!  (get record :queries) conj  query)


    (let [record-value  (get record :value)]

      (if (not @record-value)
        (go
          (>! data-record-requests-v2
             {:source              (query :data-source)
              :db-table            (query :db-table)
              :fields              (get-default-fields-for-data-source (query :data-source))
              :id                   record-id
              :query                query
              :data-session-id     @data-session-id
              }))
        ))))

















"-----------------------------------------------------------
(add-data-query-result-v2 ...


When we get query data back from the database then load the
records into the system. This mostly consists of repeatedly
calling load-record
-----------------------------------------------------------"
(defn add-data-query-result-v2  [query-key
                                 params
                                 records-count
                                 records
                                 timestamp]

  (let [
         query-atom                 (get @data-queries-v2   query-key)
         list-of-record-positions   (range (:start params) (inc (:end params)))
       ]

    ; -----------------------------------------------
    ; update the record count in the query
    ; -----------------------------------------------
    (reset!  query-atom
             (assoc @query-atom :count records-count))





    ; -----------------------------------------------
    ; update the timestamp in the query
    ; -----------------------------------------------
    (reset!  query-atom
             (assoc @query-atom :timestamp timestamp))



    ; -----------------------------------------------
    ; update the record IDs in the query
    ; -----------------------------------------------
    (reset!  query-atom
             (assoc @query-atom :values
               (merge
                (apply merge (map
                              (fn[record-pos
                                  record-id]   {record-pos  record-id})

                              list-of-record-positions
                              records
                              ))
                (get @query-atom :values))))


    ; -----------------------------------------------
    ; load the records in
    ; -----------------------------------------------
    (let [
          list-of-ids         (map
                                  (fn[id] (get (@query-atom :values) id))
                                   list-of-record-positions)
          ]

      (doall
       (map
        (fn [ record-id ] (load-record  query-key  record-id))
        list-of-ids
        )
       (update-all-views-for-query    query-key)

        ))
    (log (str "CLIENT: @query-atom: " @query-atom))
    ))













"-----------------------------------------------------------

Get SQL queries requests from the database

This waits for query requests on the channel 'data-query-requests-v2'
and then asks the server for the results of the query. When the result
comes back then it goes through all the record IDs and tries to load the
records

-----------------------------------------------------------"
(go
 (loop []
   (let [request (<! data-query-requests-v2)]  ; <-- reads the request from the channel

     (let [
           params         (merge (merge (:query-key request) (:subset-range request)) {:data-session-id     @data-session-id})

           return-value   (remote      !get-query-results-v2  params)
           records        (:records    return-value)
           records-count  (:count      return-value)
           timestamp      (:timestamp  return-value)
           ]

       ;(log (pr-str (:query-key     request)))
       (add-data-query-result-v2   (:query-key     request)
                                   (:subset-range  request)
                                   records-count
                                   records
                                   timestamp)))
   (recur)))




















"-----------------------------------------------------------
Go loop to read records from the database



Reads records from the database. This waits for requests on
the channel 'data-record-requests-v2' and then depending on
whether it is a record or a query gets the corresponding
data and updates the internal cache
-----------------------------------------------------------"
(go
 (loop []
   (let [request  (<! data-record-requests-v2)]  ; <-- reads the record request from the channel
     ;(log (pr-str "Loading record " (get request :id)))
     (let [
           record             (remote  !get-record-result-v2  request)
           record-value       (get record :value)

           source-name        (:source  request)
           id                 (:id record-value)
           ]

       (if record-value
         (let [
               record-container     (get-or-create-record  source-name  id)
               queries              (get record-container :queries)
               record-value-atom    (get record-container :value)
               ]


           ;(log (pr-str "existing record value:" record-value-atom))

           (if (nil? @record-value-atom)
             (do
               ; tell the record that it belongs to a query
               ;(swap!  queries conj (request :query))

               (reset! record-value-atom   record-value)
               ;(log (pr-str record-value))

               ))
           ;(swap!  queries conj (request :query))

           (if (get request :force)
             (do
               (reset! record-value-atom   record-value)
               ))



           ))))
   (recur)))






















"-------------------------------------------------
(add-data-view-watch ...



This is used to watch a view. Whenever a view
changes then as long as the start and end positions
of the view and the related query are different then
try to read in the new records into the query (by
adjusting the start and end of the query)
-------------------------------------------------"
(defn  add-data-view-watch [ data-view-key-v2 ]

  (let [  data-view-atom   (get @data-views-v2  data-view-key-v2)  ]

    (add-watch data-view-atom
               data-view-key-v2
               (fn [_ _ old-val new-val]
                 (if
                   (or
                    (not (= (:start old-val) (:start new-val)))
                    (not (= (:end   old-val) (:end   new-val)))
                    )
                   (do
                     (let [query-atom  (get @data-queries-v2  (:query @data-view-atom))]
                       (reset!  query-atom
                         (merge @query-atom
                                {  :start  (:start new-val)
                                   :end    (:end   new-val)     })))
                     ))))))























"-------------------------------------------------
(get-or-create-data-query-v2 ...



This is used to get a query. That query can be
reused by many views.
-------------------------------------------------"
(defn get-or-create-data-query-v2    [  data-query-key-v2  ]

  ; create the query if it does not exist
  (let [ query-entry    (get  @data-queries-v2  data-query-key-v2)]
    (if  (not query-entry)
      (do
        (reset!  data-queries-v2
                 (assoc-in @data-queries-v2 [data-query-key-v2]
                           (atom {
                                  :values {}
                                  :list-of-view-keys  (atom #{})
                                  })))
        (add-data-query-watch-v2   data-query-key-v2 ))))

  ; return the query
  (get  @data-queries-v2  data-query-key-v2))










(defn create-data-query-key [data-view-key-v2]
  { :data-source         (:data-source data-view-key-v2)
    :table               (:table       data-view-key-v2)
    :where               (:where       data-view-key-v2)
    :db-table            (:db-table    data-view-key-v2)
    :params              (:params      data-view-key-v2)
    :order               (:order       data-view-key-v2)
    :realtime            (:realtime    data-view-key-v2)
    })
















"-------------------------------------------------

(update-or-create-data-view-v2 ...



This creates the data view. It is passed a start
and an end which means the start and end records to
read
-------------------------------------------------"
(defn update-or-create-data-view-v2 [ data-view-key-v2
                                      start
                                      end
                                      ui-state           ]

  (let [
        data-query-key-v2      (create-data-query-key  data-view-key-v2)
        data-query-params-v2   {:start start    :end end}
        full-path              (get data-view-key-v2 :full-path)
        value-path             (conj full-path :values)
        ]
    ;(log (str "update-or-create-data-view-v2: " full-path))
    ;(log (pr-str "::::::::::::::::::::::::::::::::::::::::::::::::" data-query-key-v2))


    ;(log "Full path: " full-path)
    ;(log "Before full path: " (if (get-in @app-state full-path) "Exists" "notexist"))
      ;-----------------------------------------------------
      ;
      ; if the data view doesn't exist then create it
      ; together with the query and other stuff needed
      ;
      ;-----------------------------------------------------
      (if (not (get  @data-views-v2  data-view-key-v2))
        (do
          ;
          ; create the data view
          ;
          (let [  data-view-atom  (atom {  :values {}  }) ]

            (swap!  data-views-v2   assoc
                    data-view-key-v2
                    data-view-atom)

            (add-data-view-watch    data-view-key-v2))



          ;
          ; create the data query if it doesn't exist
          ;
          (get-or-create-data-query-v2    data-query-key-v2)



          ;
          ; link the data query to the data view and latest state
          ;
          (let [ view-atom   (get  @data-views-v2  data-view-key-v2) ]

            (swap!  view-atom   assoc  :query     data-query-key-v2)
            (swap!  view-atom   assoc  :ui-state  ui-state))



          ;
          ; link the view to the data query
          ;
          (let [
                query-atom  (get  @data-queries-v2    data-query-key-v2)
                views-atom  (get  @query-atom        :list-of-view-keys)
                ]
            (swap!  views-atom   conj  data-view-key-v2)
            )


          (update-view-for-query   data-view-key-v2  (create-data-query-key   data-view-key-v2))



          )
        )



      ;-----------------------------------------------------
      ;
      ; then update the start and end record positions
      ;
      ;-----------------------------------------------------
      (let [ view-atom  (get @data-views-v2  data-view-key-v2) ]

        (swap!  view-atom   merge  {:start  start
                                    :end    end}))



    (if (not (= (get @ui-paths-v2  full-path) data-view-key-v2))
      (do
        (swap! ui-paths-v2 assoc full-path  data-view-key-v2)
        (update-view-for-query   data-view-key-v2  (create-data-query-key   data-view-key-v2))
        ))

    ;(log "After full path: " (if (get-in @app-state full-path) "Exists" "notexist"))


    (if (not (get-in @app-state value-path))
      (update-view-for-query   data-view-key-v2  (create-data-query-key   data-view-key-v2))
      )



      ))





(defn update-data-source-fields  [data-source  fields]
  (let [ds-fields          (get  @datasource-fields   data-source)
        fields-atom        (atom fields)                            ]

    (if (nil? ds-fields)
      (swap! datasource-fields  assoc  data-source  fields-atom)
      (let [
            fields-as-set (into #{} fields)
            existing-fields-as-set (into #{} @ds-fields)
            all-fields  (clojure.set/union   fields-as-set   existing-fields-as-set)
            all-fields-as-vector (into [] all-fields)
            ]
        (if (not (= all-fields existing-fields-as-set))
          (do
            (swap! datasource-fields  assoc  data-source  (atom all-fields))
            )
        )
      )

    ;(log (pr-str "Updated fields for " data-source ": " fields-atom))
    )))















"-----------------------------------------------------------
(data-view-v2  'List of the admin users'
               {
                :data-source   :users
                :relative-path [:admins]
                :path          []
                :fields        [:id  :user_profile]
                :ui-state      ui
                :where         'UPPER(user_profile) like '%JAVA%''
                }

               {:start 10 :end 10}

               (div {:style {:display        'inline-block'}}
                    (inline '400px' (text (<-- :user_profile) ))))


This is used from a GUI component to read from a
data source. Each record is returned in turn and accessed
with the (<-- :field) method
-----------------------------------------------------------"
(defn data-view-fn-v2 [
                         {
                          data-source          :data-source
                          relative-path        :relative-path
                          interval-in-millis   :interval-in-millis
                          fields               :fields
                          db-table             :db-table
                          where                :where
                          params               :params
                          order                :order
                          realtime             :realtime
                          }


                         {
                          start                :start
                          end                  :end
                          }

                         ui-component-name

                         component-path

                         ui-state

                       ]




  (let [
        full-path             (into [] (flatten (conj
                                                 component-path
                                                 relative-path
                                                 [])))

        data-view-key-v2      {
                               :ui-component-name   ui-component-name
                               :relative-path       relative-path
                               :component-path      component-path
                               :data-source         data-source
                               :fields              fields
                               :where               where
                               :path                relative-path
                               :full-path           full-path
                               :db-table            db-table
                               :params              params
                               :order               order
                               :realtime            realtime
                               }
        ]
    ;(log (str "data-view-fn-v2: " relative-path))

    (update-data-source-fields   data-source  fields)


    ;(if (get  @data-views-v2  data-view-key-v2)
    ;  (update-view-for-query   data-view-key-v2  (create-data-query-key   data-view-key-v2)))

    (go
     (>! data-view-requests-v2
         {
          :key    data-view-key-v2
          :start  start
          :end    end
          :ui     ui-state}))



    ; return the records from the UI state tree
    ;(log (pr-str "RET:" (get-in @ui-state    relative-path)))
    (get-in @ui-state    relative-path)))













"-----------------------------------------------------------
Get SQL queries requests from the database


this waits for requests on the channel
'data-query-requests-v2' and then gets the corresponding
data and updates the internal cache
-----------------------------------------------------------"
(go
 (loop []
   (let [request (<! data-view-requests-v2)]  ; <-- reads the request from the channel


      (update-or-create-data-view-v2
       (:key    request)
       (:start  request)
       (:end    request)
       (:ui     request))

      ;(log "called req")
      )
   (recur)))













"-------------------------------------------------
(<-- :profession)



This is used from a GUI data component to read
a value from the current record

It is actually called from the <-- macro
-------------------------------------------------"
(defn <---fn [record  field  path  relative-path]

  ;(log (pr-str (-> record :value field))))
  (-> record :value field))












"-------------------------------------------------
(<--pos)



This is used from a GUI data component to read
the record position. This starts from 1. It is most
useful when showing a list of records which are
numbered such as:

1) eggs
2) beans
3) soup

It is actually called from the <--pos macro
-------------------------------------------------"
(defn <---pos [record  path  relative-path]

    (-> record :pos))
















"-------------------------------------------------
(<--id)



Actually <---id and this is used from a GUI data
component to read the record ID, as stored in the
database.

It is actually called from the <--id macro
-------------------------------------------------"
(defn <---id [record-id  record  path  relative-path]

    record-id)


(defn session-user-id-fn []
  (((get @data-state :session) :user ) :id)
  )
