chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // Get Items and Paste Items - HAT - FIRST FUNCTIONALITY - https://www.amazon.com/s?k=hat&ref=nb_sb_noss
        if (request.action && request.action === "grab_ids") {
            sendResponse(getIds());
        }
        if (request.action && request.action === "paste_ids") {
            var textarea = document.getElementsByClassName("DiscoveryDropZone")[0];
            setNativeValue(textarea, request.data);
            textarea.dispatchEvent(new Event('input', {bubbles: true}));
        }
    });

function setNativeValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    prototypeValueSetter.call(element, value);
}

// first functionality
function getIds() {
    var asinsElements = document.querySelectorAll('[data-asin]');
    console.log('here is AsinsElements', asinsElements);
    var asins = [];
    for (var asinElement of asinsElements) {
        var asin = asinElement.getAttribute("data-asin");
        if (asin) {
            asins.push(asin);
        }
    }
    console.log('Asins are: ', asins);
    return asins;
}


// Second Functionality - Black Friday -- https://www.amazon.com/b/?ie=UTF8&node=15529609011&ref_=nav_swm_AE_EN_SWM_Deals&pf_rd_p=58efe6d7-5ec1-403f-9010-3836b630a77a&pf_rd_s=nav-sitewide-msg-export&pf_rd_t=4201&pf_rd_i=navbar-4201&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=1152MMSKQ4JZDN4SJ7HH
// document.querySelectorAll("div.dealDetailContainer");


//Fird functionality
// document.querySelectorAll("li.style__itemOuter__2dxew")
//https://www.amazon.com/stores/page/F71F7AD3-B710-4682-8392-5BE878ED5C72?store_ref=SB_A0677023UUUGR7OEO264&pf_rd_p=44fc3e0f-4b9e-4ed8-b33b-363a7257163d&hsa_cr_id=7997821310601&lp_slot=auto-sparkle-hsa-tetris&lp_asins=B07SZ3ZV39,B014F40RPE,B000O76CU6&lp_mat_key=hats&lp_query=hat


//4th functionality
// document.querySelectorAll("li.a-carousel-card")
// https://www.amazon.com/Coupons/b?ie=UTF8&node=2231352011

