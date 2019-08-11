function getLocation (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getBypassList") {
        // console.log('Requesting status!', localStorage.getItem('_bypassList') )
        sendResponse({status: localStorage.getItem('_bypassList') });
    }
    else
      sendResponse({}); // snub them.
});

chrome.browserAction.onClicked.addListener(function(tab) {
    // Getting the current URL when the button is clocked
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var address = tabs[0].url;

        // Disable the redirect for internal Chrome pages and outline.com pages
        var reg = new RegExp ("^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d\.-]+)\.(?:[a-z\.]{2,10})(?:[/\w\.-]*)*");
        var domain = reg.exec(address);

        if ((domain[1] !== "outline.") && (domain[1] !== "chr")) {

            // Redirect to the outline.com with GET request formed
            chrome.tabs.update({url: 'http://outline.com/'+address});

            var hn = getLocation(address).hostname;
            if (hn.includes('www.')) hn = hn.replace('www.', '');

            setTimeout(function () {
                var a = confirm('Would you like to bypass all paywalls from ' + hn + ' automatically from now on?');

                if (a) {
                    var bypassList = localStorage.getItem('_bypassList');
                    try { bypassList = JSON.parse(bypassList) } catch(e){}
                    if (!bypassList || !Array.isArray(bypassList)) bypassList = [];

                    if (!bypassList.includes(hn)) bypassList.push(hn);

                    try { localStorage.setItem('_bypassList', JSON.stringify(bypassList)) } catch(e){}

                    // alert(hn + ' added to bypass list.');
                }
            }, 6000);


        }
    });

});
