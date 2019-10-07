import actions from "./actions";

const initState = { 
  idToken: null,
  idProfile: null,
	waiting: false 
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        idToken: action.token,
        idProfile: action.profile
      };
    case actions.AUTHORIZATION_CHECK_SUCCESS:
      return {
        ...state,
         idToken: action.token,
         idProfile: action.profile
      };
    case actions.LOGOUT:
      return initState;
    case actions.WAITING:
			return {
        ...state,
				waiting: action.status
      }
    case actions.PROFILE_UPDATE:
			return {
        ...state,
        idToken: JSON.parse(action.profile).token,
				idProfile: action.profile
			}
    default:
      return state;
  }
}
