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
                <div className='row'>
                  <div id='advancedSearchDiv' className='col-xs-12 col-lg-12'>
                    <div className='row'>
                      <div className='col-xs-3 col-lg-3'>
                        <span className='advancedSearchSectionHeader'>Calories</span> <br/>
                        <span>From 
                          <input 
                            id='textBoxInputMinCal' 
                            type='text' 
                            name='minCals'
                            placeholder='ex. 200'
                            value={this.state.minCals}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            style={{width: '50px'}} 
                          />
                        </span> <br/>
                        <span>To 
                          <input
                            id='textBoxInputMaxCal'
                            type='text'
                            name='maxCals'
                            placeholder='ex. 600'
                            value={this.state.maxCals}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            style={{width: '50px'}} 
                          />
                        </span><br/>
                        <span className='advancedSearchSectionHeader'>Results</span> <br/>
                        <span>Up to 
                          <input
                            id='textBoxInputMaxResults'
                            type='text'
                            name='maxIngredients'
                            placeholder='Max Ingredients ex. 12'
                            style={{width: '50px'}} 
                            value={this.state.maxIngredients}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            style={{width: '50px'}} 
                          />
                        </span><br/>
                      </div>
                      <div className='col-xs-3 col-lg-3'>
                        <span className='advancedSearchSectionHeader'>Health </span> <br/>
                        <label>
                          <input
                            type='radio'
                            name='healthOption' 
                            value='dairy-free'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />  
                          Dairy Free
                        </label><br/>
                        <label>
                          <input
                            type='radio' 
                            name='healthOption' 
                            value='gluten-free'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur} 
                          />  
                          Gluten Free
                        </label><br/>
                        <label>
                          <input
                            type='radio'
                            name='healthOption' 
                            value='kosher'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />  
                          Kosher
                        </label><br/>
                        <label>
                          <input
                            type='radio' 
                            name='healthOption' 
                            value='pescatarian'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur} 
                          />  
                          Pescatarian
                        </label><br/>
                        <label>
                          <input
                            type='radio'
                            name='healthOption' 
                            value='peanut-free'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                          />  
                          Peanut Free
                        </label><br/>
                        <label>
                          <input
                            type='radio' 
                            name='healthOption' 
                            value='paleo'
                            onChange={this.handleChange}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur} 
                          />  
                          Paleo
                        </label><br/>
                      </div>
                      <div className='col-xs-3 col-lg-3'>
                        <br/>
                        <div className='dietFormGroup' className='form-group'>
                          <label>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='soy-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            Soy Free
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='sugar-conscious'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            Sugar Conscious
                          </label><br/>
                          <label>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='tree-nut-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            Tree Nut Free
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='vegan'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            Vegan
                          </label><br/>
                          <label>
                            <input
                              type='radio'
                              name='healthOption' 
                              value='vegetarian'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            Vegetarian
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='healthOption' 
                              value='wheat-free'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            Wheat Free
                          </label><br/>
                        </div>
                      </div>
                      <div className='col-xs-3 col-lg-3'>
                        <b>Diet </b> <br/>
                        <div className='allergyFormGroup' className='form-group'>
                          <label>
                            <input
                              type='radio'
                              name='dietOption' 
                              value='balanced'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            Balanced
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='dietOption' 
                              value='high-fiber'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            High Fiber
                          </label><br/>
                          <label>
                            <input
                              type='radio'
                              name='dietOption' 
                              value='high-protein'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            High Protein
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='dietOption' 
                              value='low-carb'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            Low Carb
                          </label><br/>
                          <label>
                            <input
                              type='radio'
                              name='dietOption' 
                              value='low-fat'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur}
                            />  
                            Low Fat
                          </label><br/>
                          <label>
                            <input
                              type='radio' 
                              name='dietOption' 
                              value='low-sodium'
                              onChange={this.handleChange}
                              onFocus={this.handleFocus}
                              onBlur={this.handleBlur} 
                            />  
                            Low Sodium
                          </label><br/><br/><br/><br/><br/>
                        </div>
                        <button id='advancedSearchFormButton' type='submit' className='button green'><span id='advancedSearchIcon' className='glyphicon glyphicon-check'>&nbsp;<span id='advancedSearchButtonText'><b>Done</b></span></span></button>
                      </div>
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