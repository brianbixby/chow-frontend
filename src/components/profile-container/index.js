import React from 'react';
import { connect } from 'react-redux';

import UserProfileForm from '../userProfile-form';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteDeleteRequest } from '../../actions/favorite-actions.js';
// import { recipeFetchRequest } from '../../actions/search-actions.js';
import { recipeFetch } from '../../actions/search-actions.js';
import { userValidation, logError, formatDate, renderIf } from './../../lib/util.js';

class ProfileContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentWillMount() {
    return userValidation(this.props);
  }

  handleProfileUpdate = profile => {
    return this.props.userProfileUpdate(profile)
      .catch(err => logError(err));
  };

  handleBoundRecipeClick = (favorite, e) => {
    this.props.recipeFetchRequest(favorite);
    let uri = favorite.uri.split('#recipe_')[1];
    return this.props.history.push(`/recipe/${uri}`);
  };

  handleboundDeleteFavoriteClick = (favorite, e) => {
    if (this.props.userAuth) {
      this.props.favoriteDelete(favorite)
        .then(() => alert("favorite deleted."))
        .catch(err => logError(err));
    }
  };

  calsPS = (cals, servings) => Math.round(cals/servings);
  
  render(){
    let profileImage = this.props.userProfile && this.props.userProfile.image ? this.props.userProfile.image : require('./../helpers/assets/icons/profilePlaceholder.jpeg');
    let name = this.props.userProfile.username;
    let { favorites } = this.props;
    return (
      <div className='profile-container page-outer-div'>
        <div className='page-form'>
          <div className='profileWrapper'>
            <div className='inner-wrapper'>
              <div className='profile-image-div'>
                <img className='profile-image' src={profileImage} />
                <p className='mainContainerHeader'>{name}</p>
                <p className='profileDate'>Member Since: {formatDate(this.props.userProfile.createdOn)}</p>
              </div>
            </div>
            </div>
          </div>
          <div className='page-form'>
            <UserProfileForm 
              userProfile={this.props.userProfile} 
              onComplete={this.handleProfileUpdate}
            />
          </div>
        <div className='recipesOuter'>
          <p className='favoritesHeader'>Favorites</p>
          {renderIf(favorites && favorites.length > 0 ,
            <div className='recipesSection'>
              {favorites.map((fav, idx) => {
                let boundRecipeClick = this.handleBoundRecipeClick.bind(this, fav);
                let boundDeleteFavoriteClick = this.handleboundDeleteFavoriteClick.bind(this, fav);
                return <div key={idx} className='outer'>
                        <div className='cardImageContainer' onClick={boundRecipeClick}>
                          <img className='cardImage' src={fav.image} />
                        </div>
                        <div className='likeButton' onClick={boundDeleteFavoriteClick} title="Remove this recipe from your favorites"></div>
                        <div className='cardInfo' onClick={boundRecipeClick}>
                          <div className='byDiv'>
                            <p className='byP'><a className='byA' rel='noopener noreferrer' target='_blank' href={fav.url}>{fav.source}</a></p>
                          </div>
                          <div className='cardInfoDiv'>
                          <h3 className='cardTitle'>{fav.label} </h3>
                          <p className='healthLabels'>{fav.healthLabels.join(", ")} </p>
                          <p className='calsAndIngreds'> 
                          <span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(fav.calories, fav.yield)}</span> CALORIES   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {fav.ingredientLines.length} </span>   INGREDIENTS</span>
                          </p>
                          </div>
                        </div>
                </div> 
              })}
            </div>
          )}
          {renderIf(favorites && favorites.length < 1,
            <p className='noFavorites'>No saved Favories.</p>
          )}
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => ({
  userAuth: state.userAuth,
  userProfile: state.userProfile,
  favorites: state.favorites,
})

let mapDispatchToProps = (dispatch) => ({
  // recipeFetch: recipeURI => dispatch(recipeFetchRequest(recipeURI)),
  recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);