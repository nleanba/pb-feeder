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
STYLE_E.innerHTML = '__NCC__style.css__';
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
