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



       )))







(defmacro ns-coils [namespace-name]
  `(defn ~'ns-coils-debug  [] (str ~namespace-name)))


(defmacro span [attributes & more]
  `(om.dom/span  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro input [attributes & more]
  `(om.dom/input  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro button [attributes & more]
  `(om.dom/button  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro div [attributes & more]
  `(om.dom/div  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))










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
                           ]
                          (~'if (get ~'record :value)
                                ~@code)))
             (~'map (~'fn[~'x] (~'get ~'data-order ~'x)) (~'range (:start ~position) (~'inc
                                                                                      (~'min (:end ~position) (~'-> ~'data :count) )
                                                                                      )))))))













(def path-index (atom 0))



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
        parsed-sql        (webapp.framework.client.coreclient/parse-sql-string-into-instaparse-structure-fn
                            sql-as-a-string)

        transformed-sql   (webapp.framework.client.coreclient/transform-instaparse-query-into-dataview-map-fn    parsed-sql)
        params            (get  main-params :params)
        dataview-map      (do (swap! path-index inc)
                              (merge (first transformed-sql)
                                     {
                                      :relative-path [(deref path-index)]
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
           ;(~'div {}  (~'str "SQL LIST: "                         ~list-of-sql))
           (~'div {}  (~'str "SQL STRING: "
                        ~sql-as-a-string))
           (~'div {}  (~'str "Main Instaparse Query: "       ~parsed-sql))
           (~'div {}  (~'str "Main Transformed query: "
                        ~transformed-sql))
           (~'div {}  (~'str "Main Dataview map: "           ~dataview-map))
           (~'div {}  (~'str "Main Params: "                 ~main-params))
           (~'div {}  (~'str "SQL Params: "                 ~params))
           (~'div {}  (~'str "Type: "  ~typeof2))
           )


    `(~'data-view-v2
       ~dataview-map

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
    ;(cond
    ;  (= (type type-of-last-arg)  (type {}))
    ;  `(remote-sql-parser  "select" ~@select-args) ; direct SQL is always treated as realtime

    ;  :else
    `(sql-parser  "select" ~@select-args)
  ;  )
  ))
