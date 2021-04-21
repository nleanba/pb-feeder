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
STYLE_E.innerHTML = '__NCC__style.css__';
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
