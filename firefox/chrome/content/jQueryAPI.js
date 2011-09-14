if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

if (!com.threebeats.JQuery) {
    com.threebeats.JQuery = {
        script : com.threebeats.IO.getUrlContents("chrome://threebeats/content/jquery-1.4.2.min.js"),

        getUnwrapped : function(obj) {
            while (obj.wrappedJSObject) {
                obj = obj.wrappedJSObject;
            }
            return obj;
        },

        evalInSandbox : function(win, script, vars) {
            win = com.threebeats.JQuery.getUnwrapped(win);

            var sandbox = new Components.utils.Sandbox(win);
            sandbox.window = win;
            sandbox.document = sandbox.window.document;
            sandbox.XPathResult = Components.interfaces.nsIDOMXPathResult;
            sandbox.__proto__ = win;

            if (vars) {
                for (var prop in vars) {
                    sandbox[prop] = vars[prop];
                }
            }

            return Components.utils.evalInSandbox(
                    "(function() { " + script + "\n })();", sandbox);
        },

        evalJQuery : function(doc, func, vars) {
            var win = doc.defaultView;
            with (com.threebeats) {
                var scr = JQuery.script + "return (" + func.toString() + ")()";
                return JQuery.evalInSandbox(win, scr, vars);
            }
        }
    };
}