type Styles = {[key:string]:string}

const IgnoredStyle: {[key:string]:string} = {
    "filter": "none",
    "flood-color": "rgb(0, 0, 0)",
    "flood-opacity": "1",
    "lighting-color": "rgb(255, 255, 255)",
    "shape-rendering": "auto",
    "color-interpolation": "sRGB",
    "color-interpolation-filters": "linearRGB",
    "color-rendering": "auto",
    "fill": "rgb(0, 0, 0)",
    "fill-opacity": "1",
    "fill-rule": "nonzero",
    "stroke": "none",
    "stroke-dasharray": "none",
    "stroke-dashoffset": "0px",
    "stroke-linecap": "butt",
    "stroke-linejoin": "miter",
    "stroke-miterlimit": "4",
    "stroke-opacity": "1",
    "stroke-width": "1px",
    "clip-path": "none",
    "clip-rule": "nonzero",
    "mask": "none",
    "mask-type": "luminance",    
    "stop-color": "rgb(0, 0, 0)",
    "stop-opacity": "1",
    "marker-end": "none",
    "marker-mid": "none",
    "marker-start": "none",
    "speak": "normal",
    "table-layout": "auto",
    "tab-size": "8",
    "touch-action": "auto",
    "zoom": "1",
    "transition-delay": "0s",
    "transition-duration": "0.3s",
    "transition-property": "box-shadow",
    "transition-timing-function": "ease",
    "animation-delay": "ignore",
    "animation-direction": "ignore",
    "animation-duration": "ignore",
    "animation-fill-mode": "ignore",
    "animation-iteration-count": "ignore",
    "animation-name": "ignore",
    "animation-play-state": "ignore",
    "animation-timing-function": "ingore",
    "font-family": "ignore"
}

const NoInheritStyle:{[key:string]:string} = {
    "text-decoration": "none"
}

function isIgnoredStyle(k: string):boolean {
    if (k.startsWith("-webkit")) {
        return false
    }
    return !!IgnoredStyle[k]
}

function handleBackground(curStyles:{[key:string]:any}, parentStyles:{[key:string]:any}) {
    if (curStyles['background-color'] === "") {
        return {}
    }
    return {"background-color": curStyles['background-color']}
}

function handleBorderStyle(curStyles:{[key:string]:any}, parentStyles:{[key:string]:any}) {
    let top = [curStyles["border-top-width"], curStyles["border-top-style"], curStyles["border-top-color"]].join(" ")
    let bottom = [curStyles["border-bottom-width"], curStyles["border-bottom-style"], curStyles["border-bottom-color"]].join(" ")
    let left = [curStyles["border-left-width"], curStyles["border-left-style"], curStyles["border-left-color"]].join(" ")   
    let right = [curStyles["border-right-width"], curStyles["border-right-style"], curStyles["border-right-color"]].join(" ")
    if ((top === bottom) && (top === left) && (top === right)) {
        return {"border": top}
    }
    return {
        "border-top": top,
        "border-bottom": bottom,
        "border-left": left,
        "border-right": right
    }
}


function handleSize(curStyles:{[key:string]:any}, parentStyles:{[key:string]:any}) {
    return {
        // "width": curStyles.width,
        // "height": curStyles.height
    }
}

function handleMargin(cur:Styles, parent: Styles) {
    let margin = [cur["margin-top"], cur["margin-right"], cur["margin-bottom"], cur["margin-left"]].join(" ")
    return {margin}
}

function handlePadding(cur:Styles, parent: Styles) {
    let padding = [cur["padding-top"], cur["padding-right"], cur["padding-bottom"], cur["padding-left"]].join(" ")
    return {padding}
}

function handleText(tag:string, cur: Styles, parent:Styles) {
    let res:Styles = {}
    if (tag === 'A' && cur['text-decoration'] !== "underline") {
        res['text-decoration'] = cur['text-decoration']
    }
    if (tag !== 'A' && cur['text-decoration'] !== parent['text-decoration']) {
        res['text-decoration'] = cur['text-decoration']
    }
    if (cur['font-size'] !== parent['font-size']) {
        res['font-size'] = cur['font-size']
    }
    if (cur['font-weight'] !== parent['font-weight']) {
        res['font-weight'] = cur['font-weight']
    }

    if (cur['line-height'] !== parent['line-height']) {
        res['line-height'] = cur['line-height']
    }

    if (cur['font-family'] !== parent['font-family']) {
        res['font-family'] = cur['font-family']
    }

    if (cur['word-break'] !== parent['work-break']) {
        res['word-break'] = cur['word-break']
    }

    if (cur['color'] !== parent['color'] && tag === 'A') {
            res['color'] = cur['color']
    }
    return res
}

export function trimStyles(tag:string, cur: Styles, parent:Styles) {
    let target:Styles ={}
    Object.assign(target, handleBackground(cur, parent))
    Object.assign(target, handleBorderStyle(cur, parent))
    Object.assign(target, handleMargin(cur, parent))
    Object.assign(target, handlePadding(cur, parent))
    Object.assign(target, handleSize(cur, parent))
    Object.assign(target, handleText(tag, cur, parent))
    target["display"] = cur["display"]
    return target
}
