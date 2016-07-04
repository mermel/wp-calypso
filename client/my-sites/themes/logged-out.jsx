/**
 * External dependencies
 */
import { connect } from 'react-redux';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';

/**
 * Internal dependencies
 */
import { signupAction } from 'state/themes/actions' ;
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import ThemeShowcase from './theme-showcase';
import { preview, signup, getSheetOptions } from './theme-options';

const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	const options = merge(
		{},
		mapValues( dispatchProps, actionFn => ( {
			action: ( theme, site ) => actionFn( theme, site, 'showcase' )
		} ) ),
		{
			signup,
			preview
		},
		getSheetOptions()
	);

	return Object.assign(
		{},
		ownProps,
		stateProps,
		{
			options,
			defaultOption: options.signup,
			getScreenshotOption: () => options.info
		}
	);
};

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	{ signup: signupAction },
	mergeProps
)( ThemeShowcase );
