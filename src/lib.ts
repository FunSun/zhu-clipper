import {trimStyles} from './style'

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

function getZhihuContent ():[string[], string, string] {
    let tags:string[] = []
    document.querySelectorAll(".TopicLink div div").forEach((v) => {
        tags.push(v.innerHTML)
    })
    let el = document.querySelector('.AnswerCard')
    let copyed = copyElement(el, {})
    let wrapper = document.createElement("div")
    wrapper.appendChild(copyed)
    wrapper.removeChild(wrapper.lastChild)
    return [tags, wrapper.innerHTML, wrapper.innerText]
}

function copyElement(el:Element|Text, parentStyles:{[key:string]:any}): Element|Text {
    if (el.nodeType === document.TEXT_NODE) {
        return document.createTextNode(el.textContent)
    }
    el = el as Element
    if(el.tagName.toUpperCase() === "SVG") {
        return el
    }
    let t = document.createElement(el.tagName)
    for (let i=0; i< el.attributes.length; i++) {
        if (el.attributes[i].nodeName === "style") {
            continue
        }
        t.setAttribute(el.attributes[i].nodeName, el.attributes[i].nodeValue)
    }
    let selfStyle = getStyles(el)
    let styles
    if (selfStyle) {
        styles = trimStyles(el.tagName.toUpperCase(), selfStyle, parentStyles)
    }
    
    let nextParentStyle = Object.assign({}, parentStyles, styles)
    Object.assign(t.style, styles)
    for (let i=0; i< el.childNodes.length; i++) {
        t.appendChild(copyElement(el.childNodes[i] as any, nextParentStyle))
    }
    return t
}

export function clipPage() {
    let url = window.location.href
    let title = document.title
    let tags: string[] = []
    let content = ""
    let fulltext = ""
    if (url.match(/^\w+:\/\/www.zhihu.com\/question\/\d+\/answer\/\d+/)) {
        [tags, content, fulltext] = getZhihuContent()
        notifyBackground("clipPage", {
            title, url, tags, content, fulltext
        })
    } else {
        alert("无法剪裁该页面")
        return
    }
}

const noStyleTags:{[key:string]:boolean} = {"BASE":true,"HEAD":true,"HTML":true,"META":true,"NOFRAME":true,"NOSCRIPT":true,"PARAM":true,"SCRIPT":true,"STYLE":true,"TITLE":true}
function getStyles(el: Element) {
    let computed = getComputedStyle(el)
    let styles: {[key:string]:string} = {}
    if (noStyleTags[el.tagName.toUpperCase()]) {
        return null
    }
    for (let i=0; i< computed.length; i++) {
        styles[computed[i]] = computed[computed[i] as any]
    }
    return styles
}
