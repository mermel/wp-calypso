/**
 * External dependencies
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import autosize from 'autosize';

export default class TextareaAutosize extends Component {
	componentDidMount() {
		autosize( this.refs.textarea );
	}

	componentWillUnmount() {
		autosize.destroy( this.refs.textarea );
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.value !== prevProps.value ) {
			autosize.update( this.refs.textarea );
		}
	}

	render() {
		const classes = classnames( 'textarea-autosize', this.props.className );

		return (
			<textarea
				ref="textarea"
				{ ...this.props }
				className={ classes } />
		);
	}
}
