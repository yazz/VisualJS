(ns webapp.framework.server.email-service
  (:require [clj-http.client :as client])
  (:use [cheshire.core])
  (:use [webapp-config.settings]))



;*mandrill-api-key*




(def mandrill-url "https://mandrillapp.com/api/1.0/")







(defn method-url
  "URL for calling a method"
  [method]
  (str mandrill-url method ".json"))






(defn call-mandrill
  [method params & [opts]]

  (let [
        base-params      {:as               :xml
                          :content-type     :xml
                          :body             (generate-string (assoc params :key *mandrill-api-key*))}

        final-params     (merge base-params (:clj-http-options opts))
        ]

        (:body (client/get (method-url method) final-params))))






(defn send-email [& {:keys
        [
             message
             subject
             from-email
             from-name
             to-email
             to-name
        ]
        :or {
             subject "No subject"
            }
       }]

  (let [params   {"message" {
                    "html"         message
                    "subject"      subject
                    "from_email"   from-email
                    "from_name"    from-name,
                    "to" [
            {
                "email" to-email
                "name" to-name
            }
        ]
                  }}
        params2  {:as :json
                      :content-type :json
                      :body (generate-string (assoc params :key *mandrill-api-key*))}
      ]
    (client/post "https://mandrillapp.com/api/1.0/messages/send" params2)))








(defn send-message
  [message]
  (call-mandrill "messages/send" {:message message}))







(defn send-template
  "Send a message based on a template. Pass in a template name, message map and an optional template-content array.

  See:

  https://mandrillapp.com/api/docs/messages.html#method=send-template"
  ([template message]
    (send-template template message []))
  ([template message template-content]
    (call-mandrill "messages/send-template" {:template_name template :message message :template_content template-content})))





(defn user-info
  []
    (client/post
       (str
        "https://mandrillapp.com/api/1.0/users/info.xml?key="
        (System/getProperty "MANDRILL_API_KEY"))
      ))





(defn ping []
  (client/post
   (str
    "https://mandrillapp.com/api/1.0/users/ping.xml?key="
    (System/getProperty "MANDRILL_API_KEY"))
  ))




(defn senders
  "Return the senders that have tried to use this account, both verified and unverified.

  See:

  https://mandrillapp.com/api/docs/users.html#method=senders"
  []
  (call-mandrill "users/senders" {}))

