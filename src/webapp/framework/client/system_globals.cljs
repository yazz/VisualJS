(ns webapp.framework.client.system-globals
  (:require
   [clojure.data     :as data]
   [clojure.string   :as string]
   [cljs.core.async  :as async :refer [chan close!]]
   )
)











  "
 This is a reference to the first component of a Coils
 app that must be loaded


 It is actually specified in:

  src/webapp/framework/client/main/main.cljs

 :in the functions:

  load_main
  load_debug

 :These are called from the first webpage that is loaded
  in coils. See the file:

  resources/public/main.html

  : and you will find:

   webapp.framework.client.main.load_main(
                                    webapp.framework.client.init.setup);

  Looking at:

  webapp.framework.client.init/setup

  :you will see:


(defonce   ^:export setup
  {
   :start-component
   main-view

   :setup-fn
   (fn[]
     (do
      ...

  "

(defonce start-component
  (atom nil))










"
The UI tree
"
(defonce app-state
  (atom
    {}))

















  "
  This holds all the fns to call at the start of the
  webapp
  "
(defonce init-state-fns
  (atom []))










  "
  This checks to see if a subtree of a tree is
  different
  "
(defn subtree-different?
  [orig-val new-val path]
  (let [
        orig-subset    (get-in orig-val  path)
        new-subset     (get-in new-val   path)
        ]
      (not (identical?  orig-subset  new-subset))))








  "
  The initial starting state for the UI tree
  "
(defonce  blank-app-state
  {
   :data
   {
    :width "50"
    }
   :pointer
   {
    :mouse-x 0
    :mouse-y 0
    }
   :view
   {
    :width   0
    :height  0
    }
   }
  )














(defn reset-app-state  [session-id]

  (do
    (reset!  app-state  blank-app-state)
    (swap!  app-state  assoc :session-id  session-id)))










  "
  An Initialise function called when the web app first starts up
  "
(defonce  init-fn
  (atom nil))












  "
  "
(defn add-init-state-fn
  [nm init-state-fn]
  (do
    ;(.log js/console (str "Init function added: " nm))
    (swap!  init-state-fns conj init-state-fn)))















  "
  "
(defonce  touch-id
  (atom 0))







  "
  "
(defn touch
  [path]
    (reset! app-state (assoc-in @app-state
                                (conj path
                                  :touch-id)
                                  (swap! touch-id inc)
                                  )))
























(defn contains-touch-id?
  "
  Does the current structure contain a touch ID?
  "
  [x]
  (cond
   (vector? x)
   (some #(if (contains-touch-id? %1) true) x)

  (map? x)
  (if (get x :touch-id)
    true
    (some #(contains-touch-id? %1) (vals x))
    )))


;(contains-touch-id? [{:a {:touch-id 1}}])














(defonce  paths-for-refresh (atom {}))

(defonce  data-views (atom  {}))





(defn assoc-in-atom [the-atom  pos   value]
  (reset!   the-atom   (assoc-in  @the-atom    pos   value)))








; -----------------------------------------------------
; This is used to send requests to the data windows
; -----------------------------------------------------
(defonce  client-data-window-requests   (chan))

;                         |
;                         |
;                         |
;                         |
;                         |
;                         |
;                      *  |  *
;                       * | *
;                        *|*
;                         *

; -----------------------------------------------------
; list of the views and their associated queries
; -----------------------------------------------------
(defonce  client-data-windows  (atom {}))
; -----------------------------------------------------
; client-data-windows
;        |
;        |
;        |--------------{
;        |                 :ui-component-name   ui-component-name
;        |                 :relative-path       relative-path
;        |                 :component-path      component-path
;        |                 :data-source         data-source
;        |                 :fields              fields
;        |                 :where               where
;        |                 :path                relative-path
;        |                 :full-path           full-path
;        |                 :db-table            db-table
;        |                 :params              params
;        |                 :order               order
;        |                 :realtime            realtime                }
;        |                                 |
;        |                                 |
;        |                                 |-------:values
;        |                                 |          {}
;        |                                 |
;        |                                 |-------:start
;        |                                 |          2
;        |                                 |
;        |                                 |-------:end
;        |                                 |          20
;        |                                 |
;        |                                 |-------:ui-state
;        |                                 |          STATE FROM OM
;        |                                 |
;        |                                 |-------:query
;        |                                 |          |
;        |                                 |          { :data-source         (:data-source data-window-key)
;        |                                 |            :table               (:table       data-window-key)
;        |                                 |            :where               (:where       data-window-key)
;        |                                 |            :db-table            (:db-table    data-window-key)
;        |                                 |            :params              (:params      data-window-key)
;        |                                 |            :order               (:order       data-window-key)
;        |                                 |            :realtime            (:realtime    data-window-key)   }













; -----------------------------------------------------
; This is used to get data into a cache
; -----------------------------------------------------
(defonce  client-query-cache-requests  (chan))

;                         |
;                         |
;                         |
;                         |
;                         |
;                         |
;                      *  |  *
;                       * | *
;                        *|*
;                         *

; -----------------------------------------------------
; list of the query cached record IDs
; -----------------------------------------------------
(defonce  client-query-cache              (atom {}))
; -----------------------------------------------------
; client-query-cache
;        |
;        |
;        |--------------{ :data-source         (:data-source data-window-key)
;        |                :table               (:table       data-window-key)
;        |                :where               (:where       data-window-key)
;        |                :db-table            (:db-table    data-window-key)
;        |                :params              (:params      data-window-key)
;        |                :order               (:order       data-window-key)
;        |                :realtime            (:realtime    data-window-key)   }
;        |                                 |
;        |                                 |
;        |                                 |-------:list-of-data-window-keys










; -----------------------------------------------------
; used to get data into the record cache
; -----------------------------------------------------
(defonce  client-record-cache-requests (chan))

;                         |
;                         |
;                         |
;                         |
;                         |
;                         |
;                      *  |  *
;                       * | *
;                        *|*
;                         *

; -----------------------------------------------------
; client-record-cache
;        |
;        |
;        |--------------"TODO_ITEMS"
;        |                   |
;        |                   |
;        |                   |-------:values
;        |                   |          |
;        |                   |          |------- 1
;        |                   |          |        |
;        |                   |          |        |---:value
;        |                   |          |        |
;        |                   |          |        |---:queries #{LIST OF QUERIES}
;        |                   |          |
;        |                   |          |
;        |                   |          |------- 2
;        |                   |          |        |
;        |                   |          |        |---:value
;        |                   |          |        |
;        |                   |          |        |---:queries #{LIST OF QUERIES}
;        |                   |          |
;        |                   |          |------- 3
;        |                   |          |        |
;        |                   |          |        |---:value
;        |                   |          |        |
;        |                   |          |        |---:queries #{LIST OF QUERIES}
;        |
;        |
;        |--------------"USERS"
;        |                   |
;        |                   |
;        |                   |
;        |                   |-------:values
;        |                   |          |
;        |                   |          |------- 1
;        |                   |          |
;        |                   |          |------- 2
;        |                   |          |
;        |                   |          |------- 3
;        |                   |          |
;        |
; -----------------------------------------------------
(defonce  client-record-cache              (atom {}))










(defonce  ui-paths-mapped-to-data-windows                  (atom {})) ; list of the UI paths and their associated views

; -----------------------------------------------------
;
; -----------------------------------------------------
(defonce  client-datasource-fields            (atom {})) ; list of the data sources and their fields





(def client-session-atom (atom {}))




(def realtime-started (atom false))


(def cookie-name (atom nil))







(defonce  can-use-interfaces            (atom {}))


(defonce  app-input-parameters          (atom nil))







(defonce client-sessions (atom {}))






(defn resetclientstate []
  (do
    (reset!  app-state                 {})
    (reset!  app-state                 blank-app-state)
    (reset!  paths-for-refresh         {})
    (reset!  data-views                {})
    (reset!  client-data-windows       {})
    (reset!  client-query-cache        {})
    (reset!  client-record-cache       {})
    (reset!  client-datasource-fields  {})
    (reset!  can-use-interfaces        {})
    ))





(def debug-mode (atom false))
