'use strict'
declare var sbot: any
declare var root: Element
declare var pull: any

// HELPERS

function EL (
  nodes: (string|Node)[],
  type: keyof HTMLElementTagNameMap = 'div',
  attributes?: { [key: string]: string }
) {
  const element = document.createElement(type)
  if (attributes) {
    for (let p in attributes) {
      element.setAttribute(p, attributes[p])
    }
  }
  element.append(...nodes)
  return element
}

// DOM SETUP

const BODY = document.createElement('body')
root.innerHTML = ''
root.append(BODY)

const STYLE_E = document.createElement('style')
STYLE_E.innerHTML = '__NCC__style.css__' // NCC will replace this with the contents of style.css
BODY.append(STYLE_E)

const WHOAMI_E = EL([], 'div', { class: 'mini' })
BODY.append(EL([EL(['FEEDER']), WHOAMI_E],'header'))

// SSB SETUP

sbot.whoami((err: any, keys: any) => {
  if (err) console.log('could not get keys, got err', err)
  else {
    WHOAMI_E.append(keys.id)
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