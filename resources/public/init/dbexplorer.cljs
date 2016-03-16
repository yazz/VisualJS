(remote "!get-list-of-tables"
        {:session-id  (:session-id @webapp.framework.client.system-globals.client-session-atom)}
        (fn [result2]
            (reset! webapp.framework.client.system-globals/app-state (assoc-in @webapp.framework.client.system-globals/app-state [:ui :table-list] result2))))



(comment sql "select * from newtable" [] (fn [rr] (js/alert (pr-str rr))))



(defn-ui-component     main   [app] {}
  (div nil
       (div {:style {:fontWeight "bold"}} "List of tables")
       (map-many
         (fn [table-name]
           (div nil table-name))
         (get-in @webapp.framework.client.system-globals/app-state [:ui :table-list])
       )
   )
  )
