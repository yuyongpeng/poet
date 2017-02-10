import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import Actions from '../actions'
import config from '../config'

function* fetchProfileData(action: any) {
  const profileResponse = yield call(fetch, config.api.explorer + '/profiles/' + action.profilePublicKey);
  const profile = yield profileResponse.json();
  yield put({ type: Actions.profileDataFetched, profile });
}

function profileSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.fetchProfileData, fetchProfileData);
  }
}

export default profileSaga;