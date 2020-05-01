import { queryCommodity, queryCommodityByID, deleteCommodity, createCommodity, updateCommodity , updateCommodityState } from '../services/commodity';

export default {
  namespace: 'commodity',
  state: {
    // buttonSelection,
    commodity: [],
  },
  effects: {
    *queryCommodity({ payload, callback }, { call, put }) {
      const response = yield call(queryCommodity, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *queryCommodityByID({ payload, callback }, { call, put }) {
      const response = yield call(queryCommodityByID, payload);
      console.log(response);
      if (callback) callback(response);
    },
    *updateState({ payload, callback }, { call, put }) {
      console.log(payload)
      const response = yield call(updateCommodityState, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateCommodity({ payload, callback }, { call }) {
      // console.log(payload)
      const response = yield call(updateCommodity, payload);
      if (callback) {
        callback(response);
      }
    },
    *create({ payload, callback }, { call }) {
      console.log(payload)
      const response = yield call(createCommodity, payload);
      if (callback) {
        callback(response);
      }
    },
    *delete({ payload, callback }, { call, put }) {
      // console.log(payload)
      const response = yield call(deleteCommodity, payload);
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
        commodity: action.payload,
      };
    },
  },
};
