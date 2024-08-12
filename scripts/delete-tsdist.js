// see https://stackoverflow.com/a/52526549/22334683

import fs from 'node:fs';

let notFound = true;

function deleteFolderRecursive(path) {
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
        notFound = false;
        fs.readdirSync(path).forEach(function(file){
            const curPath = path + '/' + file;
        
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
    
        console.log(`Deleting directory '${path}'...`);
        fs.rmdirSync(path);
    }
}

console.log('Deleting tsdist directory...');
deleteFolderRecursive('./tsdist');
if (notFound) {
    console.log('tsdist directory not in project. No files deleted.');
} else {
    console.log('Successfully deleted tsdist directory!');
}
