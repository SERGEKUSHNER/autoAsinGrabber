// events
items = [];
function findIds() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "grab_ids" }, function (response) {
      items = items.concat(response);
      console.log(items);
      asinsResponse = response.asins;
      response.forEach(addItem);
      chrome.storage.sync.get(['asins'], function (result) {
        result['asins'] && result['asins'].forEach(r => response.push(r));
        chrome.storage.sync.set({ "asins": items }, function () {
          showButtons();
        });
      });
    });
  });
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

function copyToClipboard() {
  chrome.storage.sync.get(['asins'], function (result) {
    console.log(result);
    const el = document.createElement('textarea');
    el.value = result['asins'] && result['asins'].join("\n");
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
        data: result['asins'] && result['asins'].join("\n")
      }, function (response) {

      });
    });
  });
}

function clearIds() {
  var list_container = document.getElementById("list-container");
  list_container.innerHTML = "";
  EXP_index = -1;
  items = [];
  chrome.storage.sync.set({ "asins": [] }, function () {
    showButtons();
  });
  showLabel();
}

function exportCsv() {
  chrome.storage.sync.get(['asins'], function (result) {
    downloadCsv(result['asins'] && result['asins'].join("\n"), "dowload.csv", "text/csv");
  });
}

document.getElementById("custom-btn-GetherIds").onclick = findIds;
document.getElementById("custom-btn-Clear").onclick = clearIds;
document.getElementById("custom-btn-CopyToClipboard").onclick = copyToClipboard;
document.getElementById("custom-btn-PasteInTriplemars").onclick = pasteToTriplemars;
document.getElementById("custom-btn-ExportToCSV").onclick = exportCsv;
loadItems();

var EXP_index = -1;

function addItem(item, index) {
  var list_container = document.getElementById("list-container");
  EXP_index += 1;
  list_container.innerHTML +=
    `<div class="ant-collapse-item">
             <div class="row">
               <div class="col-2">
                  ` + (EXP_index + 1) + `
                </div>
                <div class="col-5"><a href="https://www.amazon.com/item/dp/` + item + `" target="_blank">
                   ` + item + `
                </a></div>
                 <div class="col-3">
                    <img src="http://images.amazon.com/images/P/` + item + `.01.20TTZZZZ.jpg"  height="42" width="42">
                </div>
                <div class="col-2" id="x` + index + `">
                     <i class="fa fa-times clickable-icon"></i>   
                </div>
         </div>   
    
    </div>`;
  setTimeout(() => {
    document.getElementById("x" + index).onclick = () => {
      removeItem(index);
    };
  }, 0);
}

function removeItem(index) {
  EXP_index = -1;
  chrome.storage.sync.get(['asins'], function (result) {
    if (result['asins'])
      result['asins'].splice(index, 1);
    chrome.storage.sync.set({ "asins": result['asins'] }, function () {
      loadItems();
    });
  });
}

function showButtons() {
  // url
  showLabel();
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
    showNoOfEntries(result['asins']);
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

function showLabel() {
  chrome.storage.sync.get(['asins'], function (result) {

    if (result['asins'] && result['asins'].length === 0) {
      document.getElementById("showIf").style.display = 'inline';
    } else {
      document.getElementById("showIf").style.display = 'none';
    }
  });
}

function loadItems() {
  var list_container = document.getElementById("list-container");
  list_container.innerHTML = "";
  chrome.storage.sync.get(['asins'], function (result) {

    result['asins'] && result['asins'].forEach(addItem);
  });
  showButtons();
}

function showNoOfEntries(results) {
  document.getElementById("noOfEntries").innerHTML = results.length + " Results";
}

var e = document.getElementById('custom-btn-GetherIds');
e.onmouseover = function() {
    document.getElementById('getIdsPopup').style.display = 'block';
}
e.onmouseout = function() {
    document.getElementById('getIdsPopup').style.display = 'none';
}


var f = document.getElementById('custom-btn-PasteInTriplemars');
f.onmouseover = function() {
    document.getElementById('PasteInTripleMarsPopup').style.display = 'block';
}
f.onmouseout = function() {
    document.getElementById('PasteInTripleMarsPopup').style.display = 'none';
}
