import React from 'react';
import { connect } from 'react-redux';

import UserProfileForm from '../userProfile-form';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest, userProfileUpdateRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteDeleteRequest } from '../../actions/favorite-actions.js';
import { recipeFetchRequest } from '../../actions/search-actions.js';
import { userValidation, logError, formatDate, renderIf } from './../../lib/util.js';

// map faves and delete button for faves

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
    console.log(favorite);
    this.props.recipeFetch(favorite.uri)
      .then(() => this.props.history.push(`/recipe/${favorite.label}`))
      .catch(err => logError(err));
  };

  handleboundDeleteFavoriteClick = (favorite, e) => {
    console.log("del fav click: ", favorite)
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
        <div className='grid-container'>
          <div>
            <div className='row'>
              <div className='col-md-8'>
                <div className='createOuter'>
                  <div className='page-form'>
                    <UserProfileForm 
                      userProfile={this.props.userProfile} 
                      onComplete={this.handleProfileUpdate}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-4 hideMedium'>
                <div className='mainContainer'>
                  <div className='mainContainer-header'>
                    <div className='left'>
                      <p className='mainContainerHeader'>{name}</p>
                    </div>
                  </div>
                  <div className='mainContainerSection'>
                    <div className='mainContainerSectionWrapper'>
                      <div className='container'>
                        <div className='inner-wrapper'>
                          <div className='profile-image-div'>
                            <img className='profile-image' src={profileImage} />
                          </div>
                          <div className='userProfileData'>
                            <p>Member Since: {formatDate(this.props.userProfile.createdOn)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-container space-around'>
          {renderIf(favorites && favorites.length > 0 ,
            <div>
              {favorites.map(fav => {
                let boundRecipeClick = this.handleBoundRecipeClick.bind(this, fav);
                let boundDeleteFavoriteClick = this.handleboundDeleteFavoriteClick.bind(this, fav);
                return <div key={fav.uri} className='tile'>
                  <button onClick={boundDeleteFavoriteClick} className='allResultsFavButton' type='btn btn-default'>
                    <span className='glyphicon glyphicon-bookmark'></span> <span className='allResultsFavButtonText'>Save</span>
                  </button>
                  <div className='tileWoutFavButton' onClick={boundRecipeClick}>
                    <img className='tilePic' src={fav.image} />
                    <p className='tileLabel'>{fav.label}</p>
                    <p className='tileCalorieAndIngredientText'><span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(fav.calories, fav.yield)}</span> CALORIES   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {fav.ingredientLines.length} </span>   INGREDIENTS</span></p>
                    <p className='tileCalorieAndIngredientTextHidden'><span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(fav.calories, fav.yield)}</span> CALS   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {fav.ingredientLines.length} </span>   INGR</span></p>
                  </div>
                    <p><a className='tileSource' rel='noopener noreferrer' target='_blank' href={fav.url}>{fav.source}</a></p>
                </div>
              })}
            </div>
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
  recipeFetch: recipeURI => dispatch(recipeFetchRequest(recipeURI)),
  favoriteDelete: favorite => dispatch(favoriteDeleteRequest(favorite)),
  favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
  userProfileFetch: () => dispatch(userProfileFetchRequest()),
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  userProfileUpdate: profile => dispatch(userProfileUpdateRequest(profile)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);