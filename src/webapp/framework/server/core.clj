(ns webapp.framework.server.core
  [:require [webapp.server.fns]]
  [:use [webapp.framework.server.systemfns]]
  (:use [clojure.java.shell :only [sh]])
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
  (:require [me.raynes.fs    :as fs])
  (:require [me.raynes.conch])
  (:require [me.raynes.conch.low-level])
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






(defn delete-recursively [fname]
  (let [func (fn [func f]
               (when (.isDirectory f)
                 (doseq [f2 (.listFiles f)]
                   (func func f2)))
               (clojure.java.io/delete-file f))]
    (func func (clojure.java.io/file fname))))







(defn replace-in-file [ file-location     text-to-find   text-to-replace ]
  (do
    (println (str "***replace-in-file: "  file-location))
    (let [aa         (slurp  file-location)
          bb         (.replace  aa    (str text-to-find)  (str text-to-replace))]

      (spit file-location  bb))))





(let [max-result    (sql-1 "select max(id) as maxid from coils_realtime_log" [])
      max-n         (:maxid max-result)
      ]
  (if max-n
    (reset! server-side-max-realtime-log-entry  max-n))

  (println (str "*** server-side-max-realtime-log-entry *** : "  max-n)))









(println "********************************")
(def max-figwheel-processes 1)
; deletes the realtime log every time the file is reloaded, or the server is restarted
(if *hosted-mode*
  (let [figwheel-index    (range 0 max-figwheel-processes)]
    ;(println "********************************In hosted mode")

    (if (does-table-exist "coils_figwheel_processes")
      (korma.core/exec-raw ["delete from coils_figwheel_processes" []] []))





    (let [dir (str (cond (is-mac-osx) *project-root-mac* :else *project-root-windows*) "figwheel_dev_envs")
          java-dir (io/file dir)
          app-dire-exists (.exists   java-dir)
          ]
      (println dir ":" app-dire-exists)
      (if app-dire-exists
        (delete-recursively   java-dir)
        )


      (println "")
      (println "MKDIR:" java-dir)
      (.mkdir   java-dir)
      (println "DONE")
      (println "")



      ;(println (str "****** RANGE ************* " figwheel-index))
      (doall (for [a figwheel-index]
               (let [src-dir           (cond (is-mac-osx) (str  *project-root-mac* "coils/") :else (str *project-root-windows* "coils\\"))
                     new-dir           (cond (is-mac-osx) (str  *project-root-mac* "figwheel_dev_envs/app" a) :else (str *project-root-windows* "figwheel_dev_envs\\app" a))
                     java-new-dir      (io/file new-dir)
                     figwheel-port     (+ a *base-dev-port*)
                     ]
                 (println (str "***making new figheel instance: " a " + " new-dir))
                 (sql "insert into coils_figwheel_processes (figwheel_port) values (?)" [figwheel-port])
                 (.mkdir   java-new-dir)
                 (fs/copy-dir src-dir  new-dir)

                 (replace-in-file (str new-dir (cond (is-mac-osx) "/coils/project.clj" :else "\\coils\\project.clj"))  3449 figwheel-port )
                 (replace-in-file (str new-dir (cond (is-mac-osx) "/coils/srcbase/webapp_config/settings.clj" :else "\\coils\\srcbase\\webapp_config\\settings.clj"))  3449 figwheel-port)

                 (let [p (me.raynes.conch.low-level/proc
                                  (cond (is-mac-osx) (str *project-root-mac*      "figwheel_dev_envs/app0/coils/start_figwheel_client.sh")
                                        :else        (str  *project-root-windows* "figwheel_dev_envs\\app0\\coils\\start_figwheel_client.bat")))]
                   (future (me.raynes.conch.low-level/stream-to-out p :out)))
                 ;(future (sh "call" "start_figwheel_client.bat"  :dir (str new-dir "\\coils")))

                 ))))))


