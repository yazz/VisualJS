(ns myappshare.glyphs
  (:require
   [webapp.framework.client.coreclient   :as c ]
   [om.core :as om :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]])

  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql textarea a
                                               div img pre component h2 input section header button label form iframe
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                               input-field remote
                                               ]])
  (:use
   [myappshare.login :only  [login-component]]
   [myappshare.join :only  [join-component]]
   [myappshare.your-account :only  [your-account-component]]
   [webapp.framework.client.system-globals :only  [appshare-dev-server   appshare-dev-port     client-session-atom]]
    )

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'myappshare.glyphs)






(def glyphs [
              "glyphicon-align-left"
              "glyphicon glyphicon-asterisk"
              "glyphicon glyphicon-plus"
              "glyphicon glyphicon-euro"
              "glyphicon glyphicon-eur"
              "glyphicon glyphicon-minus"
              "glyphicon glyphicon-cloud"
              "glyphicon glyphicon-envelope"
              "glyphicon glyphicon-pencil"

              ])
