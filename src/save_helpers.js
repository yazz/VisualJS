'use strict';

module.exports = {

     insertCodeString: function(code,st, vall ,optionalEnd) {
         var endIndicator = ")"
         if (optionalEnd) {
             endIndicator = optionalEnd
         }
        var findd = st + "("
        var startIndexOfComment = code.toString().indexOf("/*")
        var startIndexOfFn = code.toString().indexOf("{")

        if (startIndexOfFn != -1) {
            if (startIndexOfComment == -1) {
                code = code.toString().substring(0,startIndexOfFn + 1) + "\n/*\n*/\n" +
                    code.toString().substring(startIndexOfFn + 1)
                startIndexOfComment = code.toString().indexOf("/*")
            }
            code = code.toString().substring(0,startIndexOfComment + 3) +
                            "" + st + "(" + JSON.stringify(vall,null,2) + endIndicator + "\n" +
                            code.toString().substring(startIndexOfComment + 3)

        }

        return code

    },






     deleteCodeString: function(code,st ,optionalEnd) {
         var endIndicator = ")"
         if (optionalEnd) {
             endIndicator = optionalEnd
         }
        var findd = st + "("
        var codeStart = code.toString().indexOf(findd)
        if (codeStart != -1) {
            var codeEnd = codeStart + code.toString().substring(codeStart).indexOf(endIndicator)

            code = code.toString().substring(0,codeStart) +
                            code.toString().substring(codeEnd + 1 + endIndicator.length)

            return code
        }
        return code
    },



     getValueOfCodeString: function(code, st,optionalEnd) {
        var endIndicator = ")"
        if (optionalEnd) {
            endIndicator = optionalEnd
        }
        var toFind = st + "("
        if (code.toString().indexOf(toFind) != -1) {
            var codeStart = code.toString().indexOf(toFind) + toFind.length
            var codeEnd = codeStart + code.toString().substring(codeStart).indexOf(endIndicator)

            code = code.toString().substring(codeStart, codeEnd)
            var val = eval( "(" + code.toString() + ")")
            return val

            }
            return null
    },

    replaceBetween: function(target, start, end, replaceWith) {
                                        var startIndex = target.indexOf(start) + start.length
                                        var endIndex = target.indexOf(end)
                                        var newString = target.substring(0,startIndex) + replaceWith + target.substring(endIndex);
                                        return newString
                                    }
}
