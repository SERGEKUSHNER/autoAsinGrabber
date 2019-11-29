function addItem(item) {

  var list_container = document.getElementById("list-container");
  list_container.innerHTML +=
    `<div class="ant-collapse-item">
             <div class="row">
                <div class="col-6">
                  <div class="ant-collapse-header" role="button" tabindex="0" aria-expanded="false"> `+ item + `</div>
                </div>
                 <div class="col-6">
                 <img src="http://images.amazon.com/images/P/`+ item + `.01.20TTZZZZ.jpg"  height="42" width="42">
                </div>
         </div>   
    
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
    result['asins'] && result['asins'].forEach(addItem);
  });
  showButtons();
}

loadItems();

function showButtons() {
  // url
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var url = tabs[0].url;
    if (url.indexOf('amazon') !== -1) {
      document.getElementById("custom-btn-GetherIds").style.display = 'inline';
    } else {
      document.getElementById("custom-btn-GetherIds").style.display = 'none';

    }
    if (url.indexOf('console.triplemars') !== -1) {
      document.getElementById("custom-btn-PasteInTriplemars").style.display = 'inline';
    } else {
      document.getElementById("custom-btn-PasteInTriplemars").style.display = 'none';
    }
  });
  // list
  chrome.storage.sync.get(['asins'], function (result) {
    console.log('hello hello', result['asins']);
    if (result['asins'] && result['asins'].length === 0) {
      document.getElementById("custom-btn-Clear").style.display = 'none';
      document.getElementById("custom-btn-CopyToClipboard").style.display = 'none';
      document.getElementById("custom-btn-ExportToCSV").style.display = 'none';
      document.getElementById("custom-btn-PasteInTriplemars").style.display = 'none';
    } else {
      document.getElementById("custom-btn-Clear").style.display = 'inline';
      document.getElementById("custom-btn-CopyToClipboard").style.display = 'inline';
      document.getElementById("custom-btn-ExportToCSV").style.display = 'inline';

    }
  });
}

// events
function findIds() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "grab_ids" }, function (response) {
      response.forEach(addItem);
      chrome.storage.sync.get(['asins'], function (result) {
        result['asins'] && result['asins'].forEach(r => response.push(r));
        chrome.storage.sync.set({ "asins": response }, function () {
          showButtons();
        });
      });
    });
  });
}

function copyToClipboard() {
  chrome.storage.sync.get(['asins'], function (result) {
    console.log(result);
    const el = document.createElement('textarea');
    el.value = result['asins'] && result['asins'].join("\n ");
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function pasteToTriplemars() {
  chrome.storage.sync.get(['asins'], function (result) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "paste_ids",
        data: result['asins'] && result['asins'].join("/n ")
      }, function (response) {

      });
    });
  });
}

function clearIds() {
  var list_container = document.getElementById("list-container");
  list_container.innerHTML = "";
  chrome.storage.sync.set({ "asins": [] }, function () {
    showButtons();
  });

}

function exportCsv() {
  chrome.storage.sync.get(['asins'], function (result) {
    downloadCsv(result['asins'] && result['asins'].join("\n "), "dowload.csv", "text/csv");
  });
}

document.getElementById("custom-btn-GetherIds").onclick = findIds;
document.getElementById("custom-btn-Clear").onclick = clearIds;
document.getElementById("custom-btn-CopyToClipboard").onclick = copyToClipboard;
document.getElementById("custom-btn-PasteInTriplemars").onclick = pasteToTriplemars;
document.getElementById("custom-btn-ExportToCSV").onclick = exportCsv;


