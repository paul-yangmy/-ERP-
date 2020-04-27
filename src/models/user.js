import { queryCurrent, query as queryUsers, changePwd, userDelete, updateInfo, CreateUser} from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    isLoading: false,
  },
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      console.log(payload)
      const response = yield call(queryUsers, payload);
      // console.log(response)
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },

    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      console.log(response)
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback();
      }
    },

    *changePwd({payload, callback }, { call }) {
      console.log(payload)
      const response = yield call(changePwd,payload);
      if (callback) {
        callback(response);
      }
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
      const response = yield call(CreateUser, payload);
      if (callback) {
        callback(response);
      }
    },

    *delete({ payload, callback }, { call, put }) {
      console.log(payload)
      const response = yield call(userDelete, payload);
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
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    changeLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
};
export default UserModel;
