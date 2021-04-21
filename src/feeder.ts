'use strict'
declare var sbot: any
declare var root: Element
declare var pull: any

// DOM SETUP

const BODY = document.createElement('body')
root.innerHTML = ''
root.append(BODY)

const STYLE = document.createElement('style')
STYLE.innerHTML = '__NCC__style.css__' // NCC will replace this with the contents of style.css
BODY.append(STYLE)

// SSB SETUP

sbot.whoami((err: any, keys: any) => {
  if (err) console.log('could not get keys, got err', err)
  else {
    BODY.append(keys.id)
  }
})

//

const opts = {
  limit: 100,
  reverse: true
}

pull(
  sbot.query.read(opts),
  pull.drain(receive)
)

function receive(msg: any) {
  console.log(msg)
  // root.innerHTML += `<textarea rows="16" cols="80">${JSON.stringify(msg, null, 2)}</textarea>`
}