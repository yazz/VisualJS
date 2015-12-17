(ns webapp.framework.client.components.main-view
  (:require [webapp.framework.client.coreclient   :as c]
            [goog.net.XhrIo          :as xhr]
            [om.core]
            [webapp.framework.client.system-globals]
            [om.dom]
            [cljs.js :as cljs]
            [cljs.tools.reader :refer [read-string]]
            [webapp.framework.client.fns :refer [cljs-in-cljs newwidget]]

            )
  (:use-macros [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                                           container  map-many  inline  text log sql
                                                           div img pre component h2 input section header button label form
                                                           write-ui read-ui container input component <-- data-view-result-set
                                                           h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                                           input-field ]])
  (:require-macros [cljs.core.async.macros :refer [go alt!]]
                     ))
(ns-coils 'webapp.framework.client.components.main-view)
; the shortest todo mvc in the world at 84 lines of code








(defn-ui-component     new-do-item-component   [app] {}

  (input-field {:style {:marginBottom "20px"}
                 :placeholder  "Enter a new todo here"} app
               (fn [new-todo-item-text] (go
                                          (sql "insert into coils_todo_items
                                               (item, item_status)
                                               values
                                               (?,                  ?)"
                                               [new-todo-item-text  "ACTIVE"]  )))))










(defn-ui-component     to-do-list-component   [app] {}


  (realtime select
                      id, item, item_status
                 from
                      coils_todo_items
                 where
                      item_status = ? OR item_status = ?
                 order
                      by id desc

            {:params [(if (read-ui app [:show]) (read-ui app [:show]) "ACTIVE")
                      (if (read-ui app [:show]) (read-ui app [:show]) "COMPLETED")]}

            (container

             (div {:className  "checkbox"  :style { :top "-22px" :width "20%" :display "inline-block;"} }
                  (input {:type  "checkbox"
                          :checked   (if (= (<-- :item_status) "COMPLETED") "T" "")
                          :onChange  (fn [event]
                                       (let [newtext   (.. event -target -checked  )
                                             item-id   (<-- :id)]
                                         (if newtext
                                           (go (sql "update  coils_todo_items   set item_status = 'COMPLETED' where id = ?" [item-id]  ))
                                           (go (sql "update  coils_todo_items   set item_status = 'ACTIVE' where id = ?" [item-id]  )))))}))

             (label {:style {:width   "70%" :height "1.5em"}
                     :className (if (= (<-- :item_status) "COMPLETED") "completed" "item")}
                    (str (<-- :item)))

             (button {:className    "destroy"
                      :style       {:width   "10%"}
                      :onClick     (fn [e]
                                     (go (sql "delete from  coils_todo_items  where id = ?"
                                              [(<-- :id)]  ))
                                     false)}))))










(defn-ui-component     to-do-footer-component   [app] {}

  (let [active-items      (select id from  coils_todo_items where item_status = 'ACTIVE' {})
        total-items       (select id from  coils_todo_items {})
        completed-items   (select id from  coils_todo_items where item_status = 'COMPLETED' {})  ]

    (if (pos? (count total-items))
      (do
        (div {:style {:height "30px"}})
        (div {:id "footer" :style {:backgroundColor "white" :fontSize "12"}}
             (container
               (div {:style {:width "27%" :display "inline-block;" :textAlign "left"}
                     }  (str (count active-items) " items left"))

               (button {:style {:width "9%" :border (str (if (nil? (read-ui app [:show])) "1px solid"))}
                        :onClick #(do (write-ui app [:show] nil) false)
                        } "ALL")

               (button {:style {:width "13%" :border (str (if (= "ACTIVE" (read-ui app [:show])) "1px solid"))}
                        :onClick #(do (write-ui app [:show] "ACTIVE") false)
                        } "Active")

               (button {:style {:width "17%" :border (str (if (= "COMPLETED" (read-ui app [:show])) "1px solid"))}
                        :onClick #(do (write-ui app [:show] "COMPLETED") false)
                        } "Completed")

               (if (pos? (count completed-items))
                 (button {:style {  :width "34%" :textAlign "right"}
                          :onClick #(do (go
                                          (sql "delete from  coils_todo_items  where item_status = 'COMPLETED'" []  ))
                                      false)
                          } "Clear completed"))))))))






(def  aaa  (atom (fn [] 333)))


(def  bbb  (atom (fn [] 333)))




(defn-ui-component     main-to-do-app   [app] {}

  (section {:className "todoapp" :style {:fontFamily "Roboto"}}
    (div {} (h2 {:style {:fontFamily "Ubuntu" :fontWeight "700" :fontSize "2em"}} (str "Coils Todo MVC"  (@aaa))))
    (div {:className "main_div"}

         (component  new-do-item-component   app  [])
         (div {:className "smallGap"})

         (component  to-do-list-component   app  [])
         (div {:className "mediumGap"})

         (component  to-do-footer-component   app  [])

         (cljs-in-cljs)
         (om.core/build newwidget app {})



         (comment let* [data ( webapp.framework.client.coreclient/data-window-fn {
                                                                           :data-source          :coils_todo_items
                                                                           :relative-path       [1]
                                                                           :interval-in-millis   100
                                                                           :fields                [:id :item :item_status]
                                                                           :db-table            "coils_todo_items"
                                                                           :where nil
                                                                           :params nil
                                                                           :order nil
                                                                           :realtime nil
                                                                           }
                       {:start 1 :end 20}
                       newwidget [] app)


                data-order             (-> data :order)
               ]
               (div nil (map-many
                 (fn [record-id]
                   (let [relative-path (:relative-path {:fields [:id :item :item_status],
                                                        :db-table "coils_todo_items",
                                                        :relative-path [1],
                                                        :params nil,
                                                        :data-source
                                                        :coils_todo_items}) record
                         (get (-> data :values) record-id)]
                     (if (clojure.core/get record :value)
                       (div {} (div nil "a")))))
                 (map (fn [x] (get data-order x)) (range (:start {:start 1, :end 20}) (inc (min (:end {:start 1, :end 20})
                                                                                                (-> data :count))))))))


         )))





(def-coils-app     main-view   main-to-do-app)

(def autoin (atom 0))

(defn get-file [url cb]
  (.send goog.net.XhrIo url
    (fn [e]
      (cb (.. e -target getResponseText)))))



(defn load-fn [lib cb]
  (do
    (swap! autoin inc)
    (let [filename (str @webapp.framework.client.system-globals/appshare-cljs-source (:path lib) ".cljs?autoin=" autoin)]
      (log (str "load-fn:" filename))
      (get-file   filename
                  (fn [src]
                    (cb {:lang :clj :source src}))))))






(defn ^:export evalstr2old [s]
  (cljs/eval (cljs/empty-state)
        (read-string s)
        {:eval            cljs/js-eval
         ;:context         :expr
         :source-map      true
         ;:def-emits-var   true
         :load            load-fn
         ;:in-ns           webapp.framework.client.components.main-view
           ;:ns webapp.framework.client.coreclient
         }
        (fn [result] (do (log (pr-str result)) result))))






(defn ^:export evalstr2 [s]
  (cljs/eval-str (cljs/empty-state) s 'foo.bar
                    {
                      :eval cljs/js-eval
                      :load load-fn
                      :source-map true
                      :def-emits-var   true
                      :ns webapp.framework.client.fns
                      }
                    (fn [result]
                      (do
                        (log (pr-str result))
                        (js/eval (:value result))
                        result))))



