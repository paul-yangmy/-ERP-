import { queryIndent, queryIndentByItemId, queryDetailByIndId, createIndent,updateIndent } from '../services/indent';

export default {
    namespace: 'indent',
    state: {
        // buttonSelection,
        indent: [],
    },

    effects: {
        *queryIndent({ payload, callback }, { call, put }) {
            const response = yield call(queryIndent, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            // console.log(response);
            if (callback) callback(response);
        },

        *queryIndentByItemId({ payload, callback }, { call, put }) {
            const response = yield call(queryIndentByItemId, payload);
            console.log(response);
            if (callback) callback(response);
        },

        *queryDetailByIndId({ payload, callback }, { call, put }) {
            const response = yield call(queryDetailByIndId, payload);
            // console.log(payload);
            // console.log(response);
            if (callback) callback(response);
        },
        *create({ payload, callback }, { call }) {
            console.log(payload)
            const response = yield call(createIndent, payload);
            if (callback) {
                callback(response);
            }
        },
        *update({ payload, callback }, { call }) {
            console.log(payload)
            const response = yield call(updateIndent, payload);
            if (callback) {
                callback(response);
            }
        },
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                indent: action.payload,
            };
        },
    },
};
