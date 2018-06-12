import { combineReducers } from 'redux';
import userAuth from './userAuth-reducers';
import userProfile from './userProfile-reducers';
import recipes from './recipes-reducers';
import recipe from './recipe-reducers';

export default combineReducers({
  userAuth,
  userProfile,
  recipes,
  recipe,
});