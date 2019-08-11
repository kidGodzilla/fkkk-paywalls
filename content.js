function getLocation (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}

var hn = location.hostname;
if (hn.includes('www.')) hn = hn.replace('www.', '');

var bypassList;

chrome.runtime.sendMessage({method: "getBypassList"}, function(response) {
    bypassList = response.status;
    // console.log('bypassList:', bypassList);

    try { bypassList = JSON.parse(bypassList) } catch(e){}
    if (!bypassList || !Array.isArray(bypassList)) bypassList = [];

    if (bypassList.includes(hn)) location.replace('http://outline.com/' + location.href);
});


