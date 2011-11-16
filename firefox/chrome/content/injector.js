if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

com.threebeats.Injector = {
    styleSheetService : Components.classes["@mozilla.org/content/style-sheet-service;1"]
            .getService(Components.interfaces.nsIStyleSheetService),

    jQueryScripts : [
                "jquery-latest.min.js",
                "jpopup.js"
            ],

    invalidURL : [
        /\.pdf$/,
        /\.md$/,
        /\.txt$/,
        /\.js$/,
        /\.css$/,
        /\.as$/,
        /\.mx$/,
        /\.cs$/,
        /\.ps$/,
        /\.properties$/,
        /\.sql$/,
        /\.tex$/,
        /\.vb$/,
        /\.vbs$/,
        /\.xml$/,
        /\.xsml$/,
        /\.xsl$/,
        /\.xsd$/,
        /\.kml$/,
        /\.wsdl$/,
        /\.jpg$/,
        /\.gif$/,
        /\.png$/,
        /content-type=text\/plain/,
        /^view-source:/,
        /^chrome:/,
        /^about:/
    ],

    isSupportedUrl : function (url) {
        with (com.threebeats.Injector) {
            for (var i = 0; i < invalidURL.length; i++) {
                if (url.search(invalidURL[i]) != -1) {
                    return false;
                }
            }

            return true;
        }
    },

    injectPopupCode : function(doc) {
        with (com.threebeats) {
            Injector._injectJQueryScripts(doc);

            var unsafeWin = doc.defaultView;
            if (unsafeWin.wrappedJSObject) {
                unsafeWin = unsafeWin.wrappedJSObject;
            }

            var script = Injector._loadPopupJS();
            script = "(function() {var popupHTML = '" + Injector._loadPopupHTML() + "';\n" + script + "})()";

            Injector.injectJavaScript(doc, script);
            Injector.injectCSS();
        }
    },

    _injectJQueryScripts : function(doc) {
        with (com.threebeats) {
            var heads = doc.getElementsByTagName("head");
            if (heads.length == 0) {
                return;
            }

            var head = heads[0];
            for (var i = 0; i < Injector.jQueryScripts.length; i++) {
                var element = doc.createElement("script");
                element.setAttribute("type", "application/x-javascript");
                element.innerHTML = Injector._loadJS("chrome://threebeats/content/inject/" + Injector.jQueryScripts[i]);

                head.appendChild(element);
            }
        }
    },

    injectJavaScript : function(doc, script) {

        var element = doc.createElement("script");
        element.setAttribute("type", "application/x-javascript");
        element.innerHTML = script;

        var heads = doc.getElementsByTagName("head");
        if (heads.length == 0) {
            return;
        }

        var head = heads[0];
        head.appendChild(element);
    },

    injectCSS : function() {
        with (com.threebeats) {
            Injector.styleSheetService.loadAndRegisterSheet(
                    IO.newURI("chrome://threebeats/content/inject/threebeats_popup.css"),
                    Components.interfaces.nsIStyleSheetService.USER_SHEET);
        }
    },

    _loadJS : function(URI) {
        return com.threebeats.IO.getUrlContents(URI);
    },

    _loadPopupJS : function() {
        return com.threebeats.Injector._loadJS("chrome://threebeats/content/inject/popup.js");
    },

    _loadPopupHTML : function() {
        var result = com.threebeats.IO.getUrlContents("chrome://threebeats/content/inject/popup.html");

        return  result.
                replace(/'/g, "\\'").
                replace(/\r\n/g, "' +\r\n'");
    }
};