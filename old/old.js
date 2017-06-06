#!/usr/bin/env node
const browserify = require('browserify');
const tapeRun = require('tape-run');
const babelify = require('babelify');
const glob = require('glob');
const tape = require('tape');
const tapSpec = require('tap-diff');
const { either, identity, compose, rcompose, mapfn, reducefn } = require('./testUtils');

// test script fns
const extractSpecFileMatchFromArgs = argv => {
  let [,,...specFiles] = argv;
  return specFiles && specFiles.length? specFiles : false;
}

const invalidInput = () => console.log('No valid Spec file has been supplied to the test runner')
const noSpecFilesFound = () => console.log('No valid Spec files were found')
const matchFiles = specFileMatch => new Promise((resolve, reject) => {
  glob(specFileMatch, function (er, files) {
    er? reject(er) : resolve(files);
  })
})

const runTests = (sourceSpec) => {
  browserify(sourceSpec)
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(tapeRun())
    .on('results', results => {
      if (!results.ok) {
        process.exit(1);
      }
    })
    .pipe(tapSpec())
    .pipe(process.stdout);
}

const parseSpecMatch = specFileMatch => {
  matchFiles(specFileMatch)
    .then(
      rcompose(
        files => either(files && files.length? files : false, noSpecFilesFound,identity),
        mapfn(runTests)
      ),
      err => console.log(err));
}

either(extractSpecFileMatchFromArgs(process.argv), invalidInput, mapfn(parseSpecMatch));
