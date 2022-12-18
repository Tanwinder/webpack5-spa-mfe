import { all } from 'redux-saga/effects';
import { counterSaga } from '../../features/Counter/counterSaga';

export default function* rootSaga() {
  yield all([...counterSaga]);
}
