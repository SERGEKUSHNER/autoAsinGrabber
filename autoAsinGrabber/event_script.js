chrome.commands.onCommand.addListener(function (command) {
    console.log(command);
    if (command === "GetItems") {
        console.log('we are here');
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "grab_ids"}, function (response) {
                chrome.storage.sync.get(['asins'], function (result) {
                    result['asins'] && result['asins'].forEach(r => response.push(r));
                    chrome.storage.sync.set({"asins": response}, function () {

                    });
                });
            });
        });
    }
    if (command === "PasteItems") {
        console.log('This is PasteItems Command');
        chrome.storage.sync.get(['asins'], function (result) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "paste_ids",
                    data: result['asins'] && result['asins'].join("\n")
                }, function (response) {

                });
            });
        });
    }

});
