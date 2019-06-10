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
    // let digest = recipe.digest;
    return (
      <div className='container'>
        {renderIf(recipe && recipe.length < 1 ,
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
                  {/* <p className='irhealthLabels'>{recipe.healthLabels.join(`<span> | </span>`)} </p> */}
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
              <div className='irIngredients'>
                <h2 className='irIngredientHead irSectionHeader'> {recipe.ingredientLines.length} Ingredients</h2>
                {recipe.ingredientLines.map((ingredient, idx) => {
                  return <div key={idx} className=''>
                      <p>{ingredient}</p>
                    </div>
                })}
              </div>
              <div className='irNutrition'>
                <h2 className='irNutritionHead irSectionHeader'>Nutrition</h2>
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
              <div className='irDirections'>
                <h2 className='irDirectionsHead irSectionHeader'> Directions</h2>
                <p><a className='button' rel="noopener noreferrer" target="_blank" href={recipe.url}>Directions</a> <span className='gray'>on</span> <a className='link' rel="noopener noreferrer" target="_blank" href={recipe.url}>{recipe.source}</a></p>
              </div>
            </div>
            <div className='aside'>
        
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