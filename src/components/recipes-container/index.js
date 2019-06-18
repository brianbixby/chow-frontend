import React from 'react';
import { connect } from 'react-redux';

import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteFetchRequest } from '../../actions/favorite-actions.js';
import { recipesFetchRequest, recipeFetch } from '../../actions/search-actions.js';
import { logError, renderIf, userValidation, classToggler } from './../../lib/util.js';

class RecipesContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {userSuccess: false};
  }

  componentWillMount() {
    userValidation(this.props);
    if (this.props.recipes.length == 0) {
      let string = window.location.href.split('/search/')[1];
      let hashIndex = string.indexOf('&');
      this.props.recipesFetch(string.substring(0, hashIndex), string.substring(hashIndex, string.length))
        .catch(err => logError(err));
    }
    window.scrollTo(0, 0);
  }

  handleBoundRecipeClick = (myRecipe, e) => {
    this.props.recipeFetchRequest(myRecipe.recipe);
    let uri = myRecipe.recipe.uri.split('recipe_')[1];
    return this.props.history.push(`/recipe/${uri}`);
  };

  handleBoundFavoriteClick = (favorite, e) => {
    if (this.props.userAuth) {
      this.props.favoriteFetch(favorite.recipe)
        .then(() => this.handleUserSuccess())
        .catch(err => logError(err));
    }
  };

  handleUserSuccess = () => {
    this.setState({userSuccess: true});
    setTimeout(() => this.setState({userSuccess: false}), 5000);
  };
  
  calsPS = (cals, servings) => Math.round(cals/servings);

  render() {
    let { recipes } = this.props;
    return (
      <div className='container-fluid'>
        {renderIf(!recipes,
          <div className='resultCountDiv'>
            Sorry, no results. Please try modifying your search.
          </div>
        )}
        <div className='recipesOuter'>
          {renderIf(recipes,
            <div>
            <div className='resultCountDiv'>
              <p>{recipes.count} recipe results for <span>"{recipes.q}"</span></p>
            </div>
            {recipes.hits &&
                      <div className='recipesSection'>
                        {recipes.hits.map(myRecipe => {
                          let boundRecipeClick = this.handleBoundRecipeClick.bind(this, myRecipe);
                          let boundFavoriteClick = this.handleBoundFavoriteClick.bind(this, myRecipe);
                          return <div key={myRecipe.recipe.uri} className='outer'>
                                  <div className='cardImageContainer' onClick={boundRecipeClick}>
                                    <img className='cardImage' src={myRecipe.recipe.image} />
                                  </div>
                                  <div className='likeButton' onClick={boundFavoriteClick}></div>
                                  <div className='cardInfo' onClick={boundRecipeClick}>
                                    <div className='byDiv'>
                                      <p className='byP'><a className='byA' rel='noopener noreferrer' target='_blank' href={myRecipe.recipe.url}>{myRecipe.recipe.source}</a></p>
                                    </div>
                                    <div className='cardInfoDiv'>
                                    <h3 className='cardTitle'>{myRecipe.recipe.label} </h3>
                                    <p className='healthLabels'>{myRecipe.recipe.healthLabels.join(", ")} </p>
                                    <p className='calsAndIngreds'> 
                                    <span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(myRecipe.recipe.calories, myRecipe.recipe.yield)}</span> CALORIES   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {myRecipe.recipe.ingredientLines.length} </span>   INGREDIENTS</span>
                                    </p>
                                    </div>
                                  </div>
                          </div> 
                        })}
                      </div>
            }
            </div>
          )}
        </div>
        <div className={classToggler({'sliderPopup': true, 'clozed': this.state.userSuccess })} onClick={() => this.setState({userSuccess: false})}>
          <p>Favorite added.</p>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => ({
  recipes: state.recipes,
  userAuth: state.userAuth,
});

let mapDispatchToProps = dispatch => {
  return {
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
    recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipesContainer);