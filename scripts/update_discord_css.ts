// guess what discord changes there classNames around ;-;
import fs from "fs";
// const { writeFileSync } = require("fs");
import path from "path"
// diy at 4am
// run with bun
const { readdirSync, writeFileSync } = fs
const url = 'https://raw.githubusercontent.com/SyndiShanX/Update-Classes/main/Changes.txt'
    let rawFile = await fetch(url);
	let rawText = await rawFile.text();
    function updateClasses(css, path) {
        var i = 0
        let classNum = rawText.split('\n').length - 1
        let changesText = rawText.split('\n')
        let themeText = css;
        while (i < classNum) {
          let  class1 = changesText[i].split('\r')[0]
         let   class2 = changesText[i + 1].split('\r')[0]
        
            themeText = themeText.replaceAll(class1, class2)
        
            i = i + 2
        }
 console.log(`Done for ${path}`)
 writeFileSync(path, themeText)       
    }
    async function* walk(dir) {
        for await (const d of await fs.promises.opendir(dir)) {
            const entry = path.join(dir, d.name);
            if (d.isDirectory()) yield* walk(entry);
            else if (d.isFile()) yield entry;
        }
    }
    
    for await (const p of walk(path.dirname(__dirname))) {
        if(!p.endsWith('.css')) continue;
        // console.log(p)
        await updateClasses(await Bun.file(p).text(), p)
    }