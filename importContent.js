#! /usr/bin/env node

// User is responsible for exporting docs from readme first
// https://dash.readme.io/project/substrate/v1.0.0/settings
// You'll end up with a zip file

// Usage: ./importContent.js myExport.zip

const { statSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const { removeSync, moveSync, ensureDir } = require('fs-extra');
const { execSync } = require('child_process');
const { basename } = require('path');

// Pass zip file location as only argument
const zipPath = process.argv.slice(-1).pop();
const target = __dirname + "/docs";

let workingDir = mkdtempSync(`/tmp/export-`);

// Extract the archive
execSync(`unzip ${zipPath} -d ${workingDir}`);

// Ignore the v1.1.0
workingDir += '/v1.0.0';

// Remove a few irrelevant directories
removeSync(`${workingDir}/Substrate OAS3`);
removeSync(`${workingDir}/Contact Us`);

// Rename a few directories
moveSync(`${workingDir}/Quick Start`, `${workingDir}/quickstart`);
moveSync(`${workingDir}/Substrate Overview`, `${workingDir}/overview`);
moveSync(`${workingDir}/Runtime/Runtime Types`, `${workingDir}/Runtime/types`);
moveSync(`${workingDir}/Runtime/Runtime Macros`, `${workingDir}/Runtime/macros`);

// Process new files over old
moveFiles(workingDir, target);






/**
 * Moves all files from extracted export to new location
 * with sanatized name.
 */
function moveFiles (source, dest) {

  if (statSync(source).isFile()) {
    // Terminating case. Process and save it.

    let oldContent = readFileSync(source, 'utf8').split("\n");
    //console.log(oldContent);

    const extracted = oldContent.splice(2, 1);
    //console.log("Just extracted: " + extracted);
    writeFileSync(dest, oldContent.join("\n"));
    //moveSync(source, dest, {overwrite: true} );
  }

  else {
    // It's a directory. Make a new one.
    ensureDir(dest);

    // Loop through the contents recursing
    let contents = readdirSync(source);

    for (let content of contents) {
      let newName = basename(content).replace(/ /g, "-").toLowerCase();
      moveFiles(`${source}/${content}`, `${dest}/${newName}`);
    }
  }
}
