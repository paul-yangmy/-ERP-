import { queryFinance,queryByDate } from '../services/finance';

export default {
    namespace: 'finance',
    state: {
        finance: [],
    },

    effects: {
        *queryFinance({ payload, callback }, { call, put }) {
            const response = yield call(queryFinance, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            // console.log(response);
            if (callback) callback(response);
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
                finance: action.payload,
            };
        },
    },
};
