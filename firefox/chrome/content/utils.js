if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

if (!com.threebeats.Prefs) {
    com.threebeats.Prefs = function() {
    };
}

com.threebeats.Prefs._THREEBEATS_PREF_BRANCH = "extensions.threebeats";
com.threebeats.Prefs._PREF_FIRST_RUN = "extensions.threebeats.first_run";
com.threebeats.Prefs._PREF_LAST_UPDATE = "extensions.threebeats.last_update";

com.threebeats.Prefs._PREF_STARFILE_LENGTH = "extensions.threebeats.starfile_length";
com.threebeats.Prefs._PREF_WHITELIST_LENGTH = "extensions.threebeats.whitelist_length";

com.threebeats.Prefs._prefService = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefBranch);

com.threebeats.Prefs._getBoolPref = function(prefName, prefDef) {
    with (com.threebeats.Prefs) {
        try {
            return _prefService.getBoolPref(prefName);
        } catch(e) {
            _setBoolPref(prefName, prefDef);
            return prefDef;
        }
    }
};

com.threebeats.Prefs._setBoolPref = function(prefName, value) {
    com.threebeats.Prefs._prefService.setBoolPref(prefName, value);
};

com.threebeats.Prefs._getIntPref = function(prefName, prefDef) {
    with (com.threebeats.Prefs) {
        try {
            return _prefService.getIntPref(prefName);
        } catch(e) {
            _setIntPref(prefName, prefDef);
            return prefDef;
        }
    }
};

com.threebeats.Prefs._setIntPref = function(prefName, value) {
    com.threebeats.Prefs._prefService.setIntPref(prefName, value);
};

com.threebeats.Prefs.removeAll = function() {
    with (com.threebeats.Prefs) {
        _prefService.deleteBranch(_THREEBEATS_PREF_BRANCH);
    }
};

com.threebeats.Prefs.getLastUpdateTime = function() {
    with (com.threebeats.Prefs) {
        return _getIntPref(_PREF_LAST_UPDATE, 0);
    }
};

com.threebeats.Prefs.setLastUpdateTime = function(time) {
    with (com.threebeats.Prefs) {
        return _setIntPref(_PREF_LAST_UPDATE, time);
    }
};

com.threebeats.Prefs.getStarFileLength = function() {
    with (com.threebeats.Prefs) {
        return _getIntPref(_PREF_STARFILE_LENGTH, 0);
    }
};

com.threebeats.Prefs.setStarFileLength = function(val) {
    with (com.threebeats.Prefs) {
        return _setIntPref(_PREF_STARFILE_LENGTH, val);
    }
};

com.threebeats.Prefs.getWhiteListLength = function() {
    with (com.threebeats.Prefs) {
        return _getIntPref(_PREF_WHITELIST_LENGTH, 0);
    }
};

com.threebeats.Prefs.setWhiteListLength = function(val) {
    with (com.threebeats.Prefs) {
        return _setIntPref(_PREF_WHITELIST_LENGTH, val);
    }
};

com.threebeats.Prefs.isFirstRun = function() {
    with (com.threebeats.Prefs) {
        return _getBoolPref(_PREF_FIRST_RUN, true);
    }
};

com.threebeats.Prefs.setFirstRun = function(value) {
    with (com.threebeats.Prefs) {
        _setBoolPref(_PREF_FIRST_RUN, value);
    }
};

//     Logging Utilities      //
////////////////////////////////

if (!com.threebeats.Log) {
    com.threebeats.Log = function() {
    };
}

com.threebeats.Log._consoleService = Components.classes["@mozilla.org/consoleservice;1"].
        getService(Components.interfaces.nsIConsoleService);

com.threebeats.Log.log = function(msg) {

    if (!msg) {
        return;
    }

    com.threebeats.Log._consoleService.logStringMessage(msg);
};

//      JSON Utilities        //
////////////////////////////////

if (!com.threebeats.JsonUtils) {
    com.threebeats.JsonUtils = function() {
    };
}

com.threebeats.JsonUtils.decode = function(str) {
    return Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON).decode(str);
};

com.threebeats.JsonUtils.encode = function(obj) {
    return Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON).encode(obj);
};


if (!com.threebeats.ArrayUtils) {
    com.threebeats.ArrayUtils = {};
}

com.threebeats.ArrayUtils.contains = function(arr, e) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == e) {
            return true;
        }
    }

    return false;
};

//      IO Utilities        //
////////////////////////////////


if (!com.threebeats.IO) {
    com.threebeats.IO = function() {
    };
}

com.threebeats.IO._ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

com.threebeats.IO.saveToFile = function(aFile, content) {
    com.threebeats.Log.log("aFile.path: " + aFile.path);

    if (!aFile.exists()) {
        aFile.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 600);
    }

    var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].
            createInstance(Components.interfaces.nsIFileOutputStream);
    stream.init(aFile, 0x04 | 0x08 | 0x20, 0600, 0); // write, create, truncate

    stream.write(content, content.length);
    if (stream instanceof Components.interfaces.nsISafeOutputStream) {
        stream.finish();
    } else {
        stream.close();
    }
};


com.threebeats.IO.getUrlContents = function(aUrl) {
    var scriptableStream = Components
            .classes["@mozilla.org/scriptableinputstream;1"]
            .getService(Components.interfaces.nsIScriptableInputStream);

    var channel = com.threebeats.IO._ioService.newChannel(aUrl, null, null);
    var input = channel.open();
    scriptableStream.init(input);

    var str = scriptableStream.read(input.available());
    scriptableStream.close();
    input.close();

    return str;
};

com.threebeats.IO.ajax = function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);

    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.setRequestHeader("Cache-Control", "must-revalidate");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Cache-Control", "no-store");
    xhr.setRequestHeader("Expires", 0);
    xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT" );

    xhr.send(null);

    return xhr.responseText;
};

com.threebeats.IO.newURI = function(aURL) {
    return com.threebeats.IO._ioService.newURI(aURL, null, null);
};

com.threebeats.IO.getContentFromFile = function(aFile) {
    // open file stream
    var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].
            createInstance(Components.interfaces.nsIFileInputStream);
    stream.init(aFile, 0x01, 0, 0);

    var converted = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
            createInstance(Components.interfaces.nsIConverterInputStream);
    converted.init(stream, "UTF-8", 1024,
            Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

    // read in contents
    var str = {};
    var jsonStr = "";
    while (converted.readString(4096, str) != 0) {
        jsonStr += str.value;
    }

    converted.close();

    if (jsonStr.length == 0) {
        return; // empty file
    }

    return jsonStr;
};
