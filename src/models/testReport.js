import { queryAll, CreateTestReport, updateInfo} from '../services/testReport';

export default {
    namespace: 'testReport',
    state: {
        testReport: [],
    },

    effects: {
        *queryAll({ payload, callback }, { call, put }) {
            const response = yield call(queryAll, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            console.log(response);
            if (callback) callback(response);
        },
        *updateInfo({ payload, callback }, { call }) {
            console.log(payload)
            const response = yield call(updateInfo, payload);
            if (callback) {
                callback(response);
            }
        },

        *create({ payload, callback }, { call }) {
            console.log(payload)
            const response = yield call(CreateTestReport, payload);
            if (callback) {
                callback(response);
            }
        },
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                testReport: action.payload,
            };
        },
    },
};
