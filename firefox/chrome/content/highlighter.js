if (!com) {
    var com = {};
}

if (!com.threebeats) {
    com.threebeats = function() {
    };
}

if (!com.threebeats.Highlighter) {
    com.threebeats.Highlighter = function() {
    };
}

com.threebeats.Highlighter._names = [];

com.threebeats.Highlighter.load = function() {
    with (com.threebeats) {
        var file = Update.getStarFile();

        if (!file.exists()) {
            Update.updateStarFile();
        }

        var content = IO.getContentFromFile(file).toLowerCase();

        Highlighter._names = JsonUtils.decode(content);
        Log.log("@ Highlighter._names: " + Highlighter._names.length);
    }
};

com.threebeats.Highlighter.highlightDoc = function(doc, rule) {
    with (com.threebeats) {

        var matches = Highlighter._highlightImpl(doc, rule);

        if (matches > 0) {
            Injector.injectPopupCode(doc);
        }
    }
};

com.threebeats.Highlighter._hasParentTag = function(element, tagName) {
    if (element == null || element.parentNode == null || element.parentNode.tagName == null) {
        return false;
    }

    if (element.parentNode.tagName.toLowerCase() == tagName.toLowerCase()) {
        return true;
    }

    return com.threebeats.Highlighter._hasParentTag(element.parentNode, tagName);
};

com.threebeats.Highlighter._highlightImpl = function(doc, rule) {
    var matches = 0;
    var h1Nodes = [];
    var h2Nodes = [];
    var h3Nodes = [];
    var highlightedNames = [];

    function highlightNode(node, starName, pos) {
        var linkNode = doc.createElement('i');
        linkNode.setAttribute("style", "color: blue;text-decoration: underline;cursor: pointer;");
        linkNode.setAttribute("title", "threeBeatsExtPopup");

        var middlebit = node.splitText(pos);
        var endbit = middlebit.splitText(starName.length);
        var middleclone = middlebit.cloneNode(true);

        linkNode.appendChild(middleclone);
        middlebit.parentNode.replaceChild(linkNode, middlebit);

        var img = doc.createElement("img");
        img.setAttribute("src", "chrome://threebeats/skin/3beats-star-16x16.png");
        img.setAttribute("border", "0");

        if (linkNode.nextSibling) {
            linkNode.parentNode.insertBefore(img, linkNode.nextSibling);
        } else {
            linkNode.parentNode.appendChild(img);
        }

        highlightedNames.push(starName);
    }

    function innerHighlight(node) {
        with (com.threebeats) {
            var nodeText = node.data.toLowerCase();

            for (let i = 0; i < Highlighter._names.length; i++) {
                var starName = Highlighter._names[i];

                if (ArrayUtils.contains(highlightedNames, starName)) {
                    continue;
                }

                var pos = nodeText.indexOf(starName);
                if (pos >= 0) {
                    if (Highlighter._hasParentTag(node, "h1")) {
                        h1Nodes.push({ node : node.parentNode, pos : pos, name : starName});
                    } else if (Highlighter._hasParentTag(node, "h2")) {
                        h2Nodes.push({ node : node.parentNode, pos : pos, name : starName});
                    } else if (Highlighter._hasParentTag(node, "h3")) {
                        h3Nodes.push({ node : node.parentNode, pos : pos, name : starName});
                    } else if (Highlighter._hasParentTag(node, "h4")) {
                        // Do nothing. Disable H4 highlighting.
                    } else {
                        highlightNode(node, starName, pos);
                        matches++;
                    }

                    break;
                }
            }
        }
    }

    function highlightHeaders(headersArr) {
        var result = false;
        for (var i = 0; i < headersArr.length; i++) {
            var e = headersArr[i];

            highlightNode(e.node, e.name, e.pos);
            matches++;

            result = true;
        }

        return result;
    }

    function trim(string) {
        return string.replace(/(^\s+)|(\s+$)/g, "");
    }

    function collectTextNodes(element, exclusions, texts) {

        //            element.tagName == "A" || 
        if (element.tagName == "SCRIPT" || element.tagName == "STYLE" || element.tagName == "IMG") {
            return;
        }

        for (var child = element.firstChild; child !== null; child = child.nextSibling) {
            if (child.nodeType === 3) {
                var cleared = trim(child.data);
                if (cleared != "") {
                    texts.push(child);
                }
            } else if (child.nodeType === 1)
                if (!com.threebeats.ArrayUtils.contains(exclusions, child)) {
                    collectTextNodes(child, exclusions, texts);
                }
        }
    }

    function selectSingleNode(doc, elementPath) {
        try {
            var links = doc.evaluate(elementPath, doc, null, XPathResult.ANY_TYPE, null);

            return links.iterateNext();
        } catch(e) {
            return null;
        }
    }

    var articleNode = selectSingleNode(doc, rule.start);

    var exclusions = [];

    if (rule.exclude) {
        for (var i = 0; i < rule.exclude.length; i++) {
            var node = selectSingleNode(doc, rule.exclude[i]);

            if (node) {
                exclusions.push(node);
            }
        }
    }

    var texts = [];
    if (articleNode) {
        collectTextNodes(articleNode, exclusions, texts);
    } else {
        collectTextNodes(doc.body, exclusions, texts);
    }

    for (var i = 0; i < texts.length; i++) {
        innerHighlight(texts[i]);
    }

    if (matches == 0) {
        if (highlightHeaders(h3Nodes)) {
            return matches;
        }
        if (highlightHeaders(h2Nodes)) {
            return matches;
        }

        highlightHeaders(h1Nodes);
    }

    return matches;
};
