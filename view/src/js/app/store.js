const path = __require('path');

let store = microStorage('nina');

const state = _.mapValues({
    excel : '',
    ppt : '',
    output : '',
}, ( value, key ) => store(key) || '');

let mutations = _.mapValues(
    state,
    ( value, key ) => {
        return ( state, value ) => {
            store(key, value);
            state[key] = value;
        };
    },
);

mutations = _.assign(
    mutations,
    {
        // ...
    },
);

export default new Vuex.Store({
    state,
    mutations,
    actions : {
        files ({ commit }, files ) {
            files.forEach(( file ) => {
                let extname = path.extname(file);
                if (extname == '.xlsx') {
                    commit('excel', file);
                }
                if (extname == '.pptx') {
                    commit('ppt', file);
                }
                if (extname == '') {
                    commit('output', file);
                }
            });
        },
    },
});
