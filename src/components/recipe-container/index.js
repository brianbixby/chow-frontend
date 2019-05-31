import React from 'react';
import { connect } from 'react-redux';

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
    return userValidation(this.props);
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
    return (
      <div className='container'>
        <h1> single result</h1>
        {renderIf(recipe && recipe.length < 1 ,
          <div>
            Sorry, no results.
          </div>
        )}
        {renderIf(recipe && recipe.uri.length > 0,
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
                  {/* both a tag below should have on click */}
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

                {recipe.digest.map((myRecipe, idx) => {
                  return <div id='showWhenLargeNutritionalInfo' key={idx}>
                    <div>
                      {/* p below should have on click open  all.isHidingOpen = !all.isHidingOpen*/}
                      <p className='individualResultNutritionButton' id={`all-${idx}`}>
                      {/* what is all */}
                      
                      <span className={classToggler({ 'glyphicon glyphicon-play': !!myRecipe.sub, 'disable-link': !myRecipe.sub })}></span>
                      <span className='individualResultNutritionItemFacts'>{myRecipe.label}</span></p>
                      <span className='individualResultNutritionNumberFacts'>{this.calsPS(myRecipe.total, recipe.yield)} {myRecipe.unit}</span>
                      <span className='individualResultNutritionPercentFacts'>{this.calsPS((myRecipe.total/recipe.yield), myRecipe.daily)}%</span>
                    </div>
                    {/* {myRecipe.sub.map((item, idx) => {
                      return <p key={idx} id={`subitem-${idx}`}>
                        <span className='individualResultNutritionItemDetailedFacts'>{item.label} </span>
                        <span className='individualResultNutritionNumberDetailedFacts'>{this.calsPS(item.total, recipe.yield)}{item.unit} </span>
                        <span className='individualResultNutritionPercentDetailedFacts'>{this.calsPS((item.total/recipe.yield), item.daily)}% </span>
                      </p>
                    })} */}
                  </div>
                })}
                {recipe.digest.map((myRecipe2, idx) => {
                  let boundFavoriteClick = this.handleBoundFavoriteClick.bind(this, myRecipe2);
                  return <div key={idx} className='tile'>
                    <button onClick={boundFavoriteClick} className='allResultsFavButton' type='btn btn-default'>
                      <span className='glyphicon glyphicon-bookmark'></span> <span className='allResultsFavButtonText'>Save</span>
                    </button>
                    <div className='tileWoutFavButton'>
                      <img className='tilePic' src={recipe.image} />
                      <p className='tileLabel'>{recipe.label}</p>
                      <p className='tileCalorieAndIngredientText'><span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(recipe.calories, recipe.yield)}</span> CALORIES   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {recipe.ingredientLines.length} </span>   INGREDIENTS</span></p>
                      <p className='tileCalorieAndIngredientTextHidden'><span className='tileCalorieText'> <span className='tileCalorieTextNumber'> {this.calsPS(recipe.calories, recipe.yield)}</span> CALS   </span>   |   <span className='tileIngredientText'> <span className='tileIngredientTextNumber'> {recipe.ingredientLines.length} </span>   INGR</span></p>
                    </div>
                      <p><a className='tileSource' rel='noopener noreferrer' target='_blank' href={recipe.url}>{recipe.source}</a></p>
                  </div>
                })}
              </div>
              <div id='ingredListDiv' className='col-xs-12 col-sm-6 col-lg-5'>
                  <p className='individualResultIngredientCount'>{recipe.ingredientLines.length} Ingredients</p>
                  {recipe.ingredients.map((ingred, idx) => {
                    return <p className='individualResultIngredients' key={idx}>{ingred.text}</p>
                  })}
                  <p className='individualResultPrep'>Preparation</p>
                  <p>
                    {/* onClick singleResultComp.instructions(recipe.url) */}
                    <button className='btn btn-default'> Instructions </button> on <a rel='noopener noreferrer' target='_blank' href={recipe.url}>{recipe.source}</a>
                  </p>
              </div>
              <div id='showWhenSmallNutritionalInfo' className='col-xs-12 col-sm-6 col-lg-5'>
                {recipe.digest.map((digest2, idx) => {
                  return <div>
                    <div>
                      <p className='individualResultNutritionButton' id={`all-${idx}`}>
                      {/* p tag above onClick  all.isHidingOpen = !all.isHidingOpen */}
                      <span className={classToggler({ 'glyphicon glyphicon-play': digest2.sub, 'disable-link': !digest2.sub })}></span>
                      <span className='individualResultNutritionItemFacts'>{digest2.label}</span></p>
                      <span className='individualResultNutritionNumberFacts'>{this.calsPS(digest2.total, recipe.yield)} {digest2.unit}</span>
                      <span className='individualResultNutritionPercentFacts'>{this.calsPS((digest2.total/recipe.yield), digest2.daily)}%</span>
                    </div>
                    {/* {digest2.sub.map((sub, idx) => {
                      return <p key={idx} id={`subitem-${idx}`}>
                      <span className='individualResultNutritionItemDetailedFacts'>{sub.label} </span>
                      <span className='individualResultNutritionNumberDetailedFacts'>{this.calsPS(sub.total, recipe.yield)}{sub.unit} </span>
                      <span className='individualResultNutritionPercentDetailedFacts'>{this.calsPS((sub.total/recipe.yield), sub.daily)}% </span>
                    </p>
                    })} */}
                  </div>
                })}
              </div>
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