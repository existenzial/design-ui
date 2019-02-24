/* ./lib/index.js */
const fs = require('fs');
const ncp = require('ncp').ncp;

/**
 * Console Extensions
 */
console.line = console.log.bind(console, '\n---');
console.fix = console.log.bind(console, '\n🔧 ');
console.derp = console.log.bind(console, '\n💥 ');
console.created = console.log.bind(console, '\n🎉 ');

/**
 * Fixes project package.json with the given name
 *
 * @param {String} projectName
 */
const fixPackageJSON = projectName => {
  console.line();
  console.fix('Fixing package.json...');
  console.line();

  const packageJSON = 'package.json';
  const json = JSON.parse(fs.readFileSync(packageJSON).toString());

  json.name = projectName;
  json.version = '1.0.0';

  delete json.author;
  delete json.repository;
  delete json.global;
  delete json.bin;

  try {
    fs.writeFileSync(packageJSON, JSON.stringify(json, null, 2));
  } catch (err) {
    console.derp();
    console.error(err);
  }
};

/**
 * Copies + Moves Files
 *
 * @param {String} projectName
 */
const copyFiles = projectName => {
  const start = Date.now();

  try {
    const options = {
      filter: /^bin|lib/gi,
    };

    ncp(`${__dirname}/../`, projectName, options, err => {
      if (err) {
        console.derp();
        return console.error(err);
      }

      fixPackageJSON(projectName);

      return console.created(`Done! (${Date.now() - start}ms)\n`);
    });
  } catch (err) {
    console.derp();
    console.error(err);
  }
};

module.exports = {
  create: copyFiles,
};