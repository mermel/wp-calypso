/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import PopoverMenuItem from 'components/popover/menu-item';
import RootChild from 'components/root-child';
import WebPreview from 'components/web-preview';
import { getPost, getPostPreviewUrl } from 'state/posts/selectors';

class PostActionsEllipsisMenuView extends Component {
	static propTypes = {
		globalId: PropTypes.string,
		translate: PropTypes.func.isRequired,
		previewUrl: PropTypes.string
	};

	constructor() {
		super( ...arguments );

		this.previewPost = this.previewPost.bind( this );
		this.showPreview = this.togglePreview.bind( this, true );
		this.hidePreview = this.togglePreview.bind( this, false );
		this.state = { isPreviewing: false };
	}

	togglePreview( isPreviewing ) {
		this.setState( { isPreviewing } );
	}

	previewPost( event ) {
		this.showPreview();
		event.preventDefault();
	}

	render() {
		const { translate, previewUrl } = this.props;
		if ( ! previewUrl ) {
			return null;
		}

		return (
			<PopoverMenuItem
				href={ previewUrl }
				onClick={ this.previewPost }
				icon="external"
				target="_blank">
				{ translate( 'View', { context: 'verb' } ) }
				{ this.state.isPreviewing && (
					<RootChild>
						<WebPreview
							previewUrl={ previewUrl }
							onClose={ this.hidePreview }
							showPreview />
					</RootChild>
				) }
			</PopoverMenuItem>
		);
	}
}

export default connect( ( state, ownProps ) => {
	const post = getPost( state, ownProps.globalId );
	return {
		previewUrl: post ? getPostPreviewUrl( state, post.site_ID, post.ID ) : null
	};
} )( localize( PostActionsEllipsisMenuView ) );
