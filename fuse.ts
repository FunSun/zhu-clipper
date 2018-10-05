import { FuseBox, Sparky } from "fuse-box"

const OUTPUT_DIR = "build"

// are we running in production mode?
const isProduction = process.env.NODE_ENV === "production"

// copy the renderer's html file into the right place
Sparky.task("copy-file", () => {
  return Sparky.src("**/*", {base: "./src/assets"}).dest(OUTPUT_DIR)
})

// the default task
Sparky.task("default", ["copy-file"], () => {
    const fuse = FuseBox.init({
        homeDir: "src",
        output: `${OUTPUT_DIR}/$name.js`,
        target: "es6",
        log: isProduction,
        cache: !isProduction,
        sourceMaps: true,
        tsConfig: "tsconfig.json",
    })

    const backgroundBundle = fuse
        .bundle("background")
        .instructions("> [background.ts]")

    const contentScriptBundle = fuse
        .bundle("contentScript")
        .instructions("> [contentScript.ts]")

    const popupBundle = fuse
        .bundle("popup")
        .instructions("> [popup.ts]")


    if (!isProduction) {
        backgroundBundle.watch()
        contentScriptBundle.watch()
        popupBundle.watch()
        
    }

    return fuse.run()
})
