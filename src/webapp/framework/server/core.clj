(ns webapp.framework.server.core
  [:require [webapp.server.fns]]
  [:use [webapp.framework.server.systemfns]]
  [:use [ring.middleware.format]]
  [:use [compojure.core]]
;  [:use [ring.middleware.json]]
  [:require [ring.middleware.multipart-params :as mp]]
  [:require [compojure.route :as route]]
  [:require [compojure.handler :as handler]]
  [:require [ring.util.response :as resp]]
  [:use [webapp-config.settings]]
  (:use [webapp.framework.server.email-service])
  (:require [clojure.java.io :as io])
  (:use [webapp.framework.server.globals])
  (:use [webapp.framework.server.db-helper])

  (:require [ring.middleware.json :refer [wrap-json-response  wrap-json-body  wrap-json-params]])
)




(defn parse-params
  ([params]
  (parse-params  params  nil))

  ([params  post-data]
  (do
  ;(println (str "Action:" (:action params) (:systemaction params) "  ,Count params:" (count (keys (load-string (:params params))))))
    ;(println (str "POST KEYS:"  params))
  (let
    [
     code (str
           "("
           (if (:action params) "webapp.server.fns/" "webapp.framework.server.systemfns/")
           (if (:action params) (:action params) (:systemaction params))
           " "

           (if (or (> (count (keys (load-string (:params params)))) 0) post-data)
             (str  (:params params)))
           " "

           (if post-data
             (pr-str  post-data))

           ")")
     ]
    ;(println ":" code)
    (pr-str (load-string code))
    ))))






(defn upload-file
  [file]

  ;(println (str  file))

  (io/copy
   (file :tempfile)
   (io/file "../pictures/a.jpg"))

  "DONE")




(defroutes main-routes


  (GET "/:domain/action" params
    (do
      (parse-params  (params :params))))



  (GET "/action" params
    (do
      (parse-params  (params :params))))




  (POST "/:domain/action" params
    (let [body   (:body params)]
      ;(println (str "params: " params))
      ;(println "")
      (.reset body)
      (parse-params  (params :params)  (slurp body) )))




  (POST "/action" params
    (let [body   (:body params)]
      ;(println (str "params: " params))
      ;(println "")
      (.reset body)
      (parse-params  (params :params)  (slurp body))))



   (mp/wrap-multipart-params
       (POST "/file" {params :params}
             (do

             (upload-file (get params "file")))))





  (GET "/" []
       (resp/resource-response (str *main-page*) {:root "public"}))



  (route/resources "/:domain/")
  (route/resources "/")



  (ANY "/*:name" [name]
       (.replaceFirst
        (slurp (:body
                (resp/resource-response (str *main-page*) {:root "public"})
                ))
       "addparam2" name))
;       (resp/resource-response (str *main-page* "?add=" name) {:root "public"}))
;       (resp/redirect (str *main-page* "?addparam=" name)))
)



(comment .replaceFirst
        (slurp (:body
                (resp/resource-response (str *main-page*) {:root "public"})
                ))
       "ConnectToUs" "xxx")

(comment :body (rest/GET

        (str (clojure.java.io/resource (str "public/" *main-page*)))

        ))


        (str (clojure.java.io/resource (str "public/" *main-page*)))


(defn wrap-dir-index [handler]
  (fn [req]
    (handler
     (update-in req [:uri]
                #(if (= "/" %) (str "/" *main-page*) %)))))





(def app
    (->
      ;(wrap-json-response)
      (handler/api main-routes)
      ;(wrap-json-body)
        ;(wrap-json-response)
        ;(wrap-json-params)
))






; deletes the realtime log every time the file is reloaded, or the server is restarted
(if (not *hosted-mode*)
  (do
    (if (does-table-exist "coils_realtime_log")
      (korma.core/exec-raw ["delete from coils_realtime_log" []] []))))



(def max-figwheel-processes 2)
; deletes the realtime log every time the file is reloaded, or the server is restarted
(if *hosted-mode*
 (let [figwheel-index    (range 0 max-figwheel-processes)]
  (if (does-table-exist "coils_figwheel_processes")
    (korma.core/exec-raw ["delete from coils_figwheel_processes" []] []))


  (println (str "****** RANGE ************* " figwheel-index))
  (doall (for [a figwheel-index]
           (do
             (println a)
             (sql "insert into coils_figwheel_processes (figwheel_port) values (?);" [(+ a *base-dev-port*)])
             (sql "select count(*) from coils_todo_items")
             )))))




