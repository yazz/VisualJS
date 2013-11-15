(ns webapp.framework.client.help

  ;----------------------------------------
  (:require
    [goog.net.XhrIo          :as xhr]
    [clojure.browser.repl    :as repl]
    [cljs.reader             :as reader]
    [goog.net.XhrIo]
    [goog.dom]
    [goog.events]
    [crate.core :as crate]
  )

  ;----------------------------------------
  (:use
    [domina :only [append! by-id value destroy! ]]
    [domina.events :only [listen!]]
    [domina.xpath :only [xpath]]
    [domina.css            :only [sel]]
    [webapp.framework.client.coreclient :only [clear addto  remote  add-to]]
    [jayq.core                          :only [$ append ]]
  )

  ;----------------------------------------
  (:use-macros [crate.def-macros :only [defpartial]]
  )
)








(defn help-text []
(crate/raw "
              <div id='myModal' class='modal fade'>
              <div class='modal-dialog'>
                <div class='modal-content'>
                  <div class='modal-header'>
                    <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>
                    <h4 class='modal-title'>Modal title</h4>
                  </div>
                  <div class='modal-body'>
                    <p>One fine body&hellip;</p>
                  </div>
                  <div class='modal-footer'>
                    <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
                    <button type='button' class='btn btn-primary'>Save changes</button>
                  </div>
                </div><!-- /.modal-content -->
              </div><!-- /.modal-dialog -->
            </div><!-- /.modal -->
           "
)
)



(defn help []
  (if (not (by-id "myModal"))
      (append! (xpath "//body") (help-text))
  )

  ;(-> ($ :#main) (append "<div>GOTOMETTERUG</div>"))
  (js/showHelp)
  nil
)


