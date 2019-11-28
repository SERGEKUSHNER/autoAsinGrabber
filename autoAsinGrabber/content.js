chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action && request.action === "grab_ids") {
      sendResponse(getIds());
    }
    if (request.action && request.action === "paste_ids") {
      var textarea = document.getElementsByClassName("DiscoveryDropZone")[0];
      setNativeValue(textarea, request.data);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // sendResponse(1);
  });

function setNativeValue(element, value) {
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    prototypeValueSetter.call(element, value);
}

function getIds() {
    var asinsElements = document.querySelectorAll('[data-asin]');
    var asins = [];
    for (var asinElement of asinsElements) {
        var asin = asinElement.getAttribute("data-asin");
        if (asin) {
            asins.push(asin);
        }
    }
    return asins;
}
