import React from 'react';
import { connect } from 'react-redux';

import RecipeDigest from '../recipe-digest';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteFetchRequest } from '../../actions/favorite-actions.js';
import { recipeFetchRequest } from '../../actions/search-actions.js';
import { logError, renderIf, classToggler, userValidation } from './../../lib/util.js';

// to do check and get recipe search params from url

class RecipeContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount() {
    userValidation(this.props);
    let uri = window.location.href.split('/recipe/')[1];
    if (!this.props.recipe || this.props.recipe.uri != `http://www.edamam.com/ontologies/edamam.owl#recipe_${uri}`) {
      console.log("getting recipe: ");
      this.props.recipeFetch(uri)
        .catch(err => logError(err));
    }
  }
 
  handleBoundFavoriteClick = (favorite, e) => {
    if (this.props.userAuth) {
      this.props.favoriteFetch(favorite.recipe)
        .then(() => alert("favorite added."))
        .catch(err => logError(err));
    }
  };

  calsPS = (cals, servings) => Math.round(cals/servings);
  calsPD = (cals, servings) => (cals/servings/20).toFixed(0);

  render() {
    let { recipe } = this.props;
    let digest = recipe.digest;
    return (
      <div className='container'>
        <h1> single result</h1>
        {renderIf(recipe && recipe.length < 1 ,
          <div>
            Sorry, no results.
          </div>
        )}
        {renderIf(recipe && recipe.uri && recipe.uri.length > 0 && recipe.digest.length > 0,
          <div className='row'>
            <div className='singleResultShowLarge'>
              <div className='row'>
                <div id='individualImgDiv' className='col-xs-12 col-sm-6 col-lg-6'>
                  <img className='individualResultImg' src={recipe.image} />
                </div>

                <div id='summaryDiv' className='col-xs-12 col-sm-6 col-lg-6'>
                  <p className='individualResultLabel'>{recipe.label}</p>
                  <p className='individualResultSource'>See full recipe on: <a rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
                  <button className='individualResultFavButton' onClick={this.handleFavoriteClick} id='favoriteButton' className='btn btn-primary'>
                    <span className='glyphicon glyphicon-bookmark'></span> Save
                  </button>
                  <h5> <span className='individualResultDietLabel'>{recipe.dietLabels}</span> <span className='individualResultHealthLabel'>{recipe.healthLabels}</span></h5>
                </div>
              </div>

              <div id='nutritionalSummaryDiv' className='col-xs-12 col-sm-6 col-lg-5'>
                <p className='individualResultIngredientCount'>Nutrition</p>
                <div className='individualResultNutritionDiv'>
                  <p className='individualResultNutritionBox'> <span className='individualResultNutritionNumber'>{this.calsPS(recipe.calories, recipe.yield)} </span><br/> <span className='individualResultNutritionLable'>CALORIES/SERVING </span></p>
                  <p className='individualResultNutritionBox'> <span className='individualResultNutritionNumber'>{this.calsPD(recipe.calories, recipe.yield)}% </span><br/><span className='individualResultNutritionLable'> DAILY VALUE</span></p>
                  <p className='individualResultNutritionBox'> <span className='individualResultNutritionNumber'>{recipe.yield}</span> <br/><span className='individualResultNutritionLable'> SERVINGS </span> </p>
                </div>
              </div>
              <RecipeDigest digest={digest} recipeYield={recipe.yield}/> 

              <div className='col-lg-2'></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

let mapStateToProps = state => ({
  recipe: state.recipe,
});

let mapDispatchToProps = dispatch => {
  return {
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    recipeFetch: query => dispatch(recipeFetchRequest(query)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeContainer);