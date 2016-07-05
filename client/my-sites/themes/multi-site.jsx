/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import SidebarNavigation from 'my-sites/sidebar-navigation';
import ThemesSiteSelectorModal from './themes-site-selector-modal';
import {
	preview,
	purchase,
	activate,
	tryandcustomize,
	getSheetOptions,
	bindOptionsToDispatch
} from './theme-options';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import ThemeShowcase from './theme-showcase';

const ThemesMultiSite = ( props ) => (
	<ThemesSiteSelectorModal { ...props } sourcePath={ '/design' }>
		<ThemeShowcase>
			<SidebarNavigation />
		</ThemeShowcase>
	</ThemesSiteSelectorModal>
);

const mergeProps = ( stateProps, dispatchProps, ownProps ) => Object.assign(
	{},
	ownProps,
	stateProps,
	{
		options: dispatchProps,
		defaultOption: dispatchProps.tryandcustomize,
		getScreenshotOption: () => dispatchProps.info
	}
);

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	bindOptionsToDispatch( Object.assign(
		{},
		{
			preview,
			purchase,
			activate,
			tryandcustomize
		},
		getSheetOptions()
	), 'showcase' ),
	mergeProps
)( ThemesMultiSite );
