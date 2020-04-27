import { queryRepository, queryByDate, queryOutStorage, updateOutStorage, updateOutStorageState, queryInStorage, updateInStorage, updateInStorageState} from '../services/repository';

export default {
    namespace: 'repository',
    state: {
        // buttonSelection,
        repository: [],
    },

    effects: {
        *queryRepository({ payload, callback }, { call, put }) {
            const response = yield call(queryRepository, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            // console.log(response);
            if (callback) callback(response);
        },
        *queryOutStorage({ payload, callback }, { call, put }) {
            const response = yield call(queryOutStorage, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            console.log(response);
            if (callback) callback(response);
        },
        *updateOutStorageState({ payload, callback }, { call, put }) {
            // console.log(payload)
            const response = yield call(updateOutStorageState, payload);
            if (callback) {
                callback(response);
            }
        },
        *updateOutStorage({ payload, callback }, { call }) {
            // console.log(payload)
            const response = yield call(updateOutStorage, payload);
            if (callback) {
                callback(response);
            }
        },
        *queryInStorage({ payload, callback }, { call, put }) {
            const response = yield call(queryInStorage, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            console.log(response);
            if (callback) callback(response);
        },
        *updateInStorageState({ payload, callback }, { call, put }) {
            // console.log(payload)
            const response = yield call(updateInStorageState, payload);
            if (callback) {
                callback(response);
            }
        },
        *updateInStorage({ payload, callback }, { call }) {
            // console.log(payload)
            const response = yield call(updateInStorage, payload);
            if (callback) {
                callback(response);
            }
        },
        *queryByDate({ payload, callback }, { call, put }) {
            const response = yield call(queryByDate, payload);
            console.log(payload);
            console.log(response);
            if (callback) callback(response);
        },

        
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                repository: action.payload,
            };
        },
    },
};
