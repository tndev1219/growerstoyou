import { all, takeEvery, call, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import actions from './actions';
import { SHOW_ALERT, SHOW_CONFIRM_ALERT, UPDATE_CARTDATA, INIT_CARTDATA } from '../../actions/types';
import { clearToken, getToken, getProfile } from '../../util';
import { api } from '../../api';
import userRole from '../../assets/data/userRole';
import appConfig from '../../constants/AppConfig';

export function* signupRequest() {
  yield takeEvery(actions.SIGNUP_REQUEST, function*(payload) {
    try {
      const signupPayload = {
        fname: payload.signupData.firstName,
        lname: payload.signupData.lastName,
        address: payload.signupData.streetAddress,
        city: payload.signupData.townCity,
        state: payload.signupData.state,
        zipcode: payload.signupData.zip,
        email: payload.signupData.email,
        password: payload.signupData.password,
				phone: payload.signupData.phoneNumber,
				baseurl: `${appConfig.BASE_URL}sign-in/`
      };
      if (payload.signupData.usertype === "Customer") {
        signupPayload['role'] = userRole.customer;
      } else if (payload.signupData.usertype === "Farmer") {
        signupPayload['role'] = userRole.farmOwner;
        signupPayload['farm_name'] = payload.signupData.farmName;
        signupPayload['farm_address'] = payload.signupData.farmStreetAddress;
        signupPayload['farm_city'] = payload.signupData.farmTownCity;
        signupPayload['farm_state'] = payload.signupData.farmState;
        signupPayload['farm_zipcode'] = payload.signupData.farmZip;
        signupPayload['farm_link_phone'] = payload.signupData.farmPhoneNumber;
        signupPayload['farm_link_url'] = (payload.signupData.farmURL ? payload.signupData.farmURL : '');
      } else {
        signupPayload['role'] = userRole.driver;
        signupPayload['license_number'] = payload.signupData.licenseNumber;
        signupPayload['issued_date'] = payload.signupData.issuedDate;
        signupPayload['expired_date'] = payload.signupData.expiryDate;
        signupPayload['driver_address'] = payload.signupData.driverStreetAddress;
        signupPayload['driver_city'] = payload.signupData.driverTownCity;
        signupPayload['driver_state'] = payload.signupData.driverState;
        signupPayload['driver_zipcode'] = payload.signupData.driverZip;
        signupPayload['license_id'] = payload.signupData.uploadID;
      }
      const res = yield call(api.POST, 'signup', signupPayload);
      if (res.data.success) {
        yield put({
          type: actions.SIGNUP_SUCCESS
        });
      } else if (res.data.errcode === 409) {
        yield put({ 
          type: SHOW_CONFIRM_ALERT,
          payload: {
            message: 'The same email already exists. Do you want to login?'
          }
        });
      } else {
        yield put({ 
          type: SHOW_ALERT,
          payload: {
            message: res.data.message,
            alertType: 'error'             
          }
        });
      }
      yield put({
        type: actions.WAITING,
        status: false
      }); 
    } catch (err) {
			yield put({
				type: actions.WAITING,
				status: false
			}); 
      yield put({ 
        type: actions.SIGNUP_ERROR 
      });
    }
  })
}

export function* signupSuccess() {
  yield takeEvery(actions.SIGNUP_SUCCESS, function*() {
    yield put({ 
      type: SHOW_ALERT,
      payload: {
        message: 'Successful registration! We have sent you an email, Please check your email.',
        alertType: 'success'         
      }
    });
    yield put(push('/sign-in'));
  });
}

export function* signupError() {
  yield takeEvery(actions.SIGNUP_ERROR, function*() {
    yield put({ 
      type: SHOW_ALERT,
      payload: {
        message: "Failed to register. Please try again later...",
        alertType: 'error'         
      }
    });
  });
}

export function* loginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, function*(payload) {
    try {
      const loginPayload = {
        email: payload.loginData.email,
        password: payload.loginData.password
      };
      const res = yield call(api.POST, 'signin', loginPayload);
      if (res.data.success) {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        yield put({
          type: actions.LOGIN_SUCCESS,
          token: res.data.results.token,
          profile: JSON.stringify(res.data.results)
        });
      } else {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        yield put({ 
          type: SHOW_ALERT,
          payload: {
            message: res.data.message,
            alertType: 'error'             
          }
        });
      }
    } catch (err) {
			yield put({
				type: actions.WAITING,
				status: false
			}); 
      yield put({ 
        type: actions.LOGIN_ERROR 
      });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {

    yield localStorage.setItem('id_token', payload.token);
    yield localStorage.setItem('id_profile', payload.profile);

    var role = payload.profile && JSON.parse(payload.profile).role;
    var token = payload.profile && JSON.parse(payload.profile).token;
    var userid = payload.profile && JSON.parse(payload.profile).id;
    if (parseInt(role) === 2 || parseInt(role) === 3) {
      yield put(push('/farmer'));
    } else if (parseInt(role) === 4) {
      yield put(push('/driver'));
    } else {
      payload = {
        token: token,
        userid: userid
      }
      yield put({
        type: UPDATE_CARTDATA,
        payload: payload
      })
      yield put(push('/'));
    }
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {
    yield put({ 
      type: SHOW_ALERT,
      payload: {
        message: "Login Failed. Please try again later...",
        alertType: 'error'         
      }
    });
  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/sign-in'));
  });
}

export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const token = getToken();
    const profile = getProfile();
    if (token) {
      yield put({
        type: actions.AUTHORIZATION_CHECK_SUCCESS,
        token,
        profile
      });
      var payload = {
        token: token,
        userid: profile && JSON.parse(profile).id
      };
      yield put({
        type: UPDATE_CARTDATA,
        payload: payload
      })
    }
  });
}

export function* sendEmail() {
	yield takeEvery(actions.SEND_EMAIL, function*(payload) {
		try {
      const sendData = {
				email: payload.sendData.email,
				baseurl: `${appConfig.BASE_URL}reset-password/`
      };

      const res = yield call(api.POST, 'forgotpassword', sendData);
      if (res.data.success) {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        // yield put({
        //   type: actions.SIGNUP_SUCCESS
        // });
      } else {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        // yield put({ 
        //   type: SHOW_ALERT,
        //   payload: {
        //     message: res.data.message,
        //     alertType: 'error'             
        //   }
        // });
      }
    } catch (err) {
			yield put({
				type: actions.WAITING,
				status: false
			}); 
      // yield put({ 
      //   type: actions.SIGNUP_ERROR 
      // });
    }
	});
}

export function* sendNewPassword() {
	yield takeEvery(actions.SEND_NEW_PASSWORD, function*(payload) {
		try {
      const sendData = {
        email: payload.sendData.newPassword
      };

      const res = yield call(api.POST, 'resetpassword', sendData);
      if (res.data.success) {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        // yield put({
        //   type: actions.SIGNUP_SUCCESS
        // });
      } else {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        // yield put({ 
        //   type: SHOW_ALERT,
        //   payload: {
        //     message: res.data.message,
        //     alertType: 'error'             
        //   }
        // });
      }
    } catch (err) {
			yield put({
				type: actions.WAITING,
				status: false
			}); 
      // yield put({ 
      //   type: actions.SIGNUP_ERROR 
      // });
    }
	});
}

export function* profileUdpate() {
  yield takeEvery(actions.PROFILE_UPDATE, function*(payload) {
    yield localStorage.setItem('id_profile', payload.profile);
    yield localStorage.setItem('id_token', JSON.parse(payload.profile).token);
  });
}

export function* updateCartData() {
  yield takeEvery(UPDATE_CARTDATA, function*(payload) {
    yield put({
      type: actions.WAITING,
      status: true
    }); 
    try {
      payload = {
        token: payload.payload.token,
        userid: payload.payload.userid
      };
      const res = yield call(api.POST, 'basket/getbyuserid', payload);
      if (res.data.success) {
				yield put({
					type: actions.WAITING,
					status: false
        }); 
        yield put({
          type: INIT_CARTDATA,
          cartData: res.data.results
        });
      } else {
				yield put({
					type: actions.WAITING,
					status: false
				}); 
        yield put({ 
          type: SHOW_ALERT,
          payload: {
            message: 'Failed to fetch cart data. Please try again later...',
            alertType: 'error'             
          }
        });
      }
    } catch (err) {
			yield put({
				type: actions.WAITING,
				status: false
			}); 
      yield put({ 
        type: SHOW_ALERT,
        payload: {
          message: 'Failed to fetch cart data. Please try again later...',
          alertType: 'error'             
        }
      });
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(signupRequest),
    fork(signupSuccess),
    fork(signupError),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
		fork(logout),
		fork(sendEmail),
    fork(sendNewPassword),
    fork(profileUdpate),
    fork(updateCartData)
  ]);
}
