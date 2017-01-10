import Actions from '../actions';

export default function fetchReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.fetchResponseSuccess:
      return { ...state, claim: action.body }
  }
  return state || {};
}