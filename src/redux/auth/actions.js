const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  AUTHORIZATION_CHECK_SUCCESS: 'AUTHORIZATION_CHECK_SUCCESS',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
	SIGNUP_ERROR: 'SIGNUP_ERROR',
	WAITING: 'WAITING',
	SEND_EMAIL: 'SEND_EMAIL',
  SEND_NEW_PASSWORD: 'SEND_NEW_PASSWORD',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (loginData) => ({
    type: actions.LOGIN_REQUEST,
    loginData
  }),
  logout: () => ({
    type: actions.LOGOUT
  }),
  signup: (signupData) => ({
    type: actions.SIGNUP_REQUEST,
    signupData
  }),
  waiting: (status) => ({
		type: actions.WAITING,
		status
	}),
	sendEmail: (sendData) => ({
		type: actions.SEND_EMAIL,
		sendData
	}),
	sendNewPassword: (sendData) => ({
		type: actions.SEND_NEW_PASSWORD,
		sendData
  }),
  profileUpdate: (profile) => ({
    type: actions.PROFILE_UPDATE,
		profile
  })
};
export default actions;
