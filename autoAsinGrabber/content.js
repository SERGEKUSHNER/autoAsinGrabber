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

function getIds() {
  var asins = [];
  // classic serach
  var classicAsins = getIdsBySelector(".s-result-list");
  asins = asins.concat(classicAsins);

  // prime
  var primeAsins = getIdsBySelector("li.style__itemOuter__2dxew");
  asins = asins.concat(primeAsins);

  // Black Friday
  var bfAsins = getIdsBySelector("div.dealDetailContainer");
  asins = asins.concat(bfAsins);

  // Cupons
  var cuponsAsins = getIdsBySelector("#merchandised-content");
  asins = asins.concat(cuponsAsins);
  return asins;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getIdsBySelector(container) {
  var asins = [];
  var elements = document.querySelectorAll(container);
  elements.forEach(e => {
    let asin = e.innerHTML.match(/(?:[/dp/]|$)(B[A-Z0-9]{9})/g);
    if (asin) {
      var removedDuplicatesAsins = asin.filter(onlyUnique);
      var removedSlash = removedDuplicatesAsins.map(e => e.replace("/", ""));
      asins = asins.concat(removedSlash);
    }
  });
  return asins;
}

