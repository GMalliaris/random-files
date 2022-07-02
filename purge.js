/*
 * run node purge.js <TARGET_DIR>
*/
const fs = require('fs');

const colors = {
  reset: "\x1b[0m",

  red: "\x1b[31m",
  green: "\x1b[32m",
}

loopOverDir = (directory) => {
    fs.readdirSync(directory).forEach(file => {
        const absolutePath = directory + "/" + file;
        if (pathIsDirectory(absolutePath)){
            loopOverDir(absolutePath);
        }
        else {
            const mimeType = getFileMimeType(absolutePath);
            if (!mimeType.includes("video")){
                fs.unlink(absolutePath, (err) => {
                    if (err){
                        console.error(colors.red, err, colors.reset);
                    }
                });
            }
        }
    });
}

getFileMimeType = file => {
    const execSync = require('child_process').execSync;
    const mimeType = execSync('file --mime-type -b "' + file + '"').toString();
    return mimeType.trim();
}

pathExists = path => {
    return fs.existsSync(path);
}

pathIsDirectory = path => {
    return fs.statSync(path).isDirectory();
}

const providedDirectory = process.argv[2];
if (!providedDirectory){
    console.error("Provide a target directory.");
    return -1;
}

if (!pathExists(providedDirectory) || !pathIsDirectory(providedDirectory)){
    console.error("Provided directory is not an actual directory");
}

loopOverDir(providedDirectory);
