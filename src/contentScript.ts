import { notifyBackground, registContentHandler, clipPage } from './lib'

namespace contentScript {
    export function refreshCurrent () {
        notifyBackground("refreshCurrent", {
            title: document.title,
            url: document.URL
        })
    }
}

registContentHandler({
    "showDialog": (msg) => { alert(msg) },
    "awake": contentScript.refreshCurrent,
    "clip": () => { clipPage() }
})

// main
contentScript.refreshCurrent()

