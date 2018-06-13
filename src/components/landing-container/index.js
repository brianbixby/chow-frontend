import React from 'react';
import { connect } from 'react-redux';

import { recipesFetchRequest } from '../../actions/search-actions.js';
import SeachBar from '../searchBar';
import { logError } from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  handleSearch = searchParams => {
    if(!searchParams.minCals) searchParams.minCals='0';
    if(!searchParams.maxCals) searchParams.maxCals='10000';
    let ingredients = searchParams.maxIngredients ? `&ingr=${searchParams.maxIngredients}` : '';
    let diet = searchParams.dietOption ? `&diet=${searchParams.dietOption}` : '';
    let health = searchParams.healthOption ? `&health=${searchParams.healthOption}` : '';
    let queryParams = `&calories=${searchParams.minCals}-${searchParams.maxCals}${health}${diet}${ingredients}`;
    let queryString = searchParams.searchTerm ? `search?q=${searchParams.searchTerm}` : null;
  
    return this.props.recipesFetch(queryString, queryParams)
      .then(() => {
        if(queryString) {
          return this.props.history.push(`/search/${queryString}${queryParams}`);
        } else {
          return this.props.history.push(`/search/?q=${queryString}${queryParams}`);
        }
      })
      .catch(err => logError(err));
  };

  render() {
    return (
      <section className='container'>
        <SeachBar onComplete={this.handleSearch} />
      </section>
    );
  }
}

let mapDispatchToProps = dispatch => {
  return {
    recipesFetch: (queryString, queryParams) => dispatch(recipesFetchRequest(queryString, queryParams)),
  };
};

export default connect(null, mapDispatchToProps)(LandingContainer);