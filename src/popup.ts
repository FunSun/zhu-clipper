import { notifyBackground, registPopupHandler } from './lib'

registPopupHandler({
    "isPageArchivedResult": (msg:boolean) => {
        let root = document.getElementById("root")
        if (msg) {
            root.innerHTML = "<h3>已保存</h3>"
        } else {
            root.innerHTML = "<h3>未保存</h3>"
        }
    }
})

// main
notifyBackground("isPageArchived", {})
