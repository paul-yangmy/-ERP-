import { queryPurchase, queryByBuyId, queryDetailByBuyId, deletePurchase, createPurchase, updatePurchase, updatePurchaseState, queryOnDemandyPurchase } from '../services/purchase';

export default {
    namespace: 'purchase',
    state: {
        // buttonSelection,
        Purchase: [],
    },

    effects: {
        *queryPurchase({ payload, callback }, { call, put }) {
            const response = yield call(queryPurchase, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            // console.log(response);
            if (callback) callback(response);
        },
        *queryOnDemandyPurchase({ payload, callback }, { call, put }) {
            const response = yield call(queryOnDemandyPurchase, payload);
            
            console.log(response);
            if (callback) callback(response);
        },
        

        *queryDetailByBuyId({ payload, callback }, { call, put }) {
            const response = yield call(queryDetailByBuyId, payload);
            console.log(payload);
            console.log(response);
            if (callback) callback(response);
        },
        *updateState({ payload, callback }, { call, put }) {
            // console.log(payload)
            const response = yield call(updatePurchaseState, payload);
            if (callback) {
                callback(response);
            }
        },
        *updatePurchase({ payload, callback }, { call }) {
            // console.log(payload)
            const response = yield call(updatePurchase, payload);
            if (callback) {
                callback(response);
            }
        },
        *create({ payload, callback }, { call }) {
            console.log(payload)
            const response = yield call(createPurchase, payload);
            if (callback) {
                callback(response);
            }
        },
        *delete({ payload, callback }, { call, put }) {
            console.log(payload)
            const response = yield call(deletePurchase, payload);
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
                purchase: action.payload,
            };
        },
    },
};
