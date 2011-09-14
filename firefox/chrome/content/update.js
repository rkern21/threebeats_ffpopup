if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

if (!com.threebeats.Update) {
    com.threebeats.Update = function() {
    };
}

com.threebeats.Update._FOLDER_DATA = "3beatsData";

com.threebeats.Update._FILENAME_WHITELIST = "whitelist.json";
com.threebeats.Update._FILENAME_STARFILE = "starfile.json";

com.threebeats.Update._URL_WHITELIST = "http://www.3beats.com/popup/whitelist.json";
com.threebeats.Update._URL_STARFILE = "http://www.3beats.com/popup/starfile.json";

com.threebeats.Update._UPDATE_INTERVAL = 1000 * 60 * 60 * 4; // 4 hours

com.threebeats.Update._updatesTimer = null;

com.threebeats.Update.connectAndUpdate = function() {
    with (com.threebeats) {
        var starFileLength = Update._getContentLength(Update._URL_STARFILE + "?sid" + Math.random());
        var whiteListLength = Update._getContentLength(Update._URL_WHITELIST + "?sid" + Math.random());

        var updateStarFile = starFileLength != Prefs.getStarFileLength();
        var updateWhiteList = whiteListLength != Prefs.getWhiteListLength();

        Update._doUpdate(updateStarFile, updateWhiteList);
    }
};

com.threebeats.Update._getContentLength = function(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('HEAD', url, false);

    xmlhttp.setRequestHeader("Pragma", "no-cache");
    xmlhttp.setRequestHeader("Cache-Control", "must-revalidate");
    xmlhttp.setRequestHeader("Cache-Control", "no-cache");
    xmlhttp.setRequestHeader("Cache-Control", "no-store");
    xmlhttp.setRequestHeader("Expires", 0);
    xmlhttp.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT" );

    xmlhttp.send(null);

    return xmlhttp.getResponseHeader('Content-Length');
};

com.threebeats.Update.scheduleUpdateTimer = function() {
    with (com.threebeats.Update) {
        _updatesTimer = Components.classes["@mozilla.org/timer;1"]
                .createInstance(Components.interfaces.nsITimer);

        _updatesTimer.initWithCallback({notify : function(timer) {
            connectAndUpdate();
        }}, _UPDATE_INTERVAL, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
    }
};

com.threebeats.Update._doUpdate = function(updateStarFile, updateWhiteList) {
    with (com.threebeats) {
        if (updateStarFile) {
            Update.updateStarFile();
        }
        Highlighter.load();

        if (updateWhiteList) {
            Update.updateWhiteList();
        }
        WhiteList.load();
    }
};

com.threebeats.Update.updateStarFile = function() {
    with (com.threebeats) {
        let file = Update.getStarFile();

        Update._updateFile(Update._URL_STARFILE, file);
        Prefs.setStarFileLength(file.fileSize);
    }
};

com.threebeats.Update.updateWhiteList = function() {
    with (com.threebeats) {
        let file = Update.getWhiteListFile();
        Update._updateFile(Update._URL_WHITELIST, file);
        Prefs.setWhiteListLength(file.fileSize);
    }
};

com.threebeats.Update._updateFile = function(url, file) {
    with (com.threebeats) {
        var content = IO.ajax(url);
        IO.saveToFile(file, content);
    }
};

com.threebeats.Update._getFile = function(fileName) {
    var file = Components.classes["@mozilla.org/file/directory_service;1"].
            getService(Components.interfaces.nsIProperties).
            get("ProfD", Components.interfaces.nsIFile);

    with (com.threebeats.Update) {
        file.append(_FOLDER_DATA);
        file.append(fileName);
    }

    return file;
};

com.threebeats.Update.getWhiteListFile = function() {
    with (com.threebeats.Update) {
        return _getFile(_FILENAME_WHITELIST);
    }
};

com.threebeats.Update.getStarFile = function() {
    with (com.threebeats.Update) {
        return _getFile(_FILENAME_STARFILE);
    }
};