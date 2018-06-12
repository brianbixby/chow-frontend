import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Tooltip from '../helpers/tooltip';
import { renderIf, classToggler } from './../../lib/util.js';


class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      searchTerm: '',
      searchTermError: null,
      advancedSearch: false,
      error: null,
      focused: null,
      submitted: false,
    };
  }
  componentWillUnmount() {
    this.setState({ searchTerm: '', advancedSearch: false, });
  }

  render() {
    let { searchTerm, searchTermError, advancedSearch, error, focused, submitted } = this.state;
    return (
      <div >
        <div className='row'>
          <div className='col-xs-12 col-sm-12 com-lg-12 col-lg-12'>
            <form id='search-form' onSubmit={this.handleSubmit} className={classToggler({
                'form': true,
                'error': this.state.error && this.state.submitted,
              })}>
              <div className='input-group'>
                <input 
                  className='form-control search-form'
                  type='text'
                  name='searchTerm'
                  placeholder='Find the best recipes from across the web...'
                  value={this.state.searchTerm}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
                <Tooltip message={searchTermError} show={focused === 'searchTerm' || submitted} />
                <span className='input-group-btn'>
                  <button type='submit' className='btn search-btn'><i className='fa fa-search'></i></button>
                </span>
              </div>
              {renderIf(this.state.advancedSearch, 
                <div className='row'>
                  <div id='advancedSearchDiv' className='col-xs-12 col-lg-12'>
                    <div className='row'>
                      <div className='col-xs-3 col-lg-3'>
                        <span className='advancedSearchSectionHeader'>Calories</span> <br/>
                        <span>From 
                          <input 
                            id='textBoxInputMinCal' 
                            type='text' 
                            style={{width: '50px'}} 
                            ng-model='minCals'
                          />
                        </span> <br/>
                        <span>To 
                          <input
                            id='textBoxInputMaxCal' type='text' style={{width: '50px'}} ng-model='maxCals'/></span><br/>
                        <span className='advancedSearchSectionHeader'>Results</span> <br/>
                        <span>Up to 
                          <input
                            id='textBoxInputMaxResults' type='text' style={{width: '50px'}} ng-model='maxResults'/></span><br/>
                      </div>
                      <div className='col-xs-3 col-lg-3'>
                        <span className='advancedSearchSectionHeader'>Diet</span> <br/>
                        <div className='dietFormGroup' className='form-group'>
                          <label>
                            <input
                              type='checkbox'
                              value='Vegetarian' 
                            />  
                            Vegetarian
                          </label><br/>
                          <label>
                            <input
                              type='checkbox'
                              value='Vegan' 
                            />  
                            Vegan
                          </label><br/>
                          <label>
                            <input
                              type='checkbox'
                              value='Paleo' 
                            />  
                            Paleo
                          </label><br/>
                          <label>
                            <input
                              type='checkbox'
                              value='High-Fiber'
                            /> 
                            High-Fiber
                          </label><br/>
                          <label>
                            <input
                              type='checkbox'
                              value='High-Protein'
                            />
                            High-Protein
                          </label><br/>
                          <label>
                            <input
                              type='checkbox'
                              value='Low-Carb' 
                            />  
                            Low-Carb
                          </label><br/>
                        </div>
                      </div>
                      <div className='col-xs-3 col-lg-3'>
                        <br/>
                        <div className='dietFormGroup' className='form-group'>
                          <label>
                            <input
                              type='checkbox'
                              value='Low-Fat'
                            />  
                            Low-Fat
                          </label><br/>
                          <label>
                            <input
                              type='checkbox' 
                              value='Low-Sodium' 
                            />  
                            Low-Sodium
                          </label><br/>
                          <label>
                            <input
                              type='checkbox' 
                              value='Low-Sugar' 
                            />  
                            Low-Sugar
                          </label><br/>
                          <label>
                            <input
                              type='checkbox' 
                              value='Alcohol-Free' 
                            />  
                            Alcohol-Free
                          </label><br/>
                          <label>
                            <input
                              type='checkbox' 
                              value='Balanced' 
                            />  
                            Balanced
                          </label><br/>
                        </div>
                      </div>
                      <div className='col-xs-3 col-lg-3'>
                        <b>Allergies</b> <br/>
                        <div className='allergyFormGroup' className='form-group'>
                          <label>
                            <input
                              type='radio'
                              name='allergyOption' 
                              value='tree-nut-free' 
                            />  
                            Tree Nuts
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='allergyOption' 
                              value='peanut-free' 
                            />  
                            Peanuts
                          </label><br/><br/><br/><br/><br/>
                        </div>
                        <button id='advancedSearchFormButton' type='submit' className='button green'><span id='advancedSearchIcon' className='glyphicon glyphicon-check'>&nbsp;<span id='advancedSearchButtonText'><b>Done</b></span></span></button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        {/* SEARCH FILTER */}
        <div id='searchFilter' className='row'>
          <div className='col-xs-12 col-sm-12 com-lg-12 col-lg-12'>
            <p id='searchFilterText' onClick={() => this.setState({advancedSearch: !this.state.advancedSearch})}>
              <span id='smallFont'> REFINE SEARCH BY </span> <span id='bold'> Calories, Diet, Ingredients </span> <span id='searchFilterDownArrow' className='glyphicon glyphicon-triangle-bottom'></span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;

// let mapStateToProps = state => ({
//   userAuth: state.userAuth,
//   userProfile: state.userProfile,
// });

// let mapDispatchToProps = dispatch => {
//   return {
//     signUp: user => dispatch(signUpRequest(user)),
//     signIn: user => dispatch(signInRequest(user)),
//     userProfileFetch: () => dispatch(userProfileFetchRequest()),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);