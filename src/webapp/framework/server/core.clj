(ns webapp.framework.server.core
  (:require [speech-synthesis.say :as say])
  [:require [webapp.server.fns]]
  [:use [webapp.framework.server.systemfns]]
  [:use [ring.middleware.format]]
  [:use [compojure.core]]
  [:use [korma.core]]
  [:use [ring.middleware.json]]
  [:require [compojure.route :as route]]
  [:require [compojure.handler :as handler]]

  [:require [ring.util.response :as resp]]


  (:use [webapp.framework.server.email-service])
)

;(println "Start talking")
;(.unbindRoot #'hear/*sample-rate*)
;(with-redefs [hear/*sample-rate* 4000]
   ; (println (hear/hear))
;(println "Done")
;(say/say "speeza din mal")
;(+ 1 1)




(comment let [amy (nn/create {:username "amy" :age 27})
        bob (nn/create {:username "bob" :age 28})
        _   (nrl/create amy bob :friend {:source "college"})
        res (cy/tquery "START x = node(*) RETURN x.username, x.age" {})]
    (println res))


 (comment let [amy (nn/create {:username "amy" :age 27})
        bob (nn/create {:username "bob" :age 28})
        _   (nrl/create amy bob :friend {:source "college"})
        res (cy/tquery "START x = node({ids}) RETURN x.username, x.age" {:ids (map :id [amy bob])})]
    (println res))

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

;(ping)

;(call-mandrill "users/info" {})

;(send-message "")

(comment send-email
     :subject         "A subject"
     :message         "from the core it was sent"
     :from-email      "zq@nemcv.com"
     :from-name       "Zubair Quraishi"
     :to-email        "zubairq@gmail.com"
     :to-name         "Zoo"
)
