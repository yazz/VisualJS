/**
 * @author Per Gravgaard, per.gravgaard@gmail.com
 * @license Copyright (c) 2011 - 2013, GrailsHouse. All rights reserved.
 * You're allowed to use this code for non-commercial purposes and as long as this copyright comment is preserved.
 */


/*
 * All popups are created with this window as the mother window. The debugged objects are saved/stored in the mother window as well.
 * @type {{popups: Array, closePopupsOnF5: boolean, closePopups: Function, createPopup: Function, htmlEncode: Function, getConstructorName: Function, debug: Function, out: Function, styleString: string, getMonitorHTML: Function, createMonitor: Function, writeMonitor: Function, showError: Function, inspect: Function, log: Function}}
 */
var dBugger = {

	popups: [],
	debuggedObjects: {},
	closePopupsOnF5: true,
	styleString: 'width:400px;height:300px;overflow:auto;border:black solid 1px;position:fixed;right:10px;bottom:60px;z-index:9999;padding:3px;font-family:verdana;font-size:8pt;opacity:.8;background-color:#fff;color:#000;filter:alpha(opacity=80);',

	getMonitorHTML: function(styleString, className) {
		var s = dBugger.styleString;
		if (typeof styleString == "string") {
			s += styleString;
		}
		if (!!window.showModalDialog && !!window.ActiveXObject && !!document.all && !!document.documentElement && typeof document.documentElement.style.maxHeight == "undefined") {
			s += 'position:absolute';
		}
		if (typeof className != "string") {
			className = 'DBuggerMonitor';
		}
		return '<div id="divMonitor" style="' + s + '" class="' + className + '" ondblclick="this.innerHTML=\'\';" title="double click to clear"><\/div>';
	},

	createMonitor: function(styleString, className) {
		if (document.body) {
			if (typeof document.body.insertAdjacentHTML != 'undefined') {
				document.body.insertAdjacentHTML('beforeend', this.getMonitorHTML(styleString, className));
			} else {
				document.body.innerHTML += this.getMonitorHTML(styleString, className);
			}
		}
	},

	writeMonitor: function(styleString, className) {
		var htm = this.getMonitorHTML(styleString, className);
		try { // if document.contentType is 'application/xhtml+xml' the write operation is not supported by (some) standard browsers
			document.writeln(htm);
		}
		catch (ex) {
			if (document.body) {
				var div = document.createElement("div");
				document.body.appendChild(div);
				div.innerHTML = htm;
			}
		}
	},

	showError: function(msg, url, line) {
		if (typeof this.onerrorCounter == "number") {
			if (this.onerrorCounter > 4) {
				return false; // only alert/log first 5 errors
			}
		} else {
			this.onerrorCounter = 0;
		}
		this.onerrorCounter++;
		if (typeof msg == "string") {
			var txt = 'JavaScript Error\n\nDescription: ' + msg;
			txt += '\nDocument: ' + url + '\nLine number: ' + line + '\nBrowser: ' + navigator.userAgent;
			if (typeof navigator.appMinorVersion == "string") {
				txt += '\nUpdates: ' + navigator.appMinorVersion;
			}
			txt += '\nPlatform: ' + navigator.platform;
			if (!dBugger.log(txt)) {
				alert(txt);
			}
		}
		return false;
	},

	closePopups: function() {
		for (var i = 0, l = this.popups.length; i < l; i++) {
			var popup = this.popups[i];
			if (!popup.closed) {
				popup.close();
			}
		}
	},

	createPopup: function(name) {
		name = name || 'DBugWindow';
		var popup = window.open("", name, "width=600,height=400,status,scrollbars,toolbar,resizable", false);
		this.popups.push(popup);
		return popup;
	},

	htmlEncode: function(s) {
		if (typeof s == "string") {
			//s = s.replace(/$(?!(amp;|#|hellip;))/g, '&amp;')//.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace('\n', '<br />');
			s = s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace('\n', '<br />');
		}
		return s;
	},

    getConstructorName: function(constructorFunction) {
        var found = /function\s([a-z]{1,}[a-z0-9]{0,})\(/i.exec(constructorFunction.toString());
        if (found) {
            return found[1];
        }
        return '';
    },

	debug: function(arg) {
		function looping(p, o) {
			var value = o[p];
			if (value === undefined) {
				value = typeof value;
			}
			else if (value === null) {
				value = 'null';
			}
			else if (typeof value == "object") {
				/*	In IE6 you can't compare the navigator object to anything but null (when referenced through a for/in loop):
					(navigator == '') or (navigator == anotherObject) will throw an error.
					Note that the clientInformation object is the same as the navigator object.	*/
			}
			else if (typeof value == "function") {
				if (value == this.debug) {
					value = 'dBugger.debug';
				}
				else if (typeof value.toString == "function") {
					value = dBugger.htmlEncode(value.toString());
				} else {
					value = 'N/A';
				}
			}
			else if (typeof value == "string" && !value) {
				value = 'the empty string';
			}
			htm += '<tr><td style="vertical-align:top;text-align:left;white-space:nowrap;"><a href="javascript:try{debugChild(\'' + p + '\');}catch(err){alert(err+\'\n\nPlease allow popups for this to work\')}">' + p + ' (' + typeof(o[p]) + ')<\/a><\/td><td style="text-align:left;">' + value + '<\/td><\/tr>\n';
		}
		var obj = null;
		if (typeof arg == "string" && arg) {
			try {
				obj = eval(arg); // evaluation of the empty string returns undefined
			}
			catch (ex) {
				obj = arg;
			}
		}
		else if (typeof arg != "undefined") {
			obj = arg;
		}
		if (obj == null) {
			alert("Unable to convert argument to object!");
			return;
		}
		var htm = '<!DOCTYPE html>\n';
		htm += '<html xmlns="http://www.w3.org/1999/xhtml" lang="en">\n<head>\n<meta charset="UTF-8">\n';
		htm += '<title>DBugger<\/title>\n';
		htm += '<script type="text/javascript">\
				var win = window.opener;\
				function debugChild(prop) {\
					if (!win || win.closed) {\
						alert(\'You closed the opener window! Please reopen it and try again.\');\
						return;\
					}\
					var obj = win.dBugger.debuggedObjects[window.name];\
					if (obj != null) {\
						if (typeof obj[prop] == "undefined") { /* this is the case if native classes have been enhanced in the mother window */\
							var n = win.dBugger.getConstructorName(obj.constructor);\
                            if (n) {\
                                obj = win[n].prototype;\
                            }\
						}\
						win.debug(obj[prop]);\
					} else {\
						alert(\'It seems that the needed object was garbage collected!\');\
					}\
				}\
				<\/script>\n';
		htm += '<\/head>\n<body>\n<table cellpadding="3" cellspacing="0" border="1" summary="Table of properties">\n<tbody>\n';
		var hasProps = false;
		for (var prop in obj) { // if obj is a XML document IE7 just stops executing without throwing any error!?
			hasProps = true;
			if (document.getElementById) {
				eval("try{looping(prop,obj);}catch(ex){htm+=ex.message;}");
			} else {
				looping(prop, obj);
			}
		}
		if (!hasProps) {
			htm += '<tr><td><strong>Object ' + obj + ' has no properties!<\/strong><\/td><\/tr>';
		}
		htm += '<\/tbody>\n<\/table>\n<\/body>\n<\/html>';
		var debugKey = "DBugWindow" + (new Date().getTime());
		this.debuggedObjects[debugKey] = arg;
		var win = this.createPopup(debugKey);
		if (win) {
			var doc = win.document;
			doc.open('text/html');
			doc.write(htm);
			doc.close();
			win.focus();
			return win;
		}
		if (confirm('Popups are blocked!\nPress OK to write, Cancel otherwise.')) {
			this.out(htm);
		}
		return null;
	},

	out: function(msg, isHTML, insertBefore) { // specify isHTML as true if you don't wan't your msg to be HTML encoded (i.e. treated as plain text)
		if (typeof isHTML != 'boolean') {
			isHTML = true;
		}
		var doc = window.document;
		var form = doc.forms['frmMonitor'];
		var field = form ? form['DebugConsole'] : doc.getElementById('txaDebugConsole');
		if (field) {
			field.value += msg + '\n';
		} else {
			var div = doc.getElementById('divMonitor');
			if (!div) {
				this.createMonitor();
				div = doc.getElementById('divMonitor');
			}
			if (div) {
				if (isHTML) {
					if (insertBefore) {
						if (typeof div.insertAdjacentHTML != 'undefined') {
							div.insertAdjacentHTML('afterbegin', msg + '<br \/>');
						} else {
							div.innerHTML = msg + '<br \/>' + div.innerHTML;
						}
					} else {
						if (typeof div.insertAdjacentHTML != 'undefined') {
							div.insertAdjacentHTML('beforeend', msg + '<br \/>');
						} else {
							div.innerHTML += msg + '<br \/>';
						}
					}
				}
				else if (doc.createElement) {
					var txt = doc.createTextNode(msg); // msg is automatically HTML encoded
					var br = doc.createElement('br');
					if (insertBefore && typeof div.firstChild == 'object') {
						div.insertBefore(br, div.firstChild);
						div.insertBefore(txt, br);
					} else {
						div.appendChild(txt);
						div.appendChild(br);
					}
				}
			}
		}
	},

	inspect: function(obj) {
		if (obj && typeof obj == "object") {
			out("************<br \/>Inspecting: " + obj);
			for (var p in obj) {
				out(p + ": " + obj[p]);
			}
			out("<br />");
		}
	},

	log: function(msg) {
		if (window.console && window.console.log) {
			window.console.log(msg);
			return true;
		}
		return false;
	}

};

window.onerror = function(msg, url, line) { dBugger.showError.apply(dBugger, [msg, url, line]); };
window.debug = function(arg) { dBugger.debug.apply(dBugger, [arg]); };
window.out = function(msg, isHTML, insertBefore) { dBugger.out.apply(dBugger, [msg, isHTML, insertBefore]); };
window.inspect = function(obj) { dBugger.inspect.apply(dBugger, [obj]); };
window.log = function(msg) { dBugger.log.apply(dBugger, [msg]); };

(function() {
	if (document.addEventListener) {
		document.addEventListener('keydown', function(e) {
			e = e || window.event;
			if (e.keyCode == 116 && dBugger.closePopupsOnF5) { // pressing F5 to reload page
				dBugger.closePopups();
			}
		}, false);
	}
})();