if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

if (!com.threebeats.WhiteList) {
    com.threebeats.WhiteList = function() {
    };
}

com.threebeats.WhiteList._rules = [];

com.threebeats.WhiteList.load = function() {
    with (com.threebeats) {
        var file = Update.getWhiteListFile();

        if (!file.exists()) {
            Update.updateWhiteList();
        }

        var content = IO.getContentFromFile(file);

        WhiteList._rules = JsonUtils.decode(content);
        for (var i=0; i < WhiteList._rules.length; i++) {
            WhiteList._rules[i].site = WhiteList._convertToRegexp(WhiteList._rules[i].site);
        }

        //        WhiteList._rules.push(WhiteList._convertToRegexp("toolbardev.com"));
    }
};

com.threebeats.WhiteList.testDomain = function(domain) {
    with (com.threebeats.WhiteList) {

        for (var i=0; i < _rules.length; i++) {
            var r = _rules[i];

            if (r.site.test(domain)) {
                return r;
            }
        }
    }

    return null;
};

//TODO: check and test
com.threebeats.WhiteList._convertToRegexp = function(w) {
    return new RegExp(w.replace(/\*/g, ".*"));
};