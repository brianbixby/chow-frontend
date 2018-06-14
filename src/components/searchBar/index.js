import React from 'react';
import { isInt } from 'validator';

import Tooltip from '../helpers/tooltip';
import { renderIf, classToggler } from './../../lib/util.js';


class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      advancedSearch: false,
      searchTerm: '',
      searchTermError: null,
      minCals: '',
      minCalsError: null,
      maxCals: '',
      maxCalsError: null,
      maxIngredients: '',
      maxIngredientsError: null,
      dietOption: null,
      healthOption: null,
      error: null,
      focused: null,
      submitted: false,
    };
  }
  componentWillUnmount() {
    this.setState({ advancedSearch: false, searchTerm: '', minCals: '', maxCals: '', maxIngredients: '', dietOption: null, healthOption: null });
  }
  validateInput = e => {
    let { name, value } = e.target;
    let errors = { 
      searchTermError: this.state.searchTermError, 
      minCalsError: this.state.minCalsError, 
      maxCalsError: this.state.maxCalsError,
      maxIngredientsError: this.state.maxIngredientsError,
    };
    let setError = (name, error) => errors[`${name}Error`] = error;
    let deleteError = name => errors[`${name}Error`] = null;

    if(name === 'searchTerm') {
      if(!value)
        setError(name, `${name} can not be empty`)
      else
        deleteError(name)
    }
    if(name === 'minCals' || name === 'maxCals' || name === 'maxIngredients') {
      if(value && isInt(value))
        setError(name, `${name} must be a number`)
      else
        deleteError(name)
    }

    this.setState({ ...errors, error: !!(errors.emailError || errors.minCalsError || errors.maxCalsError || errors.maxIngredients) });
  };
  handleFocus = e => this.setState({ focused: e.target.name});
  handleBlur = e => {
    let { name } = e.target;
    this.setState(state => ({
      focused: state.focused == name ? null : state.focused,
    }))
  };
  handleChange = e => {
    let { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    if(!this.state.error) {
      this.props.onComplete(this.state)
        .catch(err => {
          this.setState({ 
            error: err,
            submitted: true,
        });
      });
    }
    this.setState(state => ({
      submitted: true,
      searchTermError: state.searchTermError || state.searchTerm ? null : 'required',
      minCalsError: state.minCalsError ? null : 'required',
      maxCalsError: state.maxCalsError ? null : 'required',
      maxIngredientsError: state.maxIngredientsError ? null : 'required',
    }))
  };

  render() {
    let { searchTerm, searchTermError, minCalsError, maxCalsError, maxIngredientsError, advancedSearch, error, focused, submitted } = this.state;
    return (
      <div >
        <div className='row'>
          <div className='col-xs-12 col-sm-12 com-lg-12 col-lg-12'>
            <form id='search-form' onSubmit={this.handleSubmit} className={classToggler({
                'form': true,
                'error': error && submitted,
              })}>
              <div className='input-group'>
                <input 
                  className='form-control search-form'
                  type='text'
                  name='searchTerm'
                  placeholder='Find the best recipes from across the web...'
                  value={searchTerm}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
                <Tooltip message={searchTermError} show={focused === 'searchTerm' || submitted} />
                <span className='input-group-btn'>
                  <button type='submit' className='btn search-btn'><i className='fa fa-search'></i></button>
                </span>
              </div>
              {renderIf(advancedSearch, 
                <div className='row advancedSearchRow'>
                  <div className='col-xs-12 col-lg-12'>
                    <div id='advancedSearchDiv'>
                      <div className='row'>
                        <div className='col-xs-4 col-lg-4'>
                          <span className='advancedSearchSectionHeader'>Calories</span> <br/>
                          <p className='inputTextP'>From 
                            <input 
                              id='textBoxInputMinCal' 
                              type='text' 
                              name='minCals'
                              placeholder='ex. 200'
                              value={this.state.minCals}
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                          </p> <br/>
                          <p className='inputTextP'>To 
                            <input
                              id='textBoxInputMaxCal'
                              type='text'
                              name='maxCals'
                              placeholder='ex. 600'
                              value={this.state.maxCals}
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                          </p><br/>
                          <span className='advancedSearchSectionHeader'>Ingredients</span> <br/>
                          <p className='inputTextP'>Up to 
                            <input
                              id='textBoxInputMaxResults'
                              type='text'
                              name='maxIngredients'
                              placeholder='Max Ingredients ex. 12'
                              value={this.state.maxIngredients}
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                          </p><br/>
                        </div>
                        <div className='col-xs-4 col-lg-4'>
                          <span className='advancedSearchSectionHeader'>Allergies </span> <br/>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='dairy-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                            <label>Dairy Free</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='gluten-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />
                            <label>Gluten Free </label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='kosher'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                            <label>Kosher</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='pescatarian'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />
                            <label>Pescatarian</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='peanut-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                            <label>Peanut Free</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='paleo'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />
                            <label>Paleo</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='soy-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />
                            <label> Soy Free</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='sugar-conscious'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            <label>Sugar Conscious</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='tree-nut-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            <label>Tree Nut Free</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='vegan'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            <label>Vegan</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='vegetarian'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            <label>Vegetarian</label>
                          </p>
                          <p className='advancedSearchOptionP'>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='wheat-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            <label>Wheat Free</label>
                          </p>
                        </div>
                        <div className='col-xs-4 col-lg-4'>
                          <span className='advancedSearchSectionHeader'>Diet </span> <br/>
                          <div className='allergyFormGroup' className='form-group'>
                            <p className='advancedSearchOptionP'>
                              <input
                                type='radio'
                                name='dietOption' 
                                value='balanced'
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                              />  
                              <label>Balanced</label>
                            </p>
                            <p className='advancedSearchOptionP'>
                              <input
                                type='radio' 
                                name='dietOption' 
                                value='high-fiber'
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur} 
                              />  
                              <label>High Fiber</label>
                            </p>
                            <p className='advancedSearchOptionP'>
                              <input
                                type='radio'
                                name='dietOption' 
                                value='high-protein'
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                              />  
                              <label>High Protein</label>
                            </p>
                            <p className='advancedSearchOptionP'>
                              <input
                                type='radio' 
                                name='dietOption' 
                                value='low-carb'
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur} 
                              />  
                              <label>Low Carb</label>
                            </p>
                            <p className='advancedSearchOptionP'>
                              <input
                                type='radio'
                                name='dietOption' 
                                value='low-fat'
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                              />  
                              <label>Low Fat</label>
                            </p>
                            <p className='advancedSearchOptionP'>
                              <input
                                type='radio' 
                                name='dietOption' 
                                value='low-sodium'
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur} 
                              />  
                              <label>Low Sodium</label>
                            </p>
                          </div>
                        </div>
                      </div>
                      <button id='advancedSearchFormButton' type='submit' className='button green'><span id='advancedSearchIcon' className='glyphicon glyphicon-check'>&nbsp;<span id='advancedSearchButtonText'><b>Done</b></span></span></button>
                    </div>
                  </div>
                  <div className='advancedSearchToolTip'>
                    <Tooltip message={minCalsError} show={focused === 'minCals' || submitted} />
                    <Tooltip message={maxCalsError} show={focused === 'maxCals' || submitted} />
                    <Tooltip message={maxIngredientsError} show={focused === 'maxIngredients' || submitted} />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
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