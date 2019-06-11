import React from 'react';
import { connect } from 'react-redux';

import RecipesMap from '../recipes-map';
// recipe fetch
import { homepageFetchRequest, recipeFetch, recipesFetchRequest } from '../../actions/search-actions.js';
import { tokenSignInRequest } from '../../actions/userAuth-actions.js';
import { userProfileFetchRequest } from '../../actions/userProfile-actions.js';
import { favoritesFetchRequest, favoriteFetchRequest } from '../../actions/favorite-actions.js';
import { userValidation, logError, renderIf } from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentWillMount() {
    userValidation(this.props);
    if (!this.props.homepage || this.props.homepage.length == 0) {
      this.props.homepageFetch()
        .catch(err => logError(err));
    }
  }

  handleBoundItemClick = (item, e) => {
    let queryString = item.link.split("&calories=0-10000")[0];
    let queryParams = "&calories=0-10000";
    return this.props.recipesFetch(queryString, queryParams)
      .then(() => this.props.history.push(`/search/${queryString}${queryParams}`))
      .catch(err => logError(err));
  };

  handleBoundSubitemClick = (subItem, e) => {
    let queryString = subItem.link.split("&calories=0-10000")[0];
    let queryParams = "&calories=0-10000";
    return this.props.recipesFetch(queryString, queryParams)
      .then(() => this.props.history.push(`/search/${queryString}${queryParams}`))
      .catch(err => logError(err));
  };

  handleRedirect = url => {
    return this.props.history.push(url);
  };

  // handleBoundRecipeClick = (myRecipe, e) => {
  //   this.props.recipeFetchRequest(myRecipe.recipe);
  //   let uri = myRecipe.recipe.uri.split('recipe_')[1];
  //   return this.props.history.push(`/recipe/${uri}`);
  // };

  // handleBoundFavoriteClick = (favorite, e) => {
  //   if (this.props.userAuth) {
  //     this.props.favoriteFetch(favorite.recipe)
  //       .then(() => alert("favorite added."))
  //       .catch(err => logError(err));
  //   }
  // };

  calsPS = (cals, servings) => Math.round(cals/servings);

  render() {
    // let { homepage } = this.props;
    let sliderItems = [{header: "Sensational Sangria Recipes", subHeader: "Browse hundreds of variations on this fun and fruity punch.", image: "https://i.imgur.com/Cdm8uLo.jpg", link: "search?q=sangria&calories=0-10000" }, 
    {header: "Hummus Recipes", subHeader: "Browse hundreds of ways to get your dip on.", image: "https://i.imgur.com/U2S3zqF.jpg", link: "search?q=hummus&calories=0-10000" }, 
    {header: "Greek Pasta Salad", subHeader: "These salads are filled with bold flavors: kalamata olives, feta cheese and fresh herbs.", image: "https://i.imgur.com/ZJTqzVc.jpg", link: "search?q=greek%20pasta%20salad&calories=0-10000" },
    {header: "Sloppy Bulgogi and other Fusion Mashups.", subHeader: "Try these delicious cross-cultural combos.", image: "https://i.imgur.com/U58wzmg.jpg", link: "search?q=fusion&calories=0-10000" },
    {header: "Chicken Teriyaki Skewers", subHeader: "See how to make delicious Summery chicken teriyaki skewers.", image: "https://i.imgur.com/mHOTbhs.jpg", link: "search?q=chicken%20teriyaki%20skewers&calories=0-10000" }];

    let subItems = [{title: "World Cuisine", image: "https://i.imgur.com/OQv9K29.png", link: "search?q=world%20cuisine&calories=0-10000"},
    {title: "Vegan Recipes", image: "https://i.imgur.com/RnxBP1l.jpg", link: "search?q=vegan&calories=0-10000"},
    {title: "Slow Cooker", image: "https://i.imgur.com/LWNK25s.jpg", link: "search?q=slow%20cooker&calories=0-10000"},
    {title: "Shrimp Recipes", image: "https://i.imgur.com/cKdLXB2.jpg", link: "search?q=shrimp&calories=0-10000"},
    {title: "Cookies", image: "https://i.imgur.com/yuIHLRS.jpg", link: "search?q=cookie&calories=0-10000"},
    {title: "Chicken Recipes", image: "https://i.imgur.com/XpxJcn0.jpg", link: "search?q=chicken&calories=0-10000"},
    {title: "Cake Recipes", image: "https://i.imgur.com/UVo3FF8.jpg", link: "search?q=cake&calories=0-10000"},
    {title: "Breakfast", image: "https://i.imgur.com/guAsD12.png", link: "search?q=breakfast&calories=0-10000"},
    {title: "Bread Recipes", image: "https://i.imgur.com/BNQZO8L.png", link: "search?q=bread&calories=0-10000"},
    {title: "Appetizers", image: "https://i.imgur.com/2bNJ7AZ.png", link: "search?q=appetizers&calories=0-10000"}];
    return (
      <section className='container'>
        <div className='slider'>
          {sliderItems.map((item, idx) => {
            let boundItemClick = this.handleBoundItemClick.bind(this, item);
            return <div key={idx} className='sliderItemContainer' onClick={boundItemClick}>
                <div className="sliderText">
                  <h3 className='sliderHeader'>{item.header}</h3>
                  <p className='sliderSubheader'>{item.subHeader}</p>
                </div>
                <img src={item.image} className="sliderItemImage"/>
              </div>
          })}
        </div>
        <div className='sliderSubItem'>
          <div className='subItemInnerWrapper'>
            {subItems.map((subItem, idx) => {
              let boundSubitemClick = this.handleBoundSubitemClick.bind(this, subItem);
              return <div key={idx} className='sliderSubitemContainer' onClick={boundSubitemClick}>
                  <div className='subItemInsideWrapper'>
                    <img src={subItem.image} className="sliderSubitemImage"/>
                    <p className='sliderSubitemTitle'>{subItem.title}</p>
                  </div>
                </div>
            })}
            </div>
        </div>
        <RecipesMap recipes={this.props.homepage} containerClass={"homepageRecipesOuter"} redirect={this.handleRedirect}/>
        {/* <div className='homepageRecipesOuter'>
          {renderIf(homepage && homepage.length > 0 ,
            <div className='recipesSection'>
              {homepage.map(myRecipe => {
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
          )}
        </div> */}
      </section>
    );
  }
}

let mapStateToProps = state => ({
  // no need for userauth
  // userAuth: state.userAuth,
  homepage: state.homepage,
});

let mapDispatchToProps = dispatch => {
  return {
    // favoriteFetch: favorite => dispatch(favoriteFetchRequest(favorite)),
    favoritesFetch: favoritesArr => dispatch(favoritesFetchRequest(favoritesArr)),
    userProfileFetch: () => dispatch(userProfileFetchRequest()),
    tokenSignIn: token => dispatch(tokenSignInRequest(token)),
    homepageFetch: () => dispatch(homepageFetchRequest()),
    // recipeFetchRequest: recipe => dispatch(recipeFetch(recipe)),
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);