/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';

/**
 * Internal dependencies
 */
import {
	customize as customizeAction,
	purchase as purchaseAction,
	activate as activateAction
} from 'state/themes/actions';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import ThemesSiteSelectorModal from './themes-site-selector-modal';
import { preview, purchase, activate, tryandcustomize, getSheetOptions } from './theme-options';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import ThemeShowcase from './theme-showcase';

const ThemesMultiSite = ( props ) => (
	<ThemesSiteSelectorModal { ...props } sourcePath={ '/design' }>
		<ThemeShowcase>
			<SidebarNavigation />
		</ThemeShowcase>
	</ThemesSiteSelectorModal>
);

const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	const options = merge(
		{},
		mapValues( dispatchProps, actionFn => ( {
			action: ( theme, site ) => actionFn( theme, site, 'showcase' )
		} ) ),
		{
			preview,
			purchase,
			activate,
			tryandcustomize,
		},
		getSheetOptions()
	);

	return Object.assign(
		{},
		ownProps,
		stateProps,
		{
			options,
			getDefaultOption: () => options.activate,
			getScreenshotOption: () => options.info
		}
	);
};

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	{
		activate: activateAction,
		tryandcustomize: customizeAction,
		purchase: purchaseAction
	},
	mergeProps
)( ThemesMultiSite );
