(defproject org.clojars.zubairq/coils "0.7.5-beta"
  :dependencies [
                  [org.clojure/clojure "1.8.0" :scope "provided"]
                  [org.clojure/clojurescript "1.9.89" :scope "provided"]
                  [org.omcljs/om "1.0.0-alpha30"]
                  [org.clojure/core.async "0.2.374" :scope "provided"]

                  [korma "0.4.2"]

                  [org.postgresql/postgresql "9.2-1004-jdbc41"]
                  [org.clojars.gukjoon/ojdbc "1.4"]
                  ; [com.oracle/ojdbc "12.1.0.2"]

                  [compojure "1.4.0"]
                  [ring "1.4.0"]
                  [ring-middleware-format "0.7.0"]
                  [rewrite-clj "0.2.0"]
                  ;[org.jasypt/jasypt "1.9.2"]
                  [clj-http "2.0.0"]
                  [cheshire "5.5.0"]
                  ;[ankha "0.1.4"]
                  [overtone/at-at "1.2.0"]
                  [org.clojure/tools.nrepl "0.2.11"]
                  [instaparse "1.4.1"]

                  [me.raynes/fs "1.4.6"]
                  [me.raynes/conch "0.8.0"]

                  [ring/ring-json "0.4.0"]

                  [org.webjars/codemirror "5.8"]

                  [org.clojure/tools.reader "1.0.0-alpha3"]
                  [lein-figwheel "0.5.0-6"]

                  [bk/ring-gzip "0.1.1"]

                  [com.lucasbradstreet/cljs-uuid-utils "1.0.2"]
                  [com.lucasbradstreet/instaparse-cljs "1.4.1.0"]
                  ]
  :repositories {"sonatype-oss-public"
                 "https://oss.sonatype.org/content/groups/public/"}

  :url "http://org.clojars.zubair/coils"

  :jvm-opts ["-Xmx4g"]

  :plugins  [
             [lein-cljsbuild "1.1.3"]
             [lein-httpd "1.0.0"]
             [lein-ring "0.9.7"]
             [lein-figwheel "0.5.0-6"]
             ]

  :profiles {
             :dev
             {
              :figwheel {
                         :websocket-host "localhost"
                         :server-port 3449
                         :http-server-root "public" ;; this will be in resources/
                         :ring-handler    webapp.framework.server.core/app
                         :css-dirs ["resources/public"]
                         :on-jsload "webapp.framework.client.main/figwheel-update"
                         }

              :source-paths ["src" "srcfig" "../srcdev"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src" "srcfig" "../srcdev"]
                 :compiler     {
                                ;:preamble       ["public/react.min.js"]
                                :output-to      "resources/public/main.js"
                                :output-dir     "resources/public/out/"
                                :optimizations  :none
                                ;:output-wrapper false
                                ;:externs        ["resources/public/google_maps_api_v3_11.js"]
                                ;:pretty-print   false
                                :cache-analysis true
                                :source-map-timestamp true
                                :source-map true }}]}}






















              ;----------------------------------------------------------------------------------
              ; this is used for development for the little sandbox window showing an apps output
              ; in the AppShare IDE
              ;----------------------------------------------------------------------------------
              :baseidehost {
                :figwheel     false

                :cljsbuild {
                  :builds [ {
                      :source-paths [ "src"  "idesandboxcode"  "srcidehost"]

                      :target-path    "targetide"

                      :compiler     { :target-path    "targetide"
                                      :output-to      "resources/public/mainide.js"
                                      :static-fns      true
                                      :optimizations  :simple
                                      :optimize-constants true
                                      }}]}}

































             :baseidehostsrc
             {
              :figwheel     false
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src"  "idesandboxcode" "srcidehost"]
                 :target-path "targetide"
                 :compiler     {
                                :target-path    "targetide"
                                :output-dir     "resources/public/outide"
                                :output-to      "resources/public/mainidesrc.js"
                                :static-fns true
                                :optimizations  :none
                                 }}]}}









             :prodidehost
             {
              :figwheel     false
              :target-path "targetide"
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src"  "idesandboxcode" "../srcprodidehost"]
                 :target-path "targetide"
                 :compiler     {
                                :target-path "targetide"
                                :output-to      "resources/public/mainide.js"
                                :optimizations  :simple
                                :static-fns true
                                 }}]}}



             :prodidehostsrc
             {
              :figwheel     false
              :target-path "targetide"
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src"  "idesandboxcode" "../srcprodidehost"]
                 :target-path "targetide"
                 :compiler     {
                                :target-path "targetide"
                                :output-to      "resources/public/mainidesrc.js"
                                :output-dir     "resources/public/outide"
                                :optimizations  :none
                                :static-fns true
                                 }}]}}










;--------------------------------------------------------------------------------------------------------


             :base
             {
              :figwheel {
                         :websocket-host     "localhost"
                         :server-port         3449
                         :http-server-root   "public" ;; this will be in resources/
                         :ring-handler        webapp.framework.server.core/app
                         :css-dirs          ["resources/public"]
                         :on-jsload          "webapp.framework.client.main/figwheel-update"
                         }

              :source-paths ["src" "srcfig" "srcbase"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src" "srcfig" "srcbase"]
                 :compiler     {
                                ;:preamble       ["public/react.min.js"]
                                :output-to      "resources/public/main.js"
                                :output-dir     "resources/public/out/"
                                :optimizations  :none
                                ;:output-wrapper false
                                ;:externs        ["resources/public/google_maps_api_v3_11.js"]
                                ;:pretty-print   false
                                :cache-analysis true
                                :source-map-timestamp true
                                :source-map true }}]}}

;--------------------------------------------------------------------------------------------------------


             :basehost
             {
              :figwheel {
                         :websocket-host    "localhost"
                         :server-port        3449
                         :http-server-root  "public" ;; this will be in resources/
                         :ring-handler       webapp.framework.server.core/app
                         :css-dirs         ["resources/public"]
                         :on-jsload         "webapp.framework.client.main/figwheel-update"
                         }

              :source-paths ["src" "srcfig" "idecode" "srcbasehost"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src" "srcfig" "idecode" "srcbasehost"]
                 :compiler     {
                                ;:preamble       ["public/react.min.js"]
                                :output-to      "resources/public/main.js"
                                :output-dir     "resources/public/out/"
                                :optimizations  :none
                                ;:output-wrapper false
                                ;:externs        ["resources/public/google_maps_api_v3_11.js"]
                                ;:pretty-print   false
                                :cache-analysis true
                                :source-map-timestamp true
                                :static-fns true
                                :source-map true }}]}}

;--------------------------------------------------------------------------------------------------------





             :test
             {
              :source-paths ["src" "../srctest"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src"]
                 :compiler     {
                                :output-to      "resources/public/main.js"
                                :optimizations  :advanced
                                :output-wrapper false
                                :externs        ["resources/public/jquery-externs.js"
                                                 "resources/public/google_maps_api_v3_11.js"
                                                 "resources/public/reactextern.js"]
                                :pretty-print   false
                                :foreign-libs [{:file "https://maps.googleapis.com/maps/api/js?sensor=false"
                                                :provides  ["google.maps" "google.maps.MapTypeId"]}]
                                }
                 }
                ]

               }
              }



             :hosttest
             {
              :figwheel     false
              :source-paths ["src" "idecode" "../srchosttest"]
              :cljsbuild
              {
               :builds
               [
                {
                 :figwheel     false
                 :source-paths ["src"]
                 :compiler     {
                 :figwheel     false
                                :output-to      "resources/public/main.js"
                                :optimizations  :advanced
                                :preamble         ["resources/public/react.min.js"]
                                :pretty-print      false
                                }
                 }
                ]

               }
              }


             :hostprod
             {
              :figwheel     false
              :source-paths ["src" "idecode" "../srchostprod"]
              :cljsbuild
              {
               :builds
               [
                {
                 :figwheel     false
                 :source-paths ["src"]
                 :compiler     {
                 :figwheel     false
                                :output-to      "resources/public/main.js"
                                :optimizations  :advanced
                                :static-fns true
                                :preamble         ["resources/public/react.min.js"
                                                   "resources/public/react-dom.min.js"]
                                :pretty-print      false
                                }
                 }
                ]

               }
              }



             :prod
             {
              :figwheel     false
              :source-paths ["src" "../srcprod"]
              :cljsbuild
              {
               :builds
               [
                {
                 :figwheel     false
                 :source-paths ["src"]
                 :compiler     {
                 :figwheel     false
                                :output-to      "resources/public/main.js"
                                :optimizations  :advanced
                                :preamble         ["resources/public/react.min.js"]
                                :pretty-print      false
                                }
                 }
                ]

               }
              }
             }


  :ring {:init       webapp.server.fns/main-init
         :handler    webapp.framework.server.core/app}


  )
