(ns myappshare.login-or-join
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
   [webapp.framework.client.system-globals :only  [appshare-dev-server appshare-dev-port]])

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'myappshare.login-or-join)









(defn-ui-component     join-component-email-field   [app]  {}
  (let [response         (read-ui app [:join-email-response])
        if-error         (fn [on-error on-normal] (if (:error response) on-error on-normal))
        error-message    (:error response)
        success-message  (:success response)
        ]

  (div nil
       (container
         (span {:style {:color (if-error "red" "lightgreen")}}
               (str
                 (cond
                   error-message            error-message
                   success-message          "Email OK")))


         (if (:user-already-exists response)
           (span {:style {:color "red" :marginLeft "30px" :textDecoration "underline"}
                  :onClick     #(do
                                  (write-ui app [:mode] "login")
                                  )} "Click here to login instead")))


       (input-field {:style {:padding "10px" :color "black" :fontSize "2em"}
                     :placeholder  "Your email address" :preserveContents true
                     :sendOnKeypress true}
                    app
                    (fn [join-with-email]
                      (go
                        (write-ui app [:email] join-with-email)
                        (let [
                               email-join-response   (remote !join-with-email {:email join-with-email})
                               ]
                          (write-ui app [:join-email-response] email-join-response)
                          ))))




       ;(div nil (pr-str response))
       )))








(defn-ui-component     join-component-password-field   [app]  {}
  (div nil
       (div {:style {:color (if (:error (read-ui app [:choose-password-response])) "red" "lightgreen")}}
            (str
                 (cond
                   (:error (read-ui app [:choose-password-response]))
                   (:error (read-ui app [:choose-password-response]))

                   (:success (read-ui app [:choose-password-response]))
                   "Password OK")))

       (input-field {:style {:padding "10px" :color "black" :fontSize "2em"}
                     :placeholder  "Choose a password" :type "password" :preserveContents true :sendOnKeypress true}
                    app
                    (fn [join-with-password]
                      (go
                        (write-ui app [:password] join-with-password)
                        (let [password-join-response
                              (remote !join-with-password {:password join-with-password})]
                          (write-ui app [:choose-password-response] password-join-response )
                          ))))))







(defn-ui-component     join-component-confirm-password-field   [app]  {}
  (div nil
       (div {:style {:color (if (:error (read-ui app [:confirm-password-response])) "red" "lightgreen")}}
            (str
                 (cond
                   (:error (read-ui app [:confirm-password-response]))
                   (:error (read-ui app [:confirm-password-response]))

                   (:success (read-ui app [:confirm-password-response]))
                   "Passwords match")))

       (input-field {:style {:padding "10px" :color "black" :fontSize "2em"}
                     :placeholder  "Reenter password" :type "password" :preserveContents true :sendOnKeypress true}
                    app
                    (fn [join-with-confirm-password]
                        (go
                          (write-ui app [:confirm-password] join-with-confirm-password)
                          (let [confirm-password-join-response
                                (remote !join-with-password-confirm {:password   (read-ui app [:password])
                                                                     :confirm-password join-with-confirm-password})]
                            (write-ui app [:confirm-password-response] confirm-password-join-response)
                          ))))))








(defn-ui-component     join-component-submit-button   [app]  {}
  (div nil
       (button {:disabled (not (and (:success (read-ui app [:choose-password-response])) (:success (read-ui app [:confirm-password-response])) (:success (read-ui app [:join-email-response]))))
                :className "btn btn-lg" :style {:backgroundColor "#2B61CC" :fontSize "2em"}
                :onClick #(go
                            (let [email      (read-ui app [:email])
                                  password   (read-ui app [:password])
                                  join-response   (remote !join-go-pressed {:email     email
                                                                            :password  password})
                                  ]
                              (write-ui app [:join-response] join-response)))
                } "Go")

       ;(div nil (pr-str (read-ui app [:join-response])))
       ))






(defn-ui-component     join-component   [app]  {}


  (div {:style {:marginLeft "15px" :fontFamily "Ubuntu"}}
       (div {:style {:display "inline-block" :fontFamily "Ubuntu" :fontSize "3em" :marginTop "20px"}}
               "Join")

       (div {:style {:height "15px"}})
       (component   join-component-email-field   app [])


       (div {:style {:height "35px"}})
       (component   join-component-password-field   app [])



       (div {:style {:height "10px"}})
       (component   join-component-confirm-password-field   app [])


       (div {:style {:height "10px"}})
       (component   join-component-submit-button   app [])

       )
  )


















(defn-ui-component     login-component   [app]  {}


  (div {:style {:marginLeft "5px" :fontFamily "Ubuntu"}}
       (div {:style {:display "inline-block"  :fontSize "1em"}}
               "Login")
       )
  )








