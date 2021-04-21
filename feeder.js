'use strict';
function EL(nodes, type = 'div', attributes) {
    const element = document.createElement(type);
    if (attributes) {
        for (let p in attributes) {
            element.setAttribute(p, attributes[p]);
        }
    }
    element.append(...nodes || []);
    return element;
}
function getSelfAssignedName(id) {
    const queryOpts = {
        reverse: true,
        limit: 1,
        query: [{
                $filter: {
                    value: {
                        author: id,
                        content: {
                            type: 'about',
                            about: id,
                            name: { $is: 'string' }
                        }
                    }
                }
            },
            {
                $map: {
                    name: ['value', 'content', 'name']
                }
            }]
    };
    const backlinksOpts = {
        reverse: true,
        limit: 1,
        query: [{
                $filter: {
                    dest: id,
                    value: {
                        author: id,
                        content: {
                            type: 'about',
                            about: id,
                            name: { $is: 'string' }
                        }
                    }
                }
            },
            {
                $map: {
                    name: ['value', 'content', 'name']
                }
            }]
    };
    return new Promise((resolve, reject) => {
        pull(sbot.backlinks ? sbot.backlinks.read(backlinksOpts) : sbot.query.read(queryOpts), pull.collect((err, data) => {
            if (err) {
                reject(err);
            }
            else {
                if (data.length > 0) {
                    resolve(data[0].name);
                }
                else {
                    reject('the user hasn\'t assigned a name to themself yet');
                }
            }
        }));
    });
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
  padding: 4px;
}

.mini {
  color: #242424;
  font-size: x-small;
  line-height: 1rem;
}

.btn-group {
  display: flex;
  background: #eee;
  border-radius: 6px;
  padding: 2px;
}

.btn-group > button {
  display: block;
  background: none;
  border: none;
  border-radius: 4px;
  padding: 2 8px;
  font-size: 14px;
}

.btn-group > button[aria-pressed=true] {
  background: #ccc;
}`;
BODY.append(STYLE_E);
const VIEW_UNIVERSE_E = EL(['Universe'], 'button', { 'aria-pressed': 'false', disabled: 'true' });
const VIEW_LOCAL_E = EL(['Friends'], 'button', { 'aria-pressed': 'false', disabled: 'true' });
const VIEW_MINE_E = EL(['Own'], 'button', { 'aria-pressed': 'true' });
const WHOAMI_E = EL();
BODY.append(EL([EL([VIEW_UNIVERSE_E, VIEW_LOCAL_E, VIEW_MINE_E], 'div', { 'class': 'btn-group' }), WHOAMI_E], 'header'), EL(['Coming soon']));
sbot.whoami((err, { id }) => {
    if (err)
        console.log('could not get keys, got err', err);
    else {
        const NAME_E = EL([id], 'abbr', { title: id });
        WHOAMI_E.append(NAME_E);
        getSelfAssignedName(id).then(name => NAME_E.innerText = name);
    }
});
