(ns webapp.framework.server.core
  [:use [webapp.server.fns]]
  [:use [webapp.framework.server.systemfns]]
  [:use [ring.middleware.format]]
  [:use [compojure.core]]
  [:use [ring.middleware.json]]
  [:require [compojure.route :as route]]
  [:require [compojure.handler :as handler]]
  [:require [ring.util.response :as resp]]
)




(defn parse-params [params]
  (let
    [
       code (str
             "("
             (if (:action params) "webapp.server.fns/" "webapp.framework.server.systemfns/")
             (if (:action params) (:action params) (:systemaction params))
             " "

               (str
                (:params params))
             ")")
      ]
      (println ":" code)
      (pr-str (load-string code))
     ))





(defroutes main-routes
  (POST "/:domain/action" {params :params}
    (parse-params  params))
  (POST "/action" {params :params}
    (parse-params  params))

  (GET "/" [] (resp/redirect "main.html"))

  (route/resources "/:domain/")
  (route/resources "/")

  (route/not-found "<h1>Page not found</h1>")
)

(defn wrap-dir-index [handler]
  (fn [req]
    (handler
     (update-in req [:uri]
                #(if (= "/" %) "/main.html" %)))))


(def app
    (-> (handler/api main-routes)
        (wrap-json-params)
     ;   (wrap-dir-index)
        ))

