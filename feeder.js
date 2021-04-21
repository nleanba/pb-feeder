'use strict';
function EL(nodes, type = 'div', attributes) {
    const element = document.createElement(type);
    if (attributes) {
        for (let p in attributes) {
            element.setAttribute(p, attributes[p]);
        }
    }
    element.append(...nodes);
    return element;
}
const BODY = document.createElement('body');
root.innerHTML = '';
root.append(BODY);
const STYLE_E = document.createElement('style');
STYLE_E.innerHTML = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  height: 100vh;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

header {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #242424;
  padding: 0.5rem;
}

.mini {
  color: #242424;
  font-size: x-small;
  line-height: 1rem;
}`;
BODY.append(STYLE_E);
const WHOAMI_E = EL([], 'div', { class: 'mini' });
BODY.append(EL([EL(['FEEDER']), WHOAMI_E], 'header'));
sbot.whoami((err, keys) => {
    if (err)
        console.log('could not get keys, got err', err);
    else {
        WHOAMI_E.append(keys.id);
    }
});
const opts = {
    limit: 100,
    reverse: true
};
pull(sbot.query.read(opts), pull.drain(receive));
function receive(msg) {
    console.log(msg);
}
