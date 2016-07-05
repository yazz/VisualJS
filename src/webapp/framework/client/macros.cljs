(ns webapp.framework.client.macros)



(defmacro refresh []
  `(webapp.framework.client.system-globals/touch []))




(defmacro add-many [items]
  `(webapp.framework.client.coreclient/add-many-fn      ~items))


(defmacro map-many [code items]
  `(add-many
   (map
    ~code
    ~items)))



(defmacro defn-ui-component

  ([fn-name  data-paramater-name  code ]
   `(defn-ui-component  ~fn-name  ~data-paramater-name  {}  ~code))



  ([fn-name data-paramater-name opts code ]
    `(do

       (defn ~fn-name [~(first data-paramater-name)  ~'owner]
         (~'reify

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
                             ~'select-id     nil

                            ~'ui-component-name    ~(str `~fn-name)
                            ~'path       ~'(om.core/get-state owner :parent-path)

                            ~'ui-state   ~(first data-paramater-name)

                            ~'return-val (webapp.framework.client.coreclient/debug-react
                                          ~(str `~fn-name)
                                          ~'owner
                                          ~(first data-paramater-name)
                                          (~'fn [~(first data-paramater-name)]
                                                ~code)
                                          ~'path
                                          )
                            ]

                      ~'return-val)

           )

          ~'om.core/IDidMount
          (~'did-mount
           [~'this]
           (~'let [
                   ~'path           ~'(om.core/get-state owner :parent-path)
                   ]


                  ~(get opts :on-mount )))))



       )))








(defmacro span [attributes & more]    `(om.dom/span  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro input [attributes & more]   `(om.dom/input  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro button [attributes & more]  `(om.dom/button  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro div [attributes & more]     `(om.dom/div  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro section [attributes & more] `(om.dom/section  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h1 [attributes & more]      `(om.dom/h1  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h2 [attributes & more]      `(om.dom/h2  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h3 [attributes & more]      `(om.dom/h3  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h4 [attributes & more]      `(om.dom/h4  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h5 [attributes & more]      `(om.dom/h5  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro h6 [attributes & more]      `(om.dom/h6  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))
(defmacro label [attributes & more]   `(om.dom/label  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))




(defmacro container [& more]
  `(om.dom/div  {} ~@more))





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






(defmacro <-- [field]
  `(webapp.framework.client.coreclient/<---fn

    ~'record
    ~field
    ~'path
    ~'relative-path
    )
  )







(defmacro data-view-v2 [
                         opts
                         position
                         & code             ]

  `(let [ ~'data        (webapp.framework.client.coreclient/data-window-fn
                          (merge {:relative-path [
                                                  (str ~(cljs-uuid-utils.core/make-random-uuid))
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
                           ~'select-id     (~'get-in ~'record [:value :id])
                           ]
                          (~'if (get ~'record :value)
                                ~@code)))
             (~'map (~'fn[~'x] (~'get ~'data-order ~'x)) (~'range (:start ~position) (~'inc
                                                                                      (~'min (:end ~position) (~'-> ~'data :count) )
                                                                                      )))))))













(def path-index (atom 0))




(defmacro data-view-result-set [
                         opts
                         position           ]

  `(let [ ~'data        (webapp.framework.client.coreclient/data-window-fn
                          (merge {:relative-path [
                                                  (str ~(cljs-uuid-utils.core/make-random-uuid))
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





(defmacro remote-sql-parser [command & sql-args]
  (let [
        realtime-command   (if (= command "select") "realtime select" command)
        list-of-sql        (map (fn[x]
                                  (if (js/stringStartsWith (str x)
                                                   "(quote ") (apply str "'" (rest x)) x)
                                  ) (butlast sql-args))
        main-params       (last   sql-args)

        sql-as-a-string   (str realtime-command " " (apply str (for [arg (into []
                                                                    (apply list list-of-sql))] (str arg " ") ) ))
        parsed-sql        (webapp.framework.client.coreclient/parse-sql-string-into-instaparse-structure-fn
                            sql-as-a-string)

        transformed-sql   (webapp.framework.client.coreclient/transform-instaparse-query-into-dataview-map-fn    parsed-sql)
        dataview-map      (do (swap! path-index inc)
                              (merge (first transformed-sql)
                                     {
                                      :relative-path [(deref path-index)]
                                      :params   (get main-params :params)
                                      :data-source  (keyword  (get (first
                                                                     transformed-sql) :db-table))
                                      ;:order         "(zgen_points IS NULL), zgen_points  DESC , id asc "
                                      }))
        typeof2     (str (type []))
        ]
    (if


    (get main-params :debug)
      `{
        ;"SQL STRING: "                  ~sql-as-a-string
        ;"Main Instaparse Query: "       ~parsed-sql
        ;"Main Transformed query: "      ~transformed-sql
        "Main Dataview map: "           ~dataview-map
        ;"Main Params: "                 ~main-params
        ;"Type: "                        ~typeof2
           }

    `(~'data-view-result-set
       (~'if ~'select-id (~'merge ~dataview-map {:relative-path (~'conj (~'conj (~'get ~dataview-map :relative-path) :values)  ~'select-id)}) ~dataview-map)

       {:start 1
        :end   20
        }
       ))
))











(defmacro sql-parser [command & sql-args]
  (let [
        list-of-sql        (map (fn[x]
                                  (if (js/stringStartsWith (str x)
                                                   "(quote ") (apply str "'" (rest x)) x)
                                  ) (butlast (butlast sql-args)))
        main-params       (last (butlast   sql-args))
        om-code           (last   sql-args)

        sql-as-a-string   (str command " " (apply str (for [arg (into []
                                                                    (apply list list-of-sql))] (str arg " ") ) ))
        parsed-sql        (webapp.framework.client.coreclient/parse-sql-string-into-instaparse-structure-fn
                            sql-as-a-string)

        transformed-sql   (webapp.framework.client.coreclient/transform-instaparse-query-into-dataview-map-fn    parsed-sql)
        params            (get  main-params :params)
        dataview-map      (do (swap! path-index inc)
                              (merge (first transformed-sql)
                                     {
                                      :relative-path [(if (:relative-path main-params) (:relative-path main-params) (deref path-index))]
                                      :params         (get main-params :params)
                                      :data-source    (keyword  (get (first
                                                                     transformed-sql) :db-table))
                                      ;:order         "(zgen_points IS NULL), zgen_points  DESC , id asc "
                                      }))
        typeof2     (str (type []))
        ]
    (if


    (get main-params :debug)
      `(~'div {}
           ;(~'div {}  (~'pr-str "SQL LIST: "  ~list-of-sql))
           ;(~'div {}  (~'str (count ~list-of-sql)))
           (~'div {}  (~'str "SQL STRING: "
                        ~sql-as-a-string))
           (~'div {}  (~'str "Main Instaparse Query: "       ~parsed-sql))
           (~'div {}  (~'str "Main Transformed query: "
                        ~transformed-sql))
           (~'div {}  (~'str "Main Dataview map: "           ~dataview-map))
           (~'div {}  (~'str "Main Params: "                 ~main-params))
           (~'div {}  (~'str "SQL Params: "                 ~params))
           ;(~'div {}  (~'str "Type: "  ~typeof2))
           )


    `(~'data-view-v2
       (~'if ~'select-id (~'merge ~dataview-map {:relative-path (~'conj (~'conj (~'get ~dataview-map :relative-path) :values)  ~'select-id)}) ~dataview-map)

       {:start     1
        :end       20
        }
       (~'div {}
           ~om-code))
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
    )
  ))

(comment macroexpand '(select
                      id, item, item_status
                 from
                      appshare_todo_items

            {}

            (div nil "a")))

(+ 1 1)


(defmacro read-ui
  [tree sub-path]
  `(do
     (webapp.framework.client.coreclient/read-ui-fn
      ~tree
      ~'path
      ~sub-path
      )))



(defmacro write-ui
  [tree sub-path value]
  `(do
     (webapp.framework.client.coreclient/write-ui-fn
      ~tree
      ~'path
      ~sub-path
      ~value
      )))




(defmacro input-field [params  app  code]
  (let [use-key            (get params :key)
        input-path         (if use-key use-key (swap! path-index inc))
        preserve           (get params :preserveContents)
        send-on-keypress   (get params :sendOnKeypress)
        send-on-blur       (get params :sendOnBlur)
        send-on-tab        (get params :sendOnTab)
        ]

    `(let [
           ~'callback-fn     (~'fn [~'event]
                                       (~'go
                                         (let [~'newtext (~'read-ui  ~app [~input-path])]
                                           ((~@code) ~'newtext)
                                           (~'if (~'not ~preserve) (~'write-ui  ~app  [~input-path]  ""))))
                                       )

            ~'on-change-fn   (~'fn [~'event]
                                 (~'let [~'newtext  (.. ~'event -target -value  )]
                                        (~'.log ~'js/console (~'pr-str (.. ~'event -target -value  )))
                                        (~'write-ui  ~app  [~input-path]  ~'newtext)
                                        (~'if ~send-on-keypress ((~@code) ~'newtext))
                                        ))



            ~'key-down-fn     (~'fn [~'event]
                                   (~'do
                                     (~'if (~'or
                                             (~'= (~'.-keyCode ~'event  ) 13)
                                             (~'and (~'= (~'.-keyCode ~'event  ) 9) ~send-on-tab))
                                       (~'callback-fn  ~'event)
                                       )))
           ]
       (input (merge ~params
                     {
                       :value      (read-ui  ~app [~input-path])
                       :onChange   ~'on-change-fn
                       :onBlur     (if ~send-on-blur ~'callback-fn)
                       :onKeyDown  ~'key-down-fn
                       } )))))







(defmacro sql
  ([sql-str]
  `(webapp.framework.client.coreclient/sql-fn
       ~sql-str
       {}))

  ([sql-str params]
  `(webapp.framework.client.coreclient/sql-fn
       ~sql-str
       ~params))

  ([sql-str params callback-fn]
   `(webapp.framework.client.coreclient/sql-callback
      ~sql-str
      ~params
      ~callback-fn)))





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





(defmacro remote [remote-fn  params  callback-fn]
  `(webapp.framework.client.coreclient/remote-callback
     ~remote-fn
     ~params
     ~callback-fn))
