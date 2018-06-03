import React, { Component } from 'react';
import './AllOrAnyDropdown.css';


class AllOrAnyDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      include: '',
      values: [],
      showDropdown: false
    }
    this.setInclude = this.setInclude.bind(this)
    this.setValues = this.setValues.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.docClickHandler = this.docClickHandler.bind(this)
    this.clearSelection = this.clearSelection.bind(this)
  }

  // clear options selection
  clearSelection() {
    const { include } = this.state;
    this.setState({
      values: []
    }, () => {
      if (!include) { return this.setInclude(); } // set include to default 'all' if it's not selected yet
      this.onSelection(); // update the form enclosing this component with the selected options
    });
  }

  // set inclusion of options property
  setInclude(item) {
    this.setState({
      include: item || 'all'
    }, () => {
      this.onSelection(); // update the form enclosing this component with the selected options
    });
  }

  // set options
  setValues(item) {
    const { values, include } = this.state;

    // get current selected values from refs
    // added refs step for experimenting, otherwise can use current state values
    const currentValues = [...this.select]
      .slice()
      .filter(option => option.selected)
      .map(option => option.value);
    
    this.setState({
      values: currentValues.indexOf(item) === -1 ? [...values, item] : values.filter(i => i !== item)
    }, () => {
      if (!include) { return this.setInclude(); } // set include to default 'all' if it's not selected yet
      this.onSelection(); // update the form enclosing this component with the selected options
    });
  }

  // update the form enclosing this component with the selected options
  onSelection() {
    const { onSelection } = this.props;
    return onSelection && onSelection(JSON.parse(JSON.stringify(this.state)));
  }

  // toggle dropdown
  toggleDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.nativeEvent.stopImmediatePropagation();
    const { showDropdown } = this.state;
    this.setState({
      showDropdown: !showDropdown
    })
  }

  // to handle radio button behavior of UI elements
  isIncludeActive(item) {
    const { include } = this.state;
    return include === item ? 'active' : '';
  }

  // to handle checkbox behavior of UI elements 
  isOptionActive(item) {
    const { values } = this.state;
    return values.indexOf(item) !== -1 ? 'active' : ''
  }

  // close dropdown on click of anywhere else in the web page
  docClickHandler(e) {
    const { showDropdown } = this.state;
    if (showDropdown) {
      this.toggleDropdown(e);
    }
  }

  // add event listener for closing dropdown on click of anywhere else in the web page
  componentDidMount() {
    document.addEventListener('click', this.docClickHandler);
  }

  // remove event listener for closing dropdown on click of anywhere else in the web page
  componentWillUnmount() {
    document.removeEventListener('click', this.docClickHandler);
  }

  // render
  render() {
    const { options, allOrAny, placeHolder, labelTitle } = this.props;
    const { include, values, showDropdown } = this.state;

    return (
      <div className="Dropdown row">
        <label className="label-title">* Select {labelTitle}</label>

        {/********* start of ********* adding hidden fields for native form handling support to use this component in a form */}
        <input type="text" hidden value={include} name="include" required/>
        <select hidden ref={select => this.select = select} value={values} name="values" multiple required onChange={e => {}}>
          {
            /* using index as the key for we are handling plain arrays but not array of objects with a proper id */
            options.map((item, i) => <option key={i} value={item}>{item}</option>)
          }
        </select>
        {/********* end of ********* adding hidden fields for native form handling support to use this component in a form */}
        
        {/********* start of ********* custom UI behaviour of combobox */}
        <div className="d-flex justify-content-between align-items-center col-12 form-control" onClick={this.toggleDropdown}>
          <span> 
            {
              (include && `${include} of ${values.length > 0 ? values[0] : ''}${values.length > 1 ? ('+'+(values.length - 1)) : ''}`) 
              || <span className="placeholder-text">{placeHolder}</span>
            }
          </span>
          {showDropdown ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
        </div>
        {/********* end of ********* custom UI behaviour of combobox */}

        {
          showDropdown && <div onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.nativeEvent.stopImmediatePropagation();
          }} className="col-12 form-control options-container">

            {/********* start of ********* custom radio buttons behavior for all / any selection */}
            <div className="d-flex"> 
              {/* using index as the key for we are handling plain arrays but not array of objects with a proper id */}
              {allOrAny.map((item, i) => {
                return <div 
                  className={`option radio-option ${this.isIncludeActive(item)}`} 
                  onClick={e => this.setInclude(item)} 
                  key={i}>
                  {this.isIncludeActive(item) ? <i className="fas fa-dot-circle option-icon"></i> : <i className="far fa-circle option-icon"></i>}
                  {`${item} of`}
                </div>
              })}
            </div>
            {/********* end of *********  custom radio buttons behavior for all / any selection */}

            <hr/>

            {/********* start of *********  custom multiselect behavior */}
            <div className="row">
              {/* using index as the key for we are handling plain arrays but not array of objects with a proper id */}
              {options.map((item, i) => {
                return <div 
                  className={`col-12 option check-option ${this.isOptionActive(item)}`} 
                  onClick={e => this.setValues(item)} 
                  key={i}>
                  {this.isOptionActive(item) ? <i className="fas fa-check-square option-icon"></i> : <i className="far fa-square option-icon"></i>}
                  {item}
                </div>
              })}
            </div>
            {/********* end of *********  custom multiselect behavior */}

            {values && values.length > 0 && <hr/>}

            {/********* start of *********  clear options selection button */}
            {
              values && values.length > 0 && <div onClick={this.clearSelection} className="option d-flex align-items-center">
                <i className="fas fa-times option-icon"></i> Clear
              </div>
            }
            {/********* end of *********  clear options selection button */}

          </div>
        }
      </div>
    )
  }
}

AllOrAnyDropdown.defaultProps = {
  allOrAny: ['all', 'any'],
  placeHolder: 'select all / any of options'
}

export default AllOrAnyDropdown
