import { queryTransportation, queryByDate, queryByLine, queryDriver, deleteDriver, createDriver, updateDriverState, updateDriver} from '../services/transportation';

export default {
    namespace: 'transportation',
    state: {
        transportation: [],
    },

    effects: {
        *queryTransportation({ payload, callback }, { call, put }) {
            const response = yield call(queryTransportation, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            console.log(response);
            if (callback) callback(response);
        },
        *queryDriver({ payload, callback }, { call, put }) {
            const response = yield call(queryDriver, payload);
            if (callback) callback(response);
        },
        *queryByDate({ payload, callback }, { call, put }) {
            const response = yield call(queryByDate, payload);
            console.log(payload);
            console.log(response);
            if (callback) callback(response);
        },
        *queryByLine({ payload, callback }, { call, put }) {
            const response = yield call(queryByLine, payload);
            console.log(payload);
            console.log(response);
            if (callback) callback(response);
        },

        *updateDriverState({ payload, callback }, { call, put }) {
            // console.log(payload)
            const response = yield call(updateDriverState, payload);
            if (callback) {
                callback(response);
            }
        },
        *updateDriver({ payload, callback }, { call }) {
            // console.log(payload)
            const response = yield call(updateDriver, payload);
            if (callback) {
                callback(response);
            }
        },
        *createDriver({ payload, callback }, { call }) {
            // console.log(payload)
            const response = yield call(createDriver, payload);
            if (callback) {
                callback(response);
            }
        },
        *deleteDriver({ payload, callback }, { call, put }) {
            // console.log(payload)
            const response = yield call(deleteDriver, payload);
            console.log(response)
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback) {
                callback(response);
            }
        },
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                transportation: action.payload,
            };
        },
    },
};
