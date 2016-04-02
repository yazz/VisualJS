(ns webapp.framework.client.components.debugger-main
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha]
   [cljs.reader      :as reader]
   )

  (:use
   [webapp.framework.client.coreclient     :only  [remote-fn component-fn]]
   [webapp.framework.client.system-globals :only  [debugger-ui
                                                   debug-event-timeline
                                                   app-state
                                                   app-watch-on?]]
   )
  (:use-macros
   [webapp.framework.client.coreclient    :only  [component remote log]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))






;-----------------------------------------------------
; This changes the position of the debugger in the
; debugger timeline
;
; While the app is being debugged
;-----------------------------------------------------
(defn update-app-pos [debugger-state  value]
  (let
    [
     current-event       (get @debug-event-timeline value)
     debug-ids           (reverse (range 1 (+ 1 (:pos @debugger-state))))
     ]

    ;update the debugger state
    ;-------------------------
    (om/update! debugger-state [:pos] value)


    ;stop recording events in the application (in case they are recording)
    ;---------------------------------------------------------------------
    (reset! app-watch-on? false)
    (if (= (:event-type current-event) "UI")
      (reset! app-state (:value current-event))
      (do
        ;(.log js/console (str "debug count: " debug-ids))
        (let [
              new-pos   (first (drop-while (fn[event-id] (not= (get (get @debug-event-timeline event-id) :event-type) "UI"))  debug-ids))
              ;new-pos   (get (get @debug-event-timeline (first debug-ids)) :event-type)
              ]
          ;(.log js/console (pr-str "UI pos" new-pos))
          (if (pos? new-pos)
             (reset! app-state (:value (get @debug-event-timeline new-pos)))
            ))))
    ;(reset! app-watch-on? true)


    ; not sure if this is needed anymore as the debugger mode is always the same
    ;---------------------------------------------------------------------------
    (om/update! debugger-state
            [:mode] "show-event")))







;-----------------------------------------------------
; The slider used to move the debug timeline
;-----------------------------------------------------
(defn main-debug-slider-comp [app owner]
  (reify
    om/IRender
    ;---------
    (render
     [_]
     (dom/div #js {
                   :onMouseEnter #(om/update! app [:mode] "show-event")
                   }
              (dom/div nil
                       (dom/button #js {
                                        :style #js {:display "inline-block"
                                                    :marginRight "5px"}
                                        :onClick
                                        (fn[x]
                                          (if (pos? (get-in @app [:pos]))
                                            (do
                                              (update-app-pos  app  (dec (get-in @app [:pos])))
                                              (om/update! app [:events-filter-path] nil))

                                            ))

                                        } "<")
                       (dom/button #js {
                                        :style #js {:display "inline-block"
                                                    :marginRight "5px"}
                                        :onClick
                                        (fn[x]
                                          (if (pos? (get-in @app [:pos]))
                                            (do
                                              (update-app-pos  app  (inc (get-in @app [:pos])))
                                              (om/update! app [:events-filter-path] nil))))

                                        } ">")
                       (dom/input
                        #js {
                             :style #js {:display "inline-block" :width "80%"
                                         }

                             :value (str (-> app :pos))
                             :type "range"
                             :min  "1"
                             :max  (str (-> @debugger-ui :total-events-count ))
                             :onChange
                             (fn[e]
                               (let [value (js/parseInt (.. e -target -value))]
                                 (update-app-pos   app value)
                                 (om/update! app [:events-filter-path] nil)
                                 ))
                             })

                       )

              (dom/div nil
                       (str (-> app :pos) " of "
                            (-> app :total-events-count ))

                       )

              (dom/pre #js {
                            :style #js { :fontSize "14px"}
                            :onMouseEnter #(reset! debugger-ui (assoc-in @debugger-ui [:mode] "show-event"))
                            }
                       (if (pos? (count (get @debugger-ui :react-components)))
                         (apply str  (into [] (map (fn[li] (str (get li :fn-name) "   "))
                                                   (get @debugger-ui :react-components))))
                         "Mouse over and click components to show code"
                         )))

     )))

















;-----------------------------------------------------
; The GUI tree used to show a clojure data structure
;-----------------------------------------------------
(defn show-tree [a-tree  is-map?  current-path   tree  debugger]
  (dom/div nil
         ""
            ))






;-----------------------------------------------------
; Used to show the details section of the debugger
;-----------------------------------------------------
(defn show-event-component [ debug-ui-state  owner ]
  (reify
    om/IRender
    ;---------
    (render
     [_]
     (apply dom/div nil
            (for [event-item (into []
                              (map (fn[xx] (get @ debug-event-timeline xx))
                                   (reverse
                                    (into [] (range (- (-> debug-ui-state :pos) 0) (+ 1 (-> debug-ui-state :pos))))
                                   )))
                              ]
              (if event-item
                (let
                  [
                   debug-id         (get event-item :id)
                   event-type       (get event-item :event-type)
                   old-value        (get event-item :old-value)
                   new-value        (get event-item :value)
                   event-name       (get event-item :event-name)
                   action-name      (get event-item :action-name)
                   action-input     (get event-item :input)
                   action-result    (get event-item :result)
                   component-name   (get event-item :component-name)
                   component-path   (get event-item :component-path)
                   component-data   (get event-item :component-data)
                   deleted          (first (data/diff old-value new-value))
                   added            (second (data/diff old-value new-value))
                   ]
                   (dom/div nil
                           (dom/h1
                            #js {:style #js {
                                             :color (cond
                                                     (= event-type "render")  "black"
                                                     (= event-type "UI")      "black"
                                                     (= event-type "event")   "blue"
                                                     (= event-type "DATA")    "red"
                                                     (= event-type "remote")  "red"
                                                     )
                                             }}
                            (str  debug-id ") " event-type))

                            (if deleted (dom/div #js {:style #js {:color "red"}}
                                                 (dom/div nil "Deleted")
                                                 (show-tree  deleted false [] event-type debug-ui-state)
                                                 ))

                            (if added (dom/div #js {:style #js {:color "green"}}
                                               (dom/div nil "Added")
                                               (show-tree  added false [] event-type debug-ui-state)
                                               ))




                            (if (= event-type "event") (dom/div #js {:style #js {:color "green"}}

                                                                (dom/div #js {:style #js {:color "blue"}} (str event-name))
                                                                (dom/pre nil

                                                                         (->
                                                                          (str
                                                                           (get
                                                                            (get @debugger-ui :watchers-code)

                                                                            event-name

                                                                            ))
                                                                          (clojure.string/replace #"\(div\ " "(DIV " )
                                                                          ))
                                                                (dom/div nil "PATHS ACCESSED:")

                                                                ))



                           (if (= event-type "remote") (dom/div #js {:style #js {:color "red"}}

                                             (dom/div #js {:style #js {:color "blue"}} (str action-name))
                                             (dom/div #js {:style #js {:color "black"}} (show-tree action-input false [] nil debug-ui-state) )
                                             (dom/pre #js {:style #js {:color "green"}} (show-tree action-result false [] nil debug-ui-state) )
                                             ))






                            (if (=  debug-id (-> debug-ui-state :pos))
                              (do
                                (if (and
                                     (= event-type "render")
                                     (not (= (get debug-ui-state :code-data-show_index2) debug-id)))
                                  (om/root
                                   (fn [ partial-state  partial-owner ]
                                     (reify
                                       om/IRender
                                       ;---------
                                       (render
                                        [state]

                                        (dom/div #js {:style #js {:paddingTop "25px"}}
                                                 (om/build
                                                  (get (:react-components-fns @debugger-ui)
                                                       (str component-name))
                                                  partial-state)
                                                 (dom/svg #js {:style #js {:width "40" :height "40"}}
                                                          (dom/line #js {:x1 "0"
                                                                           :y1 "20"
                                                                           :x2  "21"
                                                                           :y2  "0"
                                                                           :stroke "black"
                                                                           :strokeWidth "4"
                                                                           :fill "black"} )
                                                          (dom/line #js {:x1 "19"
                                                                           :y1 "0"
                                                                           :x2  "40"
                                                                           :y2  "20"
                                                                           :stroke "black"
                                                                           :strokeWidth "4"
                                                                           :fill "black"} )
                                                          (dom/line #js {:x1 "20"
                                                                           :y1 "0"
                                                                           :x2  "20"
                                                                           :y2  "40"
                                                                           :stroke "black"
                                                                           :strokeWidth "4"
                                                                           :fill "black"} )
                                                          )
                                                 ))))

                                   (atom component-data)
                                   {:target (js/document.getElementById "debugger_ui_preview")})



                                  (om/root
                                   (fn [ partial-state  partial-owner ]
                                     (reify
                                       om/IRender
                                       ;---------
                                       (render
                                        [state]

                                        (dom/div nil "")
                                                          )
                                                 ))

                                   (atom {})
                                   {:target (js/document.getElementById "debugger_ui_preview")})

                                  )

                              (dom/div #js {:style #js {:color "green"}}


                                       (if (= event-type "render")

                                         (dom/div #js {
                                                       :onClick #(do (om/update!
                                                                      debug-ui-state
                                                                      [:code-show_index]
                                                                      (if (= (get @debug-ui-state :code-show_index) debug-id)
                                                                        nil
                                                                        debug-id))
                                                                   (om/update!
                                                                    debug-ui-state
                                                                    [:code-data-show_index] nil))
                                                       :style #js {:color "blue"
                                                                   :textDecoration "underline"
                                                                   :display "inline-block"
                                                                   }} (str
                                                                       (if (= (get debug-ui-state :code-show_index)
                                                                              debug-id)
                                                                         "-" "+")
                                                                       component-name
                                                                       " "
                                                                       component-path
                                                                       )))

                                       (if (= event-type "render")
                                         (dom/div #js {
                                                     :onClick #(do
                                                                 (om/update!
                                                                  debug-ui-state
                                                                  [:code-data-show_index]
                                                                  (if (= (get @debug-ui-state :code-data-show_index) debug-id)
                                                                    nil
                                                                    debug-id))
                                                                 (om/update!
                                                                  debug-ui-state
                                                                  [:code-show_index] nil))
                                                     :style #js {:color           "blue"
                                                                 :textDecoration "underline"
                                                                 :display         "inline-block"
                                                                 :paddingLeft     "10px"
                                                                 }
                                                     }
                                                (str
                                                 (if (= (get debug-ui-state :code-data-show_index) debug-id)
                                                   "-" "+")
                                                 "Input data")))

                                       (if (= (get debug-ui-state :code-show_index) debug-id)
                                         (dom/pre #js {
                                                       :style #js {:position "absolute" }
                                                       :onMouseLeave #(om/update! debug-ui-state [:code-show_index]
                                                                                  nil)}
                                                  (->
                                                   (str
                                                    (get
                                                     (get @debugger-ui :react-components-code)

                                                     component-name

                                                     ))
                                                   (clojure.string/replace #"\(div\ " "(DIV " )
                                                   (clojure.string/replace #"\(dom/h2\ " "(H2 " )
                                                   )))


                                       (if (= (get debug-ui-state :code-data-show_index) debug-id)
                                         (dom/pre #js {
                                                       :style #js {:position "absolute" }
                                                       :onMouseLeave #(om/update! debug-ui-state [:code-data-show_index]
                                                                                  nil)}
                                                  (show-tree  component-data  false  component-path "UI" debug-ui-state)

                                                  )))))))))))))










(defn details-debug-comp [app owner]
  (reify
    om/IRender
    ;---------
    (render
     [_]
     (dom/div nil
              (cond
               (= (:mode @debugger-ui) "show-event")
               (om/build  show-event-component   app))))))

;(reverse (get @data-accesses {:tree "UI" :path (get @debugger-ui :events-filter-path)}))
;(keys @debug-event-timeline )




(defn  ^:export loadDebugger []
  (do
   (reset! app-watch-on? false)
))



(defn  ^:export unloadDebugger []
  (do

nil

    ))

;(unloadDebugger)

