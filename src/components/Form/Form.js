import React, { Component } from 'react';
import AllOrAnyDropdown from '../AllOrAnyDropdown/AllOrAnyDropdown';
import './Form.css';

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selection: null,
      enableFormSubmit: false,
      errors: null
    }
    this.formRef = React.createRef();
    this.setFormValues = this.setFormValues.bind(this);
    this.handleForm = this.handleForm.bind(this);
  }

  // setting dropdown options in component
  setFormValues(data) {
    this.setState({
      selection: data
    }, () => {
      this.setFormValidity();
    });
  }

  // setting submit button enable / disable
  setFormValidity() {
    this.setState({
      enableFormSubmit: this.formRef.current.checkValidity()
    });
  }

  setFormErrors(errors) {
    this.setState({
      errors
    });
  }

  validateMultiSelection() {
    const { selection } = this.state;
    const { availableOptions } = this.props;
    const errors = [];
    let missingToppingsFromAvailability = [];
    selection.values.forEach(item => {
      if(availableOptions.indexOf(item) === -1) {
        missingToppingsFromAvailability.push(item);
      }
    });
    if (selection.include === 'all' && missingToppingsFromAvailability.length > 0) {
      errors.push(`${missingToppingsFromAvailability.join(', ')} is / are currently not available. Please review your selection.`);
      this.setFormErrors(errors);
      return false;
    } else if (selection.include === 'any' && missingToppingsFromAvailability.length === selection.values.length) {
      errors.push(`None of your current selection is currently available. Please review your selection.`);
      this.setFormErrors(errors);
      return false;
    }
    this.setFormErrors();
    return true;
  }

  // native form handling
  handleForm(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    if(this.validateMultiSelection()) {
      console.log(data.get('include'), JSON.stringify(data.getAll('values'))); // also do other stuff with the data, like - persisting with an API call
    }
  }

  componentDidMount() {
    this.setFormValidity();
  }

  render() {
    const { toppings } = this.props;
    const { selection, enableFormSubmit, errors } = this.state;

    console.log(enableFormSubmit);
    return (
      <div className="Form">

        {/***** start of ***** displaying selection on dropdown component */}
        { `Displaying AllOrAnyDropdown component's selection in Form component: ` }
        <b>
          { selection && `${selection.include.toUpperCase()} of ${selection.values.join(', ').toUpperCase()}` }
        </b>
        {/***** end of ***** displaying selection on dropdown component */}
        
        <form ref={this.formRef} name="pizzaOptions" onSubmit={this.handleForm}>
          <AllOrAnyDropdown labelTitle="Toppings" options={toppings} onSelection={this.setFormValues} />
          <button disabled={!enableFormSubmit} className="btn btn-primary" type="submit">Bake My Pizza!</button>
        </form>

        {/***** start of ***** display errors */}
        <div className="form-errors">
          {
            errors && errors.map((item, i) => {
              return <div key={i} className="form-error">{item}</div>
            })
          }
        </div>
        {/***** end of ***** display errors */}
        
      </div>
    )
  }
}

export default Form
