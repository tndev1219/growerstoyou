import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';



export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    // contactSagas(),
    // mailSagas(),
    // notesSagas(),
    // todosSagas(),
    // ecommerceSaga(),
    // cardsSagas(),
    // invoicesSagas(),
    // chatSagas(),
    // youtubeSearchSagas(),
    // devSagas(),
    // articles(),
    // investors(),
  ]);
}