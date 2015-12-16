(ns webapp.framework.client.macros

  ;(:require [webapp.framework.client.fns :refer [abcd-fn] ])
  ;(:require-macros [cljs.core.async.macros ] )
)



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







(defmacro nscoils [namespace-name]
  `(defn ~'ns-coils-debug  [] (str ~namespace-name)))


(defmacro span [attributes & more]
  `(om.dom/span  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro input [attributes & more]
  `(om.dom/input  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro button [attributes & more]
  `(om.dom/button  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro div [attributes & more]
  `(om.dom/div  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))






