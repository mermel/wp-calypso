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
		options: dispatchProps,
		defaultOption: dispatchProps.signup,
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
			signup,
			preview
		},
		getSheetOptions()
	), 'showcase' ),
	mergeProps
)( ThemeShowcase );
