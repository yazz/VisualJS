(ns myappshare.your-account
  (:require
   [webapp.framework.client.coreclient   :as c ]
   [om.core :as om :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]])

  (:use-macros
   [webapp.framework.client.coreclient  :only [defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql textarea a
                                               div img pre component h2 input section header button label form iframe
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                               input-field remote
                                               ]])
  (:use
   [webapp.framework.client.system-globals :only  [client-session-atom touch]])

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))











(defn-ui-component     your-account-component   [app]  {}


  (div {:style {:marginLeft "5px" :fontFamily "Ubuntu"}}
       (div {:style {:display ""  :fontSize "1em"}}
               "My account")

       (div {:style {:display ""  :fontSize "1em"}}
               (str @client-session-atom ))
       )
  )








