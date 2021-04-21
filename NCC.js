/**
 * Noam’s Crappy Compiler
 *
 * replaces '__NCC__style.css__' in JSFILE by a template-string containing the
 * contents of CSSFILE and generates OUTFILE.
 *
 * JSFILE ──┐
 *          ├─╴» OUTFILE
 * CSSFILE ╶┘
 */

const fs = require('fs')

const JSFILE = './src/feeder.js'
const OUTFILE = './feeder.js'
const CSSFILE = './src/style.css'
let css = ''

function readCSS () {
  fs.readFile(CSSFILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    css = data
    console.log('NCC: ***** READ CSS ******')
    updateJS()
  })
}

function updateJS () {
  fs.readFile(JSFILE, 'utf8', (err, jsstring) => {
    if (err) {
      console.error(err)
      return
    }
    const content = jsstring.replace(/'__NCC__style\.css__'/g, '`' + css + '`')
    fs.writeFile(OUTFILE, content, err => {
      if (err) {
        console.error(err)
        return
      }
      console.log('NCC: ***** UPDATED *****')
    })
  })
}

readCSS()
fs.watch(CSSFILE, 'utf8', _ => readCSS())
fs.watch(JSFILE, 'utf8', _ => updateJS())