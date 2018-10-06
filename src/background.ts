import { notifyContent, notifyPopup, showDialog, converterEngine, registBackgroundHandler } from './lib'

// routine
namespace task {
    export function storeCurLink() {
        chrome.storage.sync.get((items) => {
            let cur = items.current as any
            let url = cur.url
            let title = cur.title
            console.log(`Store: ${title} <${url}>`)
            let xhr = new XMLHttpRequest()
            // get favicon
            let tokens = url.split("/")
            let domain =  tokens[0] + "//" + tokens[2]
            xhr.open("GET", "chrome://favicon/" + domain)
            xhr.responseType = 'arraybuffer'
            xhr.onload = function() {
                let img64 = converterEngine(this.response)
                let favicon = "data:image/png;base64," + img64
                let xhr = new XMLHttpRequest()
                xhr.open("POST", "http://localhost:8070/resources/link")
                xhr.onreadystatechange = (ev) => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            showDialog("保存成功")
                        }　else {
                            showDialog("失败")
                        }
                    }
                }
                xhr.onerror = (err) => {
                    showDialog("发生错误")    
                    console.log(err)
                }
                xhr.send(JSON.stringify({
                    url: url,
                    title: title,
                    favicon: favicon
                }))
            }
            xhr.send()
        })
    }
    export function refreshCurrent (title:string, url:string) {
        console.log(`Set current to ${title} <${url}>`)
        chrome.storage.sync.set({
            "current": {
                "title": title,
                "url": url
            }
        })
    }

    export function isCurrentPageArchived() {
        chrome.storage.sync.get((items) => {
            let url = items.current.url
            let xhr = new XMLHttpRequest()
            xhr.open("GET", "http://localhost:8070/resources/link/exist?url=" + encodeURI(url))
            xhr.onload = () => {
                notifyPopup('isPageArchivedResult', xhr.status === 201)
            }
            xhr.send()
        })        
    }

    export function registContextMenu() {
        chrome.contextMenus.create({
            "title": "暂存链接",
            "contexts": ["page"],
            onclick: () => {
                storeCurLink()
            }
        }, () => {
            console.log("Successful page link context menu")
        })
    }
}

registBackgroundHandler({
    'refreshCurrent': (msg) => {task.refreshCurrent(msg.title, msg.url)},
    'isPageArchived': task.isCurrentPageArchived
})

// listeners
chrome.runtime.onInstalled.addListener(task.registContextMenu)

chrome.runtime.onStartup.addListener(task.registContextMenu)

chrome.tabs.onActivated.addListener(() => {
    notifyContent("awake", {})
})