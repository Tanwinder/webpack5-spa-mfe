import { call, takeEvery, put } from 'redux-saga/effects';
import { incrementByAmount } from './counterSlice';
import { FETCH_NUMBER_SAGA } from './counterActionTypes';
import { getService } from '../../middleware/services/Api';

export function* fetchNumberSaga() {
  try {
    const result = yield call(getService, {
      url: 'http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=1',
    });
    yield put(incrementByAmount(result.data[0]));
  } catch (e) {
    yield put({ type: 'NUMBER_SAGA_FAILED' });
  }
}
export const counterSaga = [takeEvery(FETCH_NUMBER_SAGA, fetchNumberSaga)];
