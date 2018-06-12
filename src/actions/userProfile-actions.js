import superagent from 'superagent';

export const userProfileUpdate = userProfile => ({
  type: 'USERPROFILE_UPDATE',
  payload: userProfile,
});

export const userProfileFavoritesUpdate = userProfile => ({
  type: 'USERPROFILE_FAVORITES_UPDATE',
  payload: userProfile,
});

export const userProfileFetch = userProfile => ({
  type: 'USERPROFILE_FETCH',
  payload: userProfile,
});

export const userProfileUpdateRequest = profile => (dispatch, getState) => {
  let { userAuth, userProfile } = getState();
  
  return superagent.put(`${process.env.API_URL}/api/profile/${userProfile._id}`)
    .set('Authorization', `Bearer ${userAuth}`)
    .send(profile)
    .then( res => {
      dispatch(userProfileUpdate(res.body));
      return res;
    });
};

export const userProfileFavoritesUpdateRequest = favorite => (dispatch, getState) => {
  let { userAuth, userProfile } = getState();

  return superagent.put(`${process.env.API_URL}/api/favorites`)
    .set('Authorization', `Bearer ${userAuth}`)
    .send(favorite)
    .then(res => {
      dispatch(userProfileFavoritesUpdate(res.body));
      return res.body;
    });
};

export const userProfileFetchRequest = ()  => (dispatch, getState) => {
  let { userAuth } = getState();
  return superagent.get(`${process.env.API_URL}/api/profiles/currentuser`)
    .set('Authorization', `Bearer ${userAuth}`)
    .then(res => {
      dispatch(userProfileFetch(res.body));
      return res;
    });
};