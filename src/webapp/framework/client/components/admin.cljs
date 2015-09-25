(ns webapp.framework.client.components.admin
  (:require
   [webapp.framework.client.coreclient   :as c :include-macros true])


	(:use
		[webapp.framework.client.system-globals  :only  [
																										 client-data-windows
																										 client-query-cache
																										 ]])
   )

(c/ns-coils 'webapp.framework.client.components.admin)




(c/defn-ui-component     admin-view-show-data-source-def   [table-def]
  (c/container
   nil

   (c/div {:style {:color  "blue"}}
		  (c/container
		   (c/inline "50%" (c/text (str "type" )))
		   (c/inline "50%" (c/text (c/read-ui table-def [:type])))))

   (c/div {:style {:color  "green"}}
		  (c/container
		   (c/inline "50%" (c/text (str "table" )))
		   (c/inline "50%" (c/text (c/read-ui table-def [:table])))))

   (c/div {:style {:color  "blue"}}
		  (c/container
		   (c/inline "50%" (c/text (str "primary key" )))
		   (c/inline "50%" (c/text (pr-str (c/read-ui table-def [:primary-key]))))))

   (c/div {:style {:color  "green"}}
		  (c/container
		   (c/inline "50%" (c/text (str "fields" )))
		   (c/inline "50%" (c/text (pr-str (c/read-ui table-def [:fields]))))))


   (c/div {:style {:color  "blue"}}
		  (c/container
		   (c/inline "50%" (c/text (str "allow inserts" )))
		   (c/inline "50%" (c/text (pr-str (c/read-ui table-def [:allow-inserts]))))))

   (c/div {:style {:color  "green"}}
		  (c/container
		   (c/inline "50%" (c/text (str "allow updates" )))
		   (c/inline "50%" (c/text (pr-str (c/read-ui table-def [:allow-updates]))))))

   ))










(c/defn-ui-component     admin-view-show-data-source-data   [table-data]
  (c/container
   nil

   (c/div {:style {:color  "blue"}}
		  (c/container
		   (c/inline "50%" (c/text (str "count" )))
		   (c/inline "50%" (c/text (count (c/read-ui table-data [:values]))))))))











(c/defn-ui-component     admin-view-list-data-sources   [data-sources]

  (let [
        use-source    (c/read-ui data-sources [:data-source])
	    	view          (c/read-ui data-sources [:data-view])
	    	]

	(c/div nil
		   (c/map-many
			#(c/container

			  (let [table-name   (str (name  (-> (second %) :def :table)))
					data-source  (first %)]

				(if (or (nil? use-source)
						(= use-source  data-source))

				  (c/div {:style {:color  "black"}}
						 (c/inline "100px" (c/div nil table-name))
						 (c/inline "100px" (c/div {:style {:fontSize "12px" :padding "7px"}
												   :onClick
												   (fn [e] (do
															 (c/write-ui
															  data-sources
															  [:data-source]
															  data-source)

															 (c/write-ui
															  data-sources
															  [:data-view]
															  "defn")
															 ))} "Defn"))
						 (c/inline "100px" (c/div {:style {:fontSize "12px" :padding "7px"}
												   :onClick
												   (fn [e] (do
															 (c/write-ui
															  data-sources
															  [:data-source]
															  data-source)

															 (c/write-ui
															  data-sources
															  [:data-view]
															  "data")
															 ))
												   } "Data"))

						 ))))
			(c/read-ui data-sources [:values])
			)
            (cond
			 (and use-source (= view "defn"))

			  (c/component admin-view-show-data-source-def
						   (c/read-ui data-sources
									 [:values (keyword use-source) :def]) [])

			 (and use-source (= view "data"))

			  (c/component admin-view-show-data-source-data
						   (c/read-ui data-sources
									 [:values (keyword use-source) :data]) []))

         (c/div nil "List of data sources")

         )))






(c/defn-ui-component     admin-view-list-views   [data-sources]

  (c/div nil
				 (c/h2 nil "Views")
		 (c/map-many
		  #(c/div
				{:onClick (fn[x] (js/alert (pr-str (get  @client-data-windows %))))}
		      (pr-str (get  % :path) (get  % :fields) (get  % :db-table) (get  % :where) (get  % :params) ))
		     ;(c/read-ui data-sources [:values])
		     ;["s" "dd"]
			(keys @client-data-windows)
		  )
       ))



(c/defn-ui-component     admin-view-list-queries   [data-sources]

												 (c/div nil
																(c/h2 nil "Queries")
																(c/map-many
																	#(c/div
																		{:onClick (fn[x] (js/alert (pr-str (get  @client-query-cache %))))}
																		(pr-str %   ))
																	;(c/read-ui data-sources [:values])
																	;["s" "dd"]
																	(keys @client-query-cache)
																	)
																))



(c/defn-ui-component     admin-view   [app]

  (c/div nil
       (c/div nil "Coils admin")

		 (c/container
		  (c/inline "50px" (c/div {:style {:fontSize "12px"}
						 :onClick
								   #(do
									  (c/write-ui  app [:system :ui :tab :value] "data sources")
									  (c/write-ui  app [:system :ui :tab-detail :value] {})
									  (c/write-ui  app [:system :ui :data-sources :data-source] nil)
									  (c/write-ui  app [:system :ui :data-sources :data-source-detail] nil)
									  )
						 } "sources"))
		   (c/inline "50px" (c/div {:style {:fontSize "12px"}
									:onClick #(do
												(c/write-ui  app [:system :ui :tab :value] "data views")
												(c/write-ui  app [:system :ui :tab-detail :value] {})
									 )
						 } "views"))

			(c/inline "50px" (c/div {:style {:fontSize "12px"}
															 :onClick #(do
																					(c/write-ui  app [:system :ui :tab :value] "data queries")
																					(c/write-ui  app [:system :ui :tab-detail :value] {})
																					)
															 } "queries"))

		  )




		 (cond
		  (= (c/read-ui  app [:system :ui :tab :value]) "data sources")
		  (c/component  admin-view-list-data-sources  app  [:system :ui :data-sources])

		  (= (c/read-ui  app [:system :ui :tab :value]) "data views")
		  (c/component  admin-view-list-views  app  [:system :ui :data-sources])


			(= (c/read-ui  app [:system :ui :tab :value]) "data queries")
			(c/component  admin-view-list-queries  app  [:system :ui :data-sources])
		  )
		 ))


