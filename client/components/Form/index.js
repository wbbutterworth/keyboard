//
// Form
//
// :: Render
// :: Properties

import React                    from 'react';
import PropTypes                from 'prop-types';
import Button                   from './Button';
import Select                   from './Select';
import Radios, { Radio }        from './Radios';
import Checkboxes, { Checkbox } from './Checkboxes';
import Counter                  from './Counter';
import Slider                   from './Slider';
import Knob                     from './Knob';

require( './style.css' );

//
// Render
//

const Form = ( props ) => (
	<form onSubmit={ props.onSubmit }>
		{ props.children }
	</form>
);

//
// Properties
//

Form.defaultProps = {
	children: null,
	onSubmit: null,
};

Form.propTypes = {
	children: PropTypes.node,
	onSubmit: PropTypes.func,
};

export default Form;

export {
	Button,
	Select,
	Radios,
	Radio,
	Checkboxes,
	Checkbox,
	Counter,
	Slider,
	Knob,
};
