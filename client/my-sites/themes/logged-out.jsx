/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import ThemeShowcase from './theme-showcase';
import { preview, signup, getSheetOptions, bindOptionsToDispatch } from './theme-options';

const mergeProps = ( stateProps, dispatchProps, ownProps ) => Object.assign(
	{},
	ownProps,
	stateProps,
	{
		options: Object.assign(
			{},
			dispatchProps,
			getSheetOptions()
		),
		defaultOption: dispatchProps.signup,
		getScreenshotOption: () => getSheetOptions().info
	}
);

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	bindOptionsToDispatch( {
		signup,
		preview
	}, 'showcase' ),
	mergeProps
)( ThemeShowcase );
