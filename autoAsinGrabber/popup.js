
function addItem(item) {
  var list_container = document.getElementById("list-container");
  list_container.innerHTML +=
    `<div class="ant-collapse-item">
      <div class="ant-collapse-header" role="button" tabindex="0" aria-expanded="false">`+ item + `</div>
    </div>`;
}

function downloadCsv(content, fileName, mimeType) {
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    navigator.msSaveBlob(new Blob([content], {
      type: mimeType
    }), fileName);
  } else if (URL && 'download' in a) { //html5 A[download]
    a.href = URL.createObjectURL(new Blob([content], {
      type: mimeType
    }));
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
  }
}


// onload
function loadItems() {

  chrome.storage.sync.get(['asins'], function (result) {
    result['asins'].forEach((value)=>{items.push(value)});
    result['asins'] && result['asins'].forEach(addItem);
  });

  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    console.log(tabs[0].url);
    console.log(tabs[0].title);
    var url = tabs[0].url;
    showButtons(url);
    console.log(tabs[0].url);
    console.log(tabs[0].title);
  });


}
loadItems();

function showButtons(url) {

  if (url.indexOf('amazon') !== -1) {
    document.getElementById("custom-btn-GetherIds").style.display = 'inline';
  } else {
    document.getElementById("custom-btn-GetherIds").style.display = 'none';

  }

  if(url.indexOf('console.triplemars') !== -1){
    document.getElementById("custom-btn-PasteInTriplemars").style.display = 'inline';
  } else {
    document.getElementById("custom-btn-PasteInTriplemars").style.display = 'none';
  }
}

// events
function findIds() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "grab_ids" }, function (response) {
      response.forEach(addItem);
      chrome.storage.sync.get(['asins'], function (result) {
        result['asins'] && result['asins'].forEach(r => response.push(r));
        chrome.storage.sync.set({ "asins": response }, function () {
        });
      });
    });
  });
}

function copyToClipboard() {
  chrome.storage.sync.get(['asins'], function (result) {
    console.log(result)
    const el = document.createElement('textarea');
    el.value = result['asins'] && result['asins'].join(", ");
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });

}

function pasteToTriplemars() {
  chrome.storage.sync.get(['asins'], function (result) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "paste_ids", data: result['asins'] && result['asins'].join(", ") }, function (response) {

      });
    });
  });
}

function clearIds() {
  var list_container = document.getElementById("list-container");
  list_container.innerHTML = "";
  items = [];

  chrome.storage.sync.set({ "asins": [] }, function () {
  });
}

function exportCsv() {
  chrome.storage.sync.get(['asins'], function (result) {
    downloadCsv(result['asins'] && result['asins'].join(", "), "dowload.csv", "text/csv");
  });
}

document.getElementById("custom-btn-GetherIds").onclick = findIds;
document.getElementById("custom-btn-Clear").onclick = clearIds;
document.getElementById("custom-btn-CopyToClipboard").onclick = copyToClipboard;
document.getElementById("custom-btn-PasteInTriplemars").onclick = pasteToTriplemars;
document.getElementById("custom-btn-ExportToCSV").onclick = exportCsv;

if(items.length === 0){
  document.getElementById("custom-btn-Clear").style.display = 'inline';
}else{
  document.getElementById("custom-btn-Clear").style.display = 'none';
}
// document.getSelected(null, function(tab) {
//   var code = 'window.location.reload();';
//   chrome.tabs.executeScript(tab.id, {code: code});
// });
console.log('The item are', items);
