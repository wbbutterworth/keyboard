//
// Keyboard
//
// :: Constructor
// :: Mount Methods
// :: Key Methods
// :: Event Handlers
// :: Render Methods
// :: Default Props
// :: Prop Types

import React      from 'react';
import PropTypes  from 'prop-types';
import ShortID    from 'shortid';
import Prompt     from 'components/Prompt';
import Key        from './Key';

require( './style.css' );

class Keyboard extends React.Component {

	//
	// Constructor
	//

	constructor( props ) {
		super( props );

		this.state = {
			mode:   props.mode,
			octave: props.octave,
		};

		// create a reference for all keyboard keys
		this.keys = [];

		// ensure event handlers have the correct "this" reference
		this.handleShortcut = this.handleShortcut.bind( this );
		this.handleCommand  = this.handleCommand.bind( this );
		this.handleKeydown  = this.handleKeydown.bind( this );
		this.handleKeyup    = this.handleKeyup.bind( this );

		// create regex to quickly test for keys
		this.keyCodes = props.keys.map( ( key ) => ( key.code ) );
		this.keyRegex = new RegExp( `^(${ this.keyCodes.join( '|' ) })$` );
	}

	//
	// Mount Methods
	//

	componentWillMount() {
		this.context = new AudioContext();

		document.addEventListener( 'shortcut', this.handleShortcut );
		document.addEventListener( 'command',  this.handleCommand );
		document.addEventListener( 'keydown',  this.handleKeydown );
		document.addEventListener( 'keyup',    this.handleKeyup );
	}

	componentWillUnmount() {
		this.context.close();

		document.removeEventListener( 'shortcut', this.handleShortcut );
		document.removeEventListener( 'command',  this.handleCommand );
		document.removeEventListener( 'keydown',  this.handleKeydown );
		document.removeEventListener( 'keyup',    this.handleKeyup );
	}

	//
	// Key Methods
	//

	isKey( code ) {
		return this.keyRegex.test( code );
	}

	getKey( code ) {
		return this.keys.find( ( key ) => ( key.props.code === code ) );
	}

	playKey( key ) {
		key.play();
	}

	stopKey( key ) {
		key.stop();
	}

	stopAllKeys() {
		this.keys.forEach( ( key ) => {
			if ( key.state.isPressed ) key.stop();
		} );
	}

	//
	// Event Handlers
	//

	handleShortcut( event ) {
		switch ( event.detail ) {
			case 'octave down':
				if ( this.state.octave === 1 ) return;
				this.stopAllKeys();
				this.setState( { octave: this.state.octave - 1 } );
				break;

			case 'octave up':
				if ( this.state.octave === 9 ) return;
				this.stopAllKeys();
				this.setState( { octave: this.state.octave + 1 } );
				break;
		}
	}

	handleCommand( event ) {
		switch ( event.detail ) {
			case 'open prompt':
				this.prompt.toggle();
				break;

			case 'define key':
				console.log( 'define a key' );
				break;
		}
	}

	handleKeydown( event ) {
		if (
			event.metaKey ||
			document.mode !== 'INPUT' ||
			!this.isKey( event.which )
		) return;

		const key = this.getKey( event.which );
		event.preventDefault();
		if ( event.repeat ) return;
		this.playKey( key );
	}

	handleKeyup( event ) {
		if (
			event.metaKey ||
			document.mode !== 'INPUT' ||
			!this.isKey( event.which )
		) return;

		const key = this.getKey( event.which );
		event.preventDefault();
		if ( !key.state.isPressed ) return;
		this.stopKey( key );
	}

	//
	// Render Methods
	//

	renderKeys() {
		let octave = this.state.octave;

		return this.props.keys.map( ( key, index ) => {
			const component = (
				<Key
					key={ ShortID.generate() }
					code={ key.code }
					note={ key.note }
					octave={ octave }
					context={ this.context }
					ref={ ( key ) => ( this.keys[index] = key ) }
				/>
			);

			// increment the index by one every twelve notes
			if ( ( index + 1 ) % 12 === 0 ) octave += 1;

			return component;
		} );
	}

	render() {
		return (
			<div className="keyboard">
				<Prompt
					ref={ ( prompt ) => ( this.prompt = prompt ) }
				/>

				<div className="keyboard-keys">
					{ this.renderKeys() }
				</div>
			</div>
		);
	}
}

//
// Default Props
//

Keyboard.defaultProps = {
	octave: 4,

	keys: [
		{ code: 9,   note: 'C'  }, // tab
		{ code: 49,  note: 'Db' }, // 1
		{ code: 81,  note: 'D'  }, // q
		{ code: 50,  note: 'Eb' }, // 2
		{ code: 87,  note: 'E'  }, // w
		{ code: 69,  note: 'F'  }, // e
		{ code: 52,  note: 'Gb' }, // 4
		{ code: 82,  note: 'G'  }, // r
		{ code: 53,  note: 'Ab' }, // 5
		{ code: 84,  note: 'A'  }, // t
		{ code: 54,  note: 'Bb' }, // 6
		{ code: 89,  note: 'B'  }, // y
		{ code: 85,  note: 'C'  }, // u
		{ code: 56,  note: 'Db' }, // 8
		{ code: 73,  note: 'D'  }, // i
		{ code: 57,  note: 'Eb' }, // 9
		{ code: 79,  note: 'E'  }, // o
		{ code: 80,  note: 'F'  }, // p
		{ code: 189, note: 'Gb' }, // -
		{ code: 219, note: 'G'  }, // [
		{ code: 187, note: 'Ab' }, // =
		{ code: 221, note: 'A'  }, // ]
		{ code: 8,   note: 'Bb' }, // delete
		{ code: 220, note: 'B'  }, // \
		{ code: 13,  note: 'C'  }, // enter
	],
};

//
// Prop Types
//

Keyboard.propTypes = {
	octave: PropTypes.number,

	keys: PropTypes.arrayOf(
		PropTypes.shape( {
			code: PropTypes.number,
			note: PropTypes.sting,
		} ),
	),
};

export default Keyboard;
