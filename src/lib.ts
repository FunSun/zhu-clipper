export function notifyContent(evt: string, payload:any) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {evt, payload, 'target': 'content'}, function(response) {})
    })
}

export function notifyPopup(evt: string, payload: any) {
    chrome.runtime.sendMessage({evt, payload, 'target': 'popup'})
}

export function notifyBackground(evt:string, payload:any) {
    chrome.runtime.sendMessage({evt, payload, 'target': 'background'})
}

export function showDialog(msg: string) {
    notifyContent("showDialog", msg)
}

export function converterEngine (input:any) { // fn BLOB => Binary => Base64 ?
    var uInt8Array = new Uint8Array(input),
          i = uInt8Array.length
    var biStr = [] //new Array(i);
    while (i--) { biStr[i] = String.fromCharCode(uInt8Array[i]) }
    var base64 = window.btoa(biStr.join(''))
    return base64
}

export function registBackgroundHandler(handlers:{[key:string]:(msg:any)=>void}) {
    registHandler('background', handlers)    
}
export function registPopupHandler(handlers:{[key:string]:(msg:any)=>void}) {
    registHandler('popup', handlers)
}
export function registContentHandler(handlers:{[key:string]:(msg:any)=>void}) {
    registHandler('content', handlers)
}

function registHandler(type: string, handlers: {[key:string]:(msg:any)=>void}) {
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.target === type) {
            let handler = handlers[msg.evt]
            if (handler) {
                handler(msg.payload)
            } else {
                console.log(`Handler for ${msg.evt} not found`)
            }
        }

    })
}
function getZhihuContent () {
    // let from = window.location.href
    // let title = $('main h1')[0].innerText
    // let tags = $('.TopicLink div div').map(function () { return this.innerText}).get()
    // let content = $('.AnswerCard').html()
    // let reqBody = [from, title, tags.join(','), content].join('\n')
}
