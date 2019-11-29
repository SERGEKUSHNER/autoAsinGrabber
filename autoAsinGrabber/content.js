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
  });


function setNativeValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  prototypeValueSetter.call(element, value);
}

// first functionality
function getIds() {

  // classic serach
  var asinsElements = document.getElementsByClassName("s-result-list");
  var asins = [];
  for (var asinElement of asinsElements) {
    let asin = asinElement.getAttribute("data-asin");
    if (asin) {
      asins.push(asin);
    }
  }
  // prime
  var primeElements = document.querySelectorAll("li.style__itemOuter__2dxew");
  for (var primeElement of primeElements) {
    let asin = primeElement.innerHTML.match("(?:[/dp/]|$)(B[A-Z0-9]{9})");
    if (asin) {
      asins.push(asin.find(e => e.indexOf("/") === -1));
    }
  }

  // Black Friday
  var bfElements = document.querySelectorAll("div.dealDetailContainer");
  bfElements.forEach(e => {
    let asin = e.innerHTML.match("(?:[/dp/]|$)(B[A-Z0-9]{9})");
    if (asin) {
      asins.push(asin.find(e => e.indexOf("/") === -1));
    }
  });


  return asins;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

