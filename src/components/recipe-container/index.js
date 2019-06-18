import React from 'react';
import { connect } from 'react-redux';

import RecipesMap from '../recipes-map';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteFetchRequest } from '../../actions/favorite-actions.js';
import { recipeFetchRequest, recipesFetchRequest } from '../../actions/search-actions.js';
import { logError, renderIf, classToggler, userValidation } from './../../lib/util.js';

class RecipeContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount() {
    userValidation(this.props);
    let uri = window.location.href.split('/recipe/')[1];
    if (!this.props.recipe || this.props.recipe.uri != `http://www.edamam.com/ontologies/edamam.owl#recipe_${uri}`) {
      this.props.recipeFetch(uri)
        .then(() => {
          if (!this.props.recipes.length) {
            this.props.recipesFetch("search?q=summer", "&calories=0-10000")
              .catch(err => logError(err));
          }
        })
        .catch(err => logError(err));
    } else if(!this.props.recipes.length) {
      this.props.recipesFetch("search?q=summer", "&calories=0-10000")
        .catch(err => logError(err));
    }
    window.scrollTo(0, 0);
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
  handleRedirect = url => {
    this.props.history.push(url);
    return window.scrollTo(0, 0);
  };

  render() {
    let { recipe } = this.props;
    let cal = require('./../helpers/assets/icons/cal.icon.svg');
    let serving = require('./../helpers/assets/icons/serving.icon.svg');
    return (
      <div>
      {recipe &&
      <div className='container'>
        {renderIf(!recipe || recipe && recipe.length < 1,
          <div>
            Sorry, no results.
          </div>
        )}
        {renderIf(recipe && recipe.uri && recipe.uri.length > 0 && recipe.digest.length > 0,
          <div className='irContainer'>
            <div className='irMain'>
              <div className='irHead'>
                <div className='irImgContainerDisplaySmall'>
                  <div className='irImgContainerInnerWrapper'>
                    <img className='irImg' src={recipe.image} />
                  </div>
                </div>
                <div className='irMainInfo'>
                  <p className='irLabel'>{recipe.label}</p>
                  <div className='irhealthLabels'>
                    <div className='irhealthLabelsInner'>
                      {recipe.healthLabels.map((label, idx) => {
                        let span = idx == recipe.healthLabels.length - 1 ? <span></span> : <span>|</span>;
                        return <p key={idx} className=''>{label}{span}</p>
                      })}
                    </div>
                  </div>
                  <p className='irSource'>Recipe by: <a rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
                  {/* <button className='irFavButton' onClick={this.handleFavoriteClick} id='favoriteButton' className='btn btn-primary'>
                    <span className='glyphicon glyphicon-bookmark'></span> Save
                  </button> */}
                </div>
                <div className='irImgContainerDisplayLarge'>
                  <img className='irImg' src={recipe.image} />
                </div>
              </div>
              <div className='recipeColumn'>
                <div className='irIngredients'>
                  <h2 className='irIngredientHead irSectionHeader'> {recipe.ingredientLines.length} Ingredients</h2>
                  {recipe.ingredientLines.map((ingredient, idx) => {
                    return <div key={idx} className=''>
                        <p>{ingredient}</p>
                      </div>
                  })}
                </div>
                <div className='irDirections hideSmall'>
                  <h2 className='irDirectionsHead irSectionHeader'> Directions</h2>
                  <p><a className='button' rel="noopener noreferrer" target="_blank" href={recipe.url}>Directions</a> <span className='gray'>on</span> <a className='link' rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
                </div>
              </div>
              <div className='irNutrition'>
                <h2 className='irNutritionHead irSectionHeader'>Nutrition
                <span className='iconOuter'>
                  <span className='iconInner'>
                    <span className='recipeIconsDiv'>{parseInt(recipe.calories)} <span className='hideMobile'>cals</span></span>
                    <img src={cal} className='iconScale'/>
                  </span>
                </span>
                <span className='iconOuter servingIcon'>
                  <span className='iconInner'>
                    <span className='recipeIconsDiv'>{recipe.yield} <span className='hideMobile'>servings</span></span>
                    <img src={serving} className='iconScale'/>
                  </span>
                </span>
                </h2>
                <div className='totalNutrientColumn'>
                  {recipe.digest.map((digest, idx) => {
                    let total = parseInt(digest.total/recipe.yield);
                    let percent = parseInt(digest.daily/recipe.yield);
                    percent = percent > 0 ? `${percent}%` : "-";
                    return <div key={idx} className='nutrientRow'>
                        <p><span className='nutrientColumnLabel'>{digest.label}</span><span className='nutrientColumnPercent'>{percent}</span><span className='nutrientColumnTotal'>{total}{digest.unit}</span></p>
                      </div>
                  })}
                </div>
              </div>
              <div className='irDirections hideBig'>
                <h2 className='irDirectionsHead irSectionHeader'> Directions</h2>
                <p><a className='button' rel="noopener noreferrer" target="_blank" href={recipe.url}>Directions</a> <span className='gray'>on</span> <a className='link' rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
              </div>
            </div>
            <div className='aside'>
              <h2 className='irSectionHeader'> Recommended</h2>
              {renderIf(this.props.recipes.hits && this.props.recipes.hits.length > 0,
                <RecipesMap recipes={this.props.recipes.hits} containerClass={"individualRecipeOuter"} redirect={this.handleRedirect}/> 
              )}
            </div>
          </div>
        )}
      </div>
    }</div>
    );
  }
}

let mapStateToProps = state => ({
  recipe: state.recipe,
  recipes: state.recipes,
});

let mapDispatchToProps = dispatch => {
  return {
    favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    recipeFetch: query => dispatch(recipeFetchRequest(query)),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeContainer);