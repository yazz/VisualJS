(ns webapp.framework.client.system-globals
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [cljs.core.async  :as async :refer [chan close!]]
   )
)
















  "
 This determines whether the mouse pointer events are
 recorded for the local Coils debugger. For an example
 of mouse pointer events looks at the playback of a Coils
 app where you can see where the website user moved the
 mouse. In the React/Om UI tree this is stored in:

  {
     :pointer
     {
         :mouse-x 0
         :mouse-y 0
     }
  }


 To enable or disable this you must be specify
 it as a global setting in system_globals.clj as

 (defonce ^:dynamic *record-pointer-locally* false)
  "
(defonce record-pointer-locally

  (atom true))






  "
 This determines whether the mouse pointer events are
 recorded for the local Coils debugger. For an example
 of mouse pointer events looks at the playback of a Coils
 app where you can see where the website user moved the
 mouse. In the React/Om UI tree this is stored in:

  {
     :pointer
     {
         :mouse-x 0
         :mouse-y 0
     }
  }


 To enable or disable this you must be specify
 it as a global setting in system_globals.clj as

 (defonce ^:dynamic *record-pointer-locally* false)
  "
(defonce record-ui
  (atom nil))







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
  If set to true then this means that the user interface is being replayed based on
  the server side recording
  "
(defonce playbackmode
  (atom false))





  "
  This is supposed to be a vector which lists the debug IDs of what has
  been called, eg:

  [1 45 99 103]
  "
(defonce call-stack
  (atom
   []))







  "
  This shows where the UI and DATA trees change. The list contains
  the debug IDs of where an action reads or writes this part of
  the tree

  {
      {:tree UI, :path [:ui :companies :values]}
          [7 14 18 nil nil nil nil]

      {:tree UI, :path [:ui :latest-endorsements :values]}
          [30]

      {:tree UI, :path [:ui :splash-screen :click]}
          [37]

      {:tree UI, :path [:ui :splash-screen :show]}
          [36]

      {:tree UI, :path [:values]}
          [nil nil nil nil nil nil nil]
  }

  Some of these seem erroneous, like:

  - nil values should never be there
  - {:tree UI, :path [:values]} does not even exist

  "
(defonce data-accesses
  (atom
   {}))


;@ data-accesses





"
The data tree
"
(defonce data-state
  (atom
    {}))




"
The UI tree
"
(defonce app-state
  (atom
    {}))







"
Whenever the application UI changes then we record the event,
unless the app-watch-on? is set to false
"
(defonce app-watch-on?
  (atom true))









"
This is a list of all the code that waits for things to happen
on the UI tree
"
(defonce ui-watchers
  (atom []))










"
This is a list of all the code that waits for things to happen
on the DATA tree
"
(defonce data-watchers
  (atom []))









"
The list of all the AB tests
"
(defonce ab-tests
  (atom {}))











  "
  The list of all the AB goals
  "
(defonce ab-goals
  (atom {}))











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














  "
  Resets the UI to be blank
  "
(defn reset-app-state
  []
  (reset!  app-state  blank-app-state))










  "
  An Initialise function called when the web app first starts up
  "
(defonce  init-fn
  (atom nil))









  "
  This holds the UI state of the web applications when
  it is being played back. I'm not sure why we didn't just
  use the normal app state for this?
  "
(defonce  playback-app-state
  (atom
   {}
   ))











  "
  The react/Om UI state for the debugger
  "
(defonce  playback-controls-state
  (atom
   {:ui
    {
     :current-session   nil
     :current-page      0
     :delete-password {:label "Delete password"
                       :placeholder ""
                       :value ""}

     }
    :data {
           :sessions          []
           }
    }

   ))












"
  Reset the app state for playback using the initial blank state
  "
(defn reset-playback-app-state
  []
  (reset!  playback-app-state  blank-app-state))











  "
  Updates the data tree
  "
(defn  update-data
  [path value]
   (reset! data-state (assoc-in @data-state path value)))












  "
  "
(defn add-init-state-fn
  [nm init-state-fn]
  (do
    ;(.log js/console (str "Init function added: " nm))
    (swap!  init-state-fns conj init-state-fn)))















  "
  "
(defn  set-ab-tests
  [tree]
  (do
    (reset! ab-tests tree)
))




(defonce  data-session-id (atom nil))



  "
  "
(defn  set-ab-goals
  [tree]
   (reset! ab-goals tree))










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






  "
  "
(defn touch-data
  [path]
  (reset! data-state (assoc-in @data-state
                               (conj path
                                     :touch-id)
                               (swap! touch-id inc)
                               )))








  "
  "
(defonce  debug-event-timeline
  (atom {}))
;(map #(str %1) @debug-event-timeline)
;(keys (get @debug-event-timeline 49))










"
"
(defonce  component-usage
  (atom
                      {}
                      ))







  "
  "
(defonce  debugger-ui
  (atom {
         :mode                     "show-event"
         :react-components         []
         :react-components-code    {}
         :watchers-code            {}
         :pos                      1
         :total-events-count       0
         :events-filter-path       nil
         }))









  "
  "
(defonce  debug-count
  (atom 0))







"
"
(defn add-debug-event
  [& {:keys [
                                 event-type
                                 old
                                 new
                                 error
                                 event-name
                                 component-name
                                 component-data
                                 component-path
                                 action-name
                                 input
                                 result
                                 parent-id
                                 ] :or {
                                        event-type     "UI"
                                        error          "Error in field"
                                        }}]

  (if

    (and
     (or
      @record-pointer-locally
      (not (and (= event-type "UI") (get (first (data/diff old new)) :pointer)))
      )
     (not (= (get action-name 0) "!"))
     @app-watch-on?
     )


    (do

      (let [debug-id (swap! debug-count inc)]
        (cond



         (or (first (data/diff old new)) (second (data/diff old new)))

         (swap! debug-event-timeline assoc
                debug-id  {
                           :id          debug-id
                           :event-type  event-type
                           :old-value   old
                           :value       new
                           :parent-id   parent-id
                           })




         (and (= event-type     "event"))

         (do
           (swap! debug-event-timeline assoc
                  debug-id  {
                             :id          debug-id
                             :event-type  event-type
                             :event-name  event-name
                             }))

         (and (= event-type     "render"))

         (let [component-id {:fn-name component-name :fn-path component-path}]
           (swap! debug-event-timeline assoc
                  debug-id  {
                             :id              debug-id
                             :event-type      event-type
                             :component-name  component-name
                             :component-path  component-path
                             :component-data  component-data
                             })

           (if (get @component-usage  component-id)
             (reset! component-usage (assoc @component-usage component-id
                                       (conj (get @component-usage component-id) debug-id)))
             (reset! component-usage (assoc @component-usage component-id [debug-id]))
             )
           )



         (and (= event-type     "remote"))
         (do
           (swap! debug-event-timeline assoc
                  debug-id  {
                             :id              debug-id
                             :event-type      event-type
                             :action-name     action-name
                             :input           input
                             :result          result
                             }))


         )


        (reset! debugger-ui
                (assoc @debugger-ui
                  :total-events-count (count @debug-event-timeline)))

        (if (> (+ (:pos @debugger-ui) 5) (:total-events-count @debugger-ui))
          (reset! debugger-ui
                  (assoc @debugger-ui
                    :pos (:total-events-count @debugger-ui))))

        (swap! call-stack conj debug-id)
        debug-id
        )

      )))
















;-----------------------------------------------------
; This is when the user moves the timeline slider
; left and right. If the slider is currently being moves
; (ie: not at the right of the slider - meaning the
; latest position) then turn off the events capture
; from the application
;
; We do this because otherwise the application keeps
; receiving events otherwise
;-----------------------------------------------------
(defonce  data-and-ui-events-on? (atom true))
(add-watch debugger-ui
           :change-debugger-ui

           (fn [_ _ old-val new-val]

             (cond
               (or
                (= js/debug_live false)
                (= (new-val :pos) (new-val :total-events-count))
                )
               (reset! data-and-ui-events-on? true)

              :else
               (reset! data-and-ui-events-on? false)
             )
             ;(. js/console log (pr-str new-val))
))







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













(comment add-debug-event
                :event-type  "event"
                :event-name  "watch-ui [:ui :request :to-email :value]"
                )

;(map :event-type (vals @debug-event-timeline))


; (:events-filter-path @debugger-ui)





"
A UI state history of all the GUI components

{
'main-view: []'
....

'splash-screen: [:ui :splash-screen]'
[
{:show true}
{:show false, :click false}
{:show true}
]

'letter-a: [:ui :splash-screen]'
....

'letter-a: [:ui]'
....

'browser-menu: []'
....

'text-graph: [:ui :companies]'
[
nil
{:values [{company apple.com inbound 3}
{company were.com inbound 1}
]}
]
'browser-menu:'
....

'text-graph:'
....
}

This can be removed as it is not used by the system
anywhere
"
(defonce  gui-calls
  (atom {}))

 ;(get @gui-calls "text-graph: [:ui :companies]")



(defonce  paths-for-refresh (atom {}))

(defonce  data-views (atom  {}))


(comment reset! webapp.framework.client.coreclient/data-views-proxy
               (into {}
                     (filter #(if (not (=   "list-questions"
                                            (get (first %1) :ui-component-name)))
                                true)
                             (deref webapp.framework.client.coreclient/data-views-proxy))))








(defn assoc-in-atom [the-atom  pos   value]
  (reset!   the-atom   (assoc-in  @the-atom    pos   value)))






(defonce  global-om-state (atom nil))







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
