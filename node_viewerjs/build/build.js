"use strict";
require('shelljs/global');

const shell      = require('shelljs'),
      path       = require('path'),
      fs         = require('fs'),
      releaseDir = './release',
      sourceDir  = './src',
      sourcePdf  = './node_modules/pdfjs-dist',
      file       = filename => {
          return path.resolve(sourceDir, filename)
      };

shell.cp(path.resolve(sourceDir, 'index.html'), releaseDir);
shell.cp(path.resolve(sourceDir, 'example.local.css'), releaseDir);
shell.cp(path.resolve(sourcePdf, './build/pdf.js'), releaseDir);
shell.cp(path.resolve(sourcePdf, './build/pdf.worker.js'), releaseDir);
shell.cp(path.resolve(sourcePdf, './web/compatibility.js'), releaseDir);
shell.cp(path.resolve(sourceDir, 'ODFViewerPlugin.js'), releaseDir);
shell.cp(path.resolve(sourceDir, 'PDFViewerPlugin.js'), releaseDir);
shell.cp(path.resolve(sourceDir, 'ImageViewerPlugin.js'), releaseDir);
shell.cp(path.resolve(sourceDir, 'MultimediaViewerPlugin.js'), releaseDir);
shell.cp(path.resolve(sourceDir, 'UnknownFilePlugin.js'), releaseDir);

shell
    .cat([file('additionals.js'),
        file('viewer.js'),
        file('PluginLoader.js')])
    .to(path.resolve(releaseDir, 'viewer.js'));

shell
    .cat([file('ODFViewerPlugin.css'),
        file('PDFViewerPlugin.css'),
        file('ImageViewerPlugin.css'),
        file('UnknownFilePlugin.css'),
        file('viewer.css')
        //,file('viewerTouch.css')
    ])
    .to(path.resolve(releaseDir, 'viewer.css'));

console.info('Build Ok');