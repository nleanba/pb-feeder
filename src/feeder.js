'use strict';
const BODY = document.createElement('body');
root.innerHTML = '';
root.append(BODY);
const STYLE = document.createElement('style');
STYLE.innerHTML = '__MCC__style.css__';
BODY.append(STYLE);
sbot.whoami((err, keys) => {
    if (err)
        console.log('could not get keys, got err', err);
    else {
        BODY.append(keys.id);
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
