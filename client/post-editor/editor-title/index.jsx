/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { omit, get } from 'lodash';

/**
 * Internal dependencies
 */
import PostActions from 'lib/posts/actions';
import PostUtils from 'lib/posts/utils';
import SiteUtils from 'lib/site/utils';
import EditorPermalink from 'post-editor/editor-permalink';
import TrackInputChanges from 'components/track-input-changes';
import TextareaAutosize from 'components/textarea-autosize';
import { isMobile } from 'lib/viewport';
import * as stats from 'lib/posts/stats';

export default React.createClass( {
	displayName: 'EditorTitle',

	propTypes: {
		post: PropTypes.object,
		site: PropTypes.object,
		isNew: PropTypes.bool,
		onChange: PropTypes.func
	},

	getDefaultProps() {
		return {
			isNew: true,
			onChange: () => {}
		};
	},

	componentDidUpdate( prevProps ) {
		if ( isMobile() ) {
			return;
		}

		// If next post is new, or the next site is different, focus title
		const { isNew, site } = this.props;
		if ( ( isNew && ! prevProps.isNew ) ||
				( isNew && get( prevProps.site, 'ID' ) !== get( site, 'ID' ) ) ) {
			const input = ReactDom.findDOMNode( this.refs.titleInput );
			input.focus();
		}

		// If value updated via paste, restore caret location
		if ( this.selectionStart ) {
			const input = ReactDom.findDOMNode( this.refs.titleInput );
			input.setSelectionRange( this.selectionStart, this.selectionStart );
			delete this.selectionStart;
		}
	},

	setTitle( title ) {
		// TODO: REDUX - remove flux actions when whole post-editor is reduxified
		PostActions.edit( { title } );
	},

	onChange( event ) {
		if ( ! this.props.post ) {
			return;
		}

		this.setTitle( event.target.value );
		this.props.onChange( event );
	},

	recordChangeStats() {
		const isPage = PostUtils.isPage( this.props.post );
		stats.recordStat( isPage ? 'page_title_changed' : 'post_title_changed' );
		stats.recordEvent( isPage ? 'Changed Page Title' : 'Changed Post Title' );
	},

	onBlur( event ) {
		this.onChange( event );
	},

	stripPasteNewlines( event ) {
		// `window.clipboardData` deprecated as of Microsoft Edge
		// See: https://msdn.microsoft.com/library/ms535220(v=vs.85).aspx
		const clipboard = event.clipboardData || window.clipboardData;
		if ( ! clipboard ) {
			return;
		}

		event.preventDefault();

		let text = clipboard.getData( 'Text' ) || clipboard.getData( 'text/plain' );
		if ( ! text ) {
			return;
		}

		// Replace any whitespace (including newlines) with a single space
		text = text.replace( /\s+/g, ' ' ).trim();

		// Splice trimmed text into current title selection
		const { value, selectionStart, selectionEnd } = event.target;
		const valueChars = value.split( '' );
		valueChars.splice( selectionStart, selectionEnd - selectionStart, text );
		const newTitle = valueChars.join( '' );

		this.setTitle( newTitle );
		this.selectionStart = selectionStart + text.length;
	},

	preventEnterKeyPress( event ) {
		if ( 'Enter' === event.key || 13 === event.charCode ) {
			event.preventDefault();
		}
	},

	render() {
		const { post, site, isNew } = this.props;
		const isPermalinkEditable = SiteUtils.isPermalinkEditable( site );

		const classes = classNames( 'editor-title', {
			'is-loading': ! post
		} );

		return (
			<div className={ classes }>
				{ post && post.ID && ! PostUtils.isPage( post ) &&
					<EditorPermalink
						slug={ post.slug }
						path={ isPermalinkEditable ? PostUtils.getPermalinkBasePath( post ) : post.URL }
						isEditable={ isPermalinkEditable } />
				}
				<TrackInputChanges onNewValue={ this.recordChangeStats }>
					<TextareaAutosize
						{ ...omit( this.props, Object.keys( this.constructor.propTypes ) ) }
						className="editor-title__input"
						placeholder={ this.translate( 'Title' ) }
						onChange={ this.onChange }
						onBlur={ this.onBlur }
						onPaste={ this.stripPasteNewlines }
						onKeyPress={ this.preventEnterKeyPress }
						autoFocus={ isNew && ! isMobile() }
						value={ post ? post.title : '' }
						aria-label={ this.translate( 'Edit title' ) }
						ref="titleInput"
						rows="1" />
				</TrackInputChanges>
			</div>
		);
	}
} );
