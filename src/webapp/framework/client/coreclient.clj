(ns webapp.framework.client.coreclient
  [:use [webapp.framework.server.encrypt]]
  (:use clojure.pprint)
  (:use webapp-config.settings)
  (:require [rewrite-clj.parser :as p])
  (:require [clojure.data :as di])
  (:require [rewrite-clj.printer :as prn])
  (:require [instaparse.core :as insta])
  (:use clojure.pprint)
  (:require [instaparse.core :as insta])
  (:use clojure.string)

  )


;--------------------------------------------------------------------
; use this when you want to comment out logging, by removing the 2
(defmacro log2 [& x]
  `(comment ~@ x))



(defmacro remote

  ([action]
  `(~'<! (webapp.framework.client.coreclient/remote-fn  ~(str `~action))))

  ([action params]
  `(~'<! (webapp.framework.client.coreclient/remote-fn  ~(str `~action)  ~params)))
  )




(defmacro server-call [& x]
  `(cljs.core.async.macros/go ~@ x))

(macroexpand '(remote  a  {}))

(defmacro log [& x]
  `(.log js/console (str
                     ~@ x)))

(defmacro add-many [items]
  `(add-many-fn      ~items))


(defmacro map-many [code items]
  `(add-many
   (map
    ~code
    ~items)))


;(macroexpand '(log "a" "b"))
;--------------------------------------------------------------------













;--------------------------------------------------------------------
(defmacro ns-coils [namespace-name]
  `(defn ~'ns-coils-debug  [] (str ~namespace-name)))


;(macroexpand '(ns-coils dfd))
;--------------------------------------------------------------------








(defmacro aa [x]
  `(str ~(str `~x)))

(macroexpand '(aa "a1"))


;--------------------------------------------------------------------
(defmacro defn-ui-component

  ([fn-name  data-paramater-name  code ]
   `(defn-ui-component  ~fn-name  ~data-paramater-name  {}  ~code))



  ([fn-name data-paramater-name opts code ]
    `(do
       (reset! webapp.framework.client.coreclient/data-views-proxy
               (into {}
                     (filter (fn [~'x] (if (not (=   ~(str `~fn-name)
                                            (get (first  ~'x) :ui-component-name)))
                                true))
                             (deref webapp.framework.client.coreclient/data-views-proxy))))



       (defn ~fn-name [~(first data-paramater-name)  ~'owner]
         (~'reify

          ~'om.core/IInitState
          (~'init-state ~'[_]
                      {:debug-highlight false})


           ~'om.core/IWillUnmount
           (~'will-unmount ~'[_]
             (~'let [
                     ~'ui-component-name    ~(str `~fn-name)
                     ~'path                 ~'(om.core/get-state owner :parent-path)
             ]
               nil
                ;(~'.log ~'js/console (~'str "Unmount: " ~'path ))
            ))


          ~'om.core/IRender
          (~'render [~'this]

                    (~'let [
                            ~'debug-id       (webapp.framework.client.coreclient/record-component-call
                                              (~'ns-coils-debug)
                                              ~(str `~fn-name)
                                              ~(first data-paramater-name)
                                              ~'(om.core/get-state owner :parent-path)
                                              )


                            ~'ui-component-name    ~(str `~fn-name)
                            ~'path       ~'(om.core/get-state owner :parent-path)

                            ~'ui-state   ~(first data-paramater-name)

                            ~'parent-id  ~'debug-id

                            ~'return-val (webapp.framework.client.coreclient/debug-react
                                          ~(str `~fn-name)
                                          ~'owner
                                          ~(first data-paramater-name)
                                          (~'fn [~(first data-paramater-name)]
                                                ~code)
                                          ~'path
                                          ~'parent-id
                                          )

                            ~'removed-id     (~'webapp.framework.client.coreclient/remove-debug-event  ~'debug-id)
                            ]

                      ~'return-val)

           )

          ~'om.core/IDidMount
          (~'did-mount
           [~'this]
           (~'let [
                   ~'path           ~'(om.core/get-state owner :parent-path)

                   ~'debug-id       (webapp.framework.client.coreclient/record-component-call
                                     (~'ns-coils-debug)
                                     ~(str `~fn-name)
                                     ~(first data-paramater-name)
                                     ~'(om.core/get-state owner :parent-path)
                                     )

                   ~'parent-id       ~'debug-id
                   ]


                  ~(get opts :on-mount )))))


       (webapp.framework.client.coreclient/record-defn-ui-component
             (~'ns-coils-debug)
             ~fn-name
             ~(str `~fn-name) ~(str `~data-paramater-name)

          (str ~(with-out-str   (write `~code)
                                        :dispatch clojure.pprint/code-dispatch)))




       (webapp.framework.client.coreclient/process-ui-component  ~(str `~fn-name))

       )))


(macroexpand
  '(defn-ui-component abc [data] {:path [:ui :request] }
     (om.dom/div  nil  " You asdsddsads")
      ))
;--------------------------------------------------------------------




(defmacro def-coils-app
  [fn-name  component-name]
  `(~'defn-ui-component  ~fn-name [~'app]
nil
                       ;(div {} "s")))
                       (~'component ~component-name   ~'app  [])))







;--------------------------------------------------------------------
(defmacro div [attributes & more]
  `(om.dom/div  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro a [attributes & more]
  `(om.dom/a  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h1 [attributes & more]
  `(om.dom/h1  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h2 [attributes & more]
  `(om.dom/h2  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h3 [attributes & more]
  `(om.dom/h3  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h4 [attributes & more]
  `(om.dom/h4  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h5 [attributes & more]
  `(om.dom/h5  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h6 [attributes & more]
  `(om.dom/h6  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro ul [attributes & more]
  `(om.dom/ul  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro li [attributes & more]
  `(om.dom/li  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro pre [attributes & more]
  `(om.dom/pre  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro svg [attributes & more]
  `(om.dom/svg  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro circle [attributes & more]
  `(om.dom/circle  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro button [attributes & more]
  `(om.dom/button  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro input [attributes & more]
  `(om.dom/input  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro table [attributes & more]
  `(om.dom/table  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro tr [attributes & more]
  `(om.dom/tr  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro td [attributes & more]
  `(om.dom/td  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro th [attributes & more]
  `(om.dom/th  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro form [attributes & more]
  `(om.dom/form  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro span [attributes & more]
  `(om.dom/span  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro img [attributes & more]
  `(om.dom/img  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro section [attributes & more]
  `(om.dom/section  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))

(defmacro container [& more]
  `(om.dom/div  {} ~@more))
(defmacro text [& str-items]
  `(om.dom/div  {} (str ~@str-items)))
(defmacro inline [width & more]
  `(om.dom/div  (webapp.framework.client.coreclient/attrs
                 {:style {:display "inline-block;"
                          :width   ~width
                          :verticalAlign "top"
                          }}) ~@more))

;--------------------------------------------------------------------




;--------------------------------------------------------------------
(defmacro watch-ui
  [path watcher-name & code]

  `(do

     (webapp.framework.client.coreclient/record-watcher
      (~'ns-coils-debug)
      ~(str `~path)
      "ui"
      (str ~(with-out-str   (write (first `~code))
              :dispatch clojure.pprint/code-dispatch))
      )

     (~'webapp.framework.client.coreclient/when-ui-value-changes-fn
      ~path
      (~'fn [~'ui] (do ~@code)))))
;--------------------------------------------------------------------





;--------------------------------------------------------------------
(defmacro ==ui
  "Checks the UI tree for a value"
  [path value test-name & code]

  `(do
     (webapp.framework.client.coreclient/record-path=
      (~'ns-coils-debug)
      ~(str `~path)
      ~(str `~value)
      "ui"
      (str ~(with-out-str   (write (first `~code))
              :dispatch clojure.pprint/code-dispatch))
      )

     (~'webapp.framework.client.coreclient/when-ui-path-equals-fn
      ~path
      ~value
      (~'fn [~'ui] (do ~@code)))))
;--------------------------------------------------------------------

;--------------------------------------------------------------------
(defmacro watch-data
  [path watcher-name & code]

  `(do
     (if (pos? (count ~watcher-name))
         (webapp.framework.client.coreclient/delete-data-watcher  ~watcher-name)
     )

     (webapp.framework.client.coreclient/record-watcher
      (~'ns-coils-debug)
      ~(str `~path)
      "data"
      (str ~(with-out-str   (write (first `~code))
              :dispatch clojure.pprint/code-dispatch))
      )

     (~'webapp.framework.client.coreclient/when-data-value-changes-fn
      ~watcher-name
      ~path
      (~'fn [~'ui] (do ~@code)))))
;--------------------------------------------------------------------







;--------------------------------------------------------------------
(defmacro ==data
  [path value test-name & code]

  `(do
     (webapp.framework.client.coreclient/record-path=
      (~'ns-coils-debug)
      ~(str `~path)
      ~(str `~value)
      "data"
      (str ~(with-out-str   (write (first `~code))
              :dispatch clojure.pprint/code-dispatch))
      )

     (~'webapp.framework.client.coreclient/when-data-path-equals-fn
      ~path
      ~value
      (~'fn [~'ui] (do ~@code)))))
;--------------------------------------------------------------------







;--------------------------------------------------------------------
(defmacro <--ui
  [path]
  `(~'webapp.framework.client.coreclient/get-in-tree ~'ui ~path))

(comment macroexpand
 '(==ui  [:ui   :company-details   :clicked]    true

      (-->ui  [:ui  :company-details   :clicked  ] false)
      (-->ui  [:ui  :tab-browser    ] "top companies")))



(defmacro -->ui
  "Writes to the UI tree"
  [path value]
  `(~'webapp.framework.client.coreclient/update-ui ~'ui ~path ~value))

;(macroexpand '(-->ui [:ui :request :from-email :error] ""))






(defmacro  -->data
  "Writes to the data tree"
  [path value]
   `(~'webapp.framework.client.coreclient/-->data-fn ~path ~value))



(defmacro  <--data
  "Reads from the data tree"
  [path]
   `(~'webapp.framework.client.coreclient/<--data-fn ~path))











(comment macroexpand '(when-ui-value-changes [:ui :company-details :company-url]


   (go
    (webapp.framework.client.coreclient/update-ui  ui  [:ui  :company-details   :skills  ] nil)
     (let [ l (remote  get-company-details
             {
              :company-url    (get-in @app-state [:ui :company-details :company-url])
              })]

       ;(log (pr-str l))
       (update-data [:company-details]  l)
       ))))
;--------------------------------------------------------------------








;--------------------------------------------------------------------
(defmacro component
  [component-render-fn   state   rel-path]
  `(let [
         ~'return-value   (~'webapp.framework.client.coreclient/component-fn   ~component-render-fn
                                                                               ~state
                                                                               ~'path
                                                                               ~rel-path)
         ]
     (do
       ~'return-value)))

;(macroexpand '(component  main-view  app []) )
;(macroexpand '(defn-ui-component    letter-a  [data] {}    (div nil "a")))




;--------------------------------------------------------------------



;--------------------------------------------------------------------
(defmacro write-ui
  [tree sub-path value]
  `(do
     (webapp.framework.client.coreclient/write-ui-fn
      ~tree
      ~'path
      ~sub-path
      ~value
      ~'parent-id
      )))



(defmacro read-ui
  [tree sub-path]
  `(do
     (webapp.framework.client.coreclient/read-ui-fn
      ~tree
      ~'path
      ~sub-path
      ~'parent-id
      )))

;(macroexpand '(read-ui app [:ui :tab-browser]))

(macroexpand '(write-ui app [:ui :tab-browser]  "top companies"))

;--------------------------------------------------------------------
(defmacro sql
  ([sql-str]
  `(~'<! (webapp.framework.client.coreclient/sql-fn
       ~(encrypt sql-str)
       {})))
  ([sql-str params]
  `(~'<! (webapp.framework.client.coreclient/sql-fn
       ~(encrypt sql-str)
       ~params)))
  )

;( macroexpand '(sql "SELECT * FROM test_table where name = ?" ["shopping"] ))
;--------------------------------------------------------------------

(defmacro sql-1
  ([sql-str]
   `(~'first (~'sql  ~sql-str {})))

  ([sql-str params]
   `(~'first (~'sql  ~sql-str ~params))
   ))








(defmacro admin []
  `(webapp.framework.client.coreclient/admin-fn))











;--------------------------------------------------------------------
;--------------------------------------------------------------------
(defmacro data-view-v2 [
                         opts
                         position
                         & code             ]

  `(let [ ~'data        (webapp.framework.client.coreclient/data-window-fn
                          (merge {:relative-path [
                                                  (str ~(java.util.UUID/randomUUID))
                                                  ]} ~opts )
                                                                             ~position
                                                                             ~'ui-component-name
                                                                             ~'path
                                                                             ~'ui-state)

          ~'data-order  (~'-> ~'data :order)                                                            ]

     (~'div nil
            (~'map-many
             (~'fn [~'record-id]
                   (~'let [~'relative-path (:relative-path ~opts)
                           ~'record        (~'get (~'-> ~'data :values) ~'record-id)
                           ]
                          (~'if (get ~'record :value)
                                ~@code)))
             (~'map (~'fn[~'x] (~'get ~'data-order ~'x)) (~'range (:start ~position) (~'inc
                                                                                      (~'min (:end ~position) (~'-> ~'data :count) )
                                                                                      )))))))

;(macroexpand-1 '(data-view-v2 "aa" {:relative-path [:a]} {} (div )))











;--------------------------------------------------------------------
;--------------------------------------------------------------------
(defmacro data-view-result-set [
                         opts
                         position           ]

  `(let [ ~'data        (webapp.framework.client.coreclient/data-window-fn
                          (merge {:relative-path [
                                                  (str ~(java.util.UUID/randomUUID))
                                                  ]} ~opts )
                                                                             ~position
                                                                             ~'ui-component-name
                                                                             ~'path
                                                                             ~'ui-state)

          ~'data-order  (~'-> ~'data :order)



          ]



     (into [] (~'map
               (~'fn[~'x] (~'get-in ~'data [:values (~'get ~'data-order ~'x) :value]))
               (~'range (:start ~position) (~'inc
                                                                                      (~'min (:end ~position) (~'-> ~'data :count) )
                                                                                      ))))
     ;~'data
     ))

;(macroexpand-1 '(data-view-v2 "aa" {:relative-path [:a]} {} (div )))










(defmacro <-- [field]
  `(webapp.framework.client.coreclient/<---fn

    ~'record
    ~field
    ~'path
    ~'relative-path
    )
  )






(defmacro <--pos []
  `(webapp.framework.client.coreclient/<---pos

    ~'record
    ~'path
    ~'relative-path
    )
  )



(defmacro <--id []
  `(webapp.framework.client.coreclient/<---id

    ~'record-id
    ~'record
    ~'path
    ~'relative-path
    )
  )





(defmacro session-user-id []
  `(webapp.framework.client.coreclient/session-user-id-fn

     )
     )





(def path-index (atom 0))

(def parse-sql-string-into-instaparse-structure
  (insta/parser
    "SQL                = SELECT_QUERY | INSERT_STATEMENT

     <SELECT_QUERY>     = REALTIME_CLAUSE? <SELECT> FIELDS <FROM> TABLE WHERE_CLAUSE?  ORDER_CLAUSE?

     REALTIME_OPTIONS   = 'realtime '
     REALTIME_CLAUSE    = <REALTIME_OPTIONS>

     <INSERT_STATEMENT> = <INSERT>  TABLE  INSERT_FIELD_SPEC  VALUES

     <INSERT>           = 'insert into '
     INSERT_FIELD_SPEC  = '(' (FIELD)+ ')'
     <VALUES>           = 'values  '
     INSERT_VALUES      = '('   #'[a-z|A-Z|_| |=|0-9|?|\\'|%]+'   ')'


     SELECT             = 'select '

     FIELDS             = (FIELD)+

     <FIELD>            = #'[a-z|_|(|)]+'  <#' '+>


     FROM               = 'from '

     TABLE              = #'[a-z|_|0-9]+' <' '>

     WHERE              = 'where '

     WHERE_CLAUSE       = <WHERE>  (#'[a-z|A-Z|_| |(|)|>|<|=|0-9|?|\\'|%]+')

     ORDER              = 'order by '

     ORDER_CLAUSE       = <ORDER>  (#'[a-z|A-Z|_| |>|<|=|0-9|?|\\'|%]+')
     "))













(defn transform-instaparse-query-into-dataview-map [ s ]
  [
   (->> s (insta/transform
            {
             :SQL             (fn[& x] (into {} (flatten x)))
             :FIELDS          (fn[& x] {:fields (into [] (map keyword x) )})
             :TABLE           (fn[x]   {:db-table x})
             :WHERE_CLAUSE    (fn[x]   {:where (trim x)})
             :ORDER_CLAUSE    (fn[x]   {:order (trim x)})
             :REALTIME_CLAUSE (fn[]    {:realtime true})
             }
            ))
   ]
  )










(defn transform-dataview-map-to-sql-str [dataview-map]
  (doall
  (str
    "select "
    (apply str (interpose  "," (map name (:fields dataview-map) )))
    " from "
    (:db-table dataview-map)
    ;dataview-map
  )
  ))






(defmacro remote-sql-parser [command & sql-args]
  (let [
        realtime-command   (if (= command "select") "realtime select" command)
        list-of-sql        (map (fn[x]
                                  (if (.startsWith (str x)
                                                   "(quote ") (apply str "'" (rest x)) x)
                                  ) (butlast sql-args))
        main-params       (last   sql-args)

        sql-as-a-string   (str realtime-command " " (apply str (for [arg (into []
                                                                    (apply list list-of-sql))] (str arg " ") ) ))
        parsed-sql        (parse-sql-string-into-instaparse-structure
                            sql-as-a-string)

        transformed-sql   (transform-instaparse-query-into-dataview-map    parsed-sql)
        dataview-map      (do (swap! path-index inc)
                              (merge (first transformed-sql)
                                     {
                                      :relative-path [(deref path-index)]
                                      :params   (get main-params :main-params)
                                      :data-source  (keyword  (get (first
                                                                     transformed-sql) :db-table))
                                      ;:order         "(zgen_points IS NULL), zgen_points  DESC , id asc "
                                      }))
        typeof2     (str (type []))
        ]
    (if


    (get main-params :debug)
      `{"SQL STRING: "                  ~sql-as-a-string
        "Main Instaparse Query: "       ~parsed-sql
        "Main Transformed query: "      ~transformed-sql
        "Main Dataview map: "           ~dataview-map
        "Main Params: "                 ~main-params
        "Type: "                        ~typeof2
           }

    `(~'data-view-result-set
       ~dataview-map

       {:start 1
        :end   20
        }
       ))
))










(defmacro sql-parser [command & sql-args]
  (let [
        list-of-sql        (map (fn[x]
                                  (if (.startsWith (str x)
                                                   "(quote ") (apply str "'" (rest x)) x)
                                  ) (butlast (butlast sql-args)))
        main-params       (last (butlast   sql-args))
        om-code           (last   sql-args)

        sql-as-a-string   (str command " " (apply str (for [arg (into []
                                                                    (apply list list-of-sql))] (str arg " ") ) ))
        parsed-sql        (parse-sql-string-into-instaparse-structure
                            sql-as-a-string)

        transformed-sql   (transform-instaparse-query-into-dataview-map    parsed-sql)
        dataview-map      (do (swap! path-index inc)
                              (merge (first transformed-sql)
                                     {
                                      :relative-path [(deref path-index)]
                                      :params   (get main-params :main-params)
                                      :data-source  (keyword  (get (first
                                                                     transformed-sql) :db-table))
                                      ;:order         "(zgen_points IS NULL), zgen_points  DESC , id asc "
                                      }))
        typeof2     (str (type []))
        ]
    (if


    (get main-params :debug)
      `(~'div {}
           ;(~'div {}  (~'str "SQL LIST: "                         ~list-of-sql))
           (~'div {}  (~'str "SQL STRING: "
                        ~sql-as-a-string))
           (~'div {}  (~'str "Main Instaparse Query: "       ~parsed-sql))
           (~'div {}  (~'str "Main Transformed query: "
                        ~transformed-sql))
           (~'div {}  (~'str "Main Dataview map: "           ~dataview-map))
           (~'div {}  (~'str "Main Params: "                 ~main-params))
           (~'div {}  (~'str "Type: "  ~typeof2))
           )


    `(~'data-view-v2
       ~dataview-map

       {:start 1
        :end   20
        }
       (~'div {}
           ~om-code))
)))







(defmacro select-debug [& select-args]
  (let [
        type-of-last-arg     (last  select-args)
        ]

    (cond
     (= (type type-of-last-arg)  (type {}))
     (let [
           main-sql          (butlast   select-args)
           main-params       (last select-args)
           dataview-map      (merge main-params {:debug true})
           ]
       `(remote-sql-parser
         "select"
         ~@main-sql
         ~dataview-map))



     :else
     (let [
           main-sql          (butlast (butlast   select-args))
           main-params       (last (butlast   select-args))
           dataview-map      (merge main-params {:debug true})
           code              (last  select-args)
           ]
       `(sql-parser
         "select"
         ~@main-sql
         ~dataview-map
         ~code))
     )))






(defmacro select [& select-args]
  (let [
        type-of-last-arg     (last  select-args)
        ]
    (cond
      (= (type type-of-last-arg)  (type {}))
      `(remote-sql-parser  "select" ~@select-args) ; direct SQL is always treated as realtime

      :else
    `(sql-parser  "select" ~@select-args)
    )))



(defmacro realtime [& select-args]
  (let [
        type-of-last-arg     (last  select-args)
        ]
    (cond
      (= (type type-of-last-arg)  (type {}))
      `(remote-sql-parser "realtime" ~@select-args)

      :else
      `(sql-parser  "realtime" ~@select-args)
      )))


(defmacro realtime-debug [& select-args]
  (let [
        main-sql          (butlast(butlast   select-args))
        main-params       (last (butlast   select-args))
        dataview-map      (merge main-params {:debug true})
        code              (last  select-args)
        ]
    `(sql-parser  "realtime" ~@main-sql
                  ~dataview-map
                  ~code))
  )



(defmacro insert [& insert-args]
                 `(remote-sql-parser  ~@insert-args)

                 )


(defmacro input-field [params  app  code]
  (let [input-path (swap! path-index inc)]
  `(input {
           :value      (read-ui  ~app [~input-path])
           :onChange   (~'fn [~'event]
                         (~'let [~'newtext  (.. ~'event -target -value  )]
                           (~'write-ui  ~app  [~input-path]  ~'newtext)))
           :onKeyDown  (~'fn [~'event]
                         (do
                           (~'if (= (.-keyCode ~'event  ) 13)
                             (~'go
                              (let [~'newtext (~'read-ui  ~app [~input-path])]
                              ((~@code) ~'newtext)
                              (~'write-ui  ~app  [~input-path]  ""))))))
           }))
  )
