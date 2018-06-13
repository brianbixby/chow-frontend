import React from 'react';
import { connect } from 'react-redux';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { recipeFetch } from '../../actions/search-actions.js';
import { userValidation, formatDate, renderIf } from './../../lib/util.js';

class ProfileContainer extends React.Component {
  constructor(props){
    super(props);
  }
  componentWillMount() {
    userValidation(this.props);
  }

  handleBoundFavoriteDelete = () => {

  };

  handleBoundFavoriteClick = (myRecipe, e) => {
    this.props.recipeFetchRequest(myRecipe.recipe);
    let encoded = encodeURIComponent(myRecipe.recipe.uri);
    return this.props.history.push(`/recipe/${encoded}`);
  };

  render(){
    let { userProfile } = this.props;
    return (
      <div className='page-outer-div'>
        <div className='container'>
          <h1>Profile</h1>
          <p>{userProfile.username}</p>
          <p>Member Since: {formatDate(userProfile.createdOn)}</p>
        </div>
        {renderIf(userProfile.favorites && userProfile.favorites.length > 0,
          <div>
            {favorites.map(favorite => {
              let boundFavoriteDelete = this.handleBoundFavoriteDelete.bind(this, favorite);
              let boundFavoriteClick = this.handleBoundFavoriteClick.bind(this, favorite);
              return <div key={favorite.label} className='favTile col-sm-4 col-xs-3'>
                <div onClick={boundFavoriteClick} className='favTileWoutDeleteButton'>
                  <img className='favPic' src={favorite.image} />
                  <p className='favLabel'>{favorite.label}</p>
                </div>
                <button onClick={boundFavoriteDelete} className='DButton red profileDeleteButton'>
                  <span className='profileDeleteButtonIcon glyphicon glyphicon-remove'> <span className='profileDeleteButtonText'>Delete</span></span>
                </button>
              </div>
            })}
          </div>
        )}
      </div>
    );
  }
}

// go to single pick, delete, favorite, token sign in

let mapStateToProps = (state) => ({
  userProfile: state.userProfile,
})

let mapDispatchToProps = (dispatch) => ({
  tokenSignIn: token => dispatch(tokenSignInRequest(token)),
  recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);