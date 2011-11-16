if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

if (!com.threebeats.main) {
    com.threebeats.main = function() {
    };
}

com.threebeats.main = {
    URL_WELCOME : "http://3beats.com/ff_signup",

    onLoad : function(e) {
        try {
            with (com.threebeats) {
                Log.log("~onLoad~");
                if (Prefs.isFirstRun()) {
                    main.openWelcomePage();
                    Prefs.setFirstRun(false);
                }

                Update.scheduleUpdateTimer();
                Update.connectAndUpdate();

                var appContent = document.getElementById("appcontent");
                appContent.addEventListener("DOMContentLoaded", function(e) {
                    var doc = e.originalTarget;

                    if (doc.defaultView.self == doc.defaultView.top) {
                        com.threebeats.main.pageLoaded(doc);
                    }
                }, true);
            }
        } catch (ex) {
            alert(ex);
            Components.utils.reportError(ex);
        }
    },

    openWelcomePage : function() {
        with (com.threebeats) {
            main._timer = Components.classes["@mozilla.org/timer;1"]
                    .createInstance(Components.interfaces.nsITimer);

            main._timer.initWithCallback({notify : function(timer) {
                gBrowser.selectedTab = gBrowser.addTab(main.URL_WELCOME);
            }}, 1500, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
        }
    },

    pageLoaded : function(doc) {
        with (com.threebeats) {
            if (!doc.location) {
                return;
            }
            
            var url = doc.location.toString();

            Log.log("doc.location.toString(): " + doc.location.toString());

            var rule = WhiteList.testDomain(url);
            Log.log("WhiteList.testDomain(doc.location.toString()): " + rule);
            Log.log("Injector.isSupportedUrl(url): " + Injector.isSupportedUrl(url));

            if (rule && Injector.isSupportedUrl(url)) {
                Highlighter.highlightDoc(doc, rule);
            }
        }
    }
};

window.addEventListener("load", com.threebeats.main.onLoad, false);
