// generate around like 90% of it so i dont have to work so long on it.
const fs = require('fs');
const path = require('path');
const raw_manifest = []
async function* walk(dir, files = []) {
    // console.debug(dir)
    // const files = []
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) {
          
         yield *walk(entry, files);
        }
        else if (d.isFile()){
           yield entry;
        }
    }
    return files;
}

;(async () => {
    // ez stuff first
const EzFolders = ['Animation', 'Avatar', 'Fonts', 'Meme', 'Misc'].map(e => path.join(__dirname, '..', e))
for (const folder of EzFolders) {
    for (const file of fs.readdirSync(folder))
        raw_manifest.push({
            path: path.join(path.basename(folder), file).replaceAll(path.sep, "/"),
            type: 'file',
            name: file.replaceAll(path.sep, "/"),
        tags: [...new Set([file,  folder])],
        authorId: "566766267046821888"
        })
}
// now the hard stuff
const baseHardPath = path.join(__dirname, '..', 'Saltssaumure')
// const Thumbnails = path.join(baseHardPath, 'docs/_media')
const Snippets = path.join(baseHardPath, 'Snippets')
for await (const item of await walk(Snippets)) {

    const file = path.basename(item)
   if(!file.endsWith('.css')) continue; 
    const folder = path.basename(path.dirname(item))
    const baseFolder2 = path.basename(path.dirname(path.dirname(item)))
    const thumbnailPath = path.join('Saltssaumure', 'docs/_media', `${folder}.png`)
//    if(!fs.existsSync(thumbnailPath)) continue;
    raw_manifest.push({
        path: baseFolder2 === 'Snippets' ? path.join('Saltssaumure', baseFolder2, folder, file).replaceAll(path.sep, "/") :  path.join('Saltssaumure', 'Snippets', baseFolder2, folder, file).replaceAll(path.sep, "/"),
        type: 'file',
        name: file.replaceAll(path.sep, "/"),
        folder: folder.replaceAll(path.sep, "/"),
        baseFolder2: baseFolder2.replaceAll(path.sep, "/"),
        thumbnailPath: fs.existsSync(path.join(__dirname, '..', thumbnailPath)) ? thumbnailPath.replaceAll(path.sep, "/") : null,
        thumbnail_type: "path",
        tags: [...new Set([file, baseFolder2, folder, 'Saltssaumure'])],
        authorId: "134142022092062720"
    })

}
 for await(const item of walk(path.join(__dirname, '..', 'DaBluLite'))) {
    const file = path.basename(item)
    if(!file.endsWith('.css')) continue; 
     const folder = path.basename(path.dirname(item))
     const folder2 = path.basename(path.dirname(path.dirname(item)))
     const readMePath = (folder2 === 'DaBluLite' ? path.join(path.dirname(item), 'readme.md') :  path.join(path.dirname(path.dirname(item)), 'readme.md'))
let ReadMeContent = fs.existsSync(readMePath) ? fs.readFileSync(readMePath).toString() : "" // no errors :D
let thumbnailPath = ReadMeContent.includes('![image]') ? ReadMeContent.split('![image](')[1].split(')')[0] : null
        raw_manifest.push({
            path: path.join('DaBluLite', folder, file).replaceAll(path.sep, "/"),
            type: 'file',
            name: file.replaceAll(path.sep, "/"),
            folder: folder.replaceAll(path.sep, "/"),
            thumbnailPath: thumbnailPath, //"MODIFY ME MANULALY", -- i have an idea
            thumbnail_type: "url",
            tags: [...new Set([file, folder2, folder, 'DaBluLite'])],
            authorId: "582170007505731594"
        })
}
fs.writeFileSync(path.join(__dirname, '..', 'manifest.json'), JSON.stringify(raw_manifest, null, 4))
})()