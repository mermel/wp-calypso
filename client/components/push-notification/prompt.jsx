/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import includes from 'lodash/includes';

/**
 * Internal dependencies
 */
import Notice from 'components/notice';
import Button from 'components/button';
import observe from 'lib/mixins/data-observe';
import {
	dismissNotice,
	toggleEnabled,
} from 'state/push-notifications/actions';
import {
	getStatus,
	isApiReady,
	isAuthorizationLoaded,
	isAuthorized,
	isBlocked,
	isEnabled,
	isNoticeDismissed
} from 'state/push-notifications/selectors';

const SECTION_NAME_WHITELIST = [
	'discover',
	'menus',
	'people',
	'plans',
	'plugins',
	'posts-pages',
	'reader',
	'reader-activities',
	'reader-list',
	'reader-recomendations',
	'reader-search',
	'reader-tags',
	'settings',
	'sharing',
	'stats',
	'upgrades'
];

const PushNotificationPrompt = React.createClass( {
	displayName: 'PushNotificationPrompt',

	mixins: [ observe( 'user' ) ],

	propTypes: {
		user: React.PropTypes.object,
		section: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.bool
		] ),
		isLoading: React.PropTypes.bool
	},

	pushUnsubscribedNotice: function() {
		const buttonDisabled = includes( [ 'disabling', 'enabling', 'unknown' ], this.props.status );
		const noticeText = (
			<div>
				<p>
					<strong>{ this.translate( 'Get notifications on your desktop!' ) }</strong> { this.translate( 'Instantly see your likes, comments, and more—even when you don\'t have WordPress.com open in your browser.' ) }
				</p>
				<p>
					{ this.translate(
						'{{enableButton}}Enable Browser Notifications{{/enableButton}}', {
							components: {
								enableButton: <Button className={ 'push-notification__prompt-enable' } disabled={ buttonDisabled } onClick={ this.props.toggleEnabled } />
							} }
					) }
				</p>
			</div>
		);

		return <Notice className="push-notification__notice" text={ noticeText } icon="bell" onDismissClick={ this.props.dismissNotice } />;
	},

	isUnsupportedChromeVersion: function() {
		if ( global.window && global.window.chrome && global.window.navigator.appVersion ) {
			const match = global.window.navigator.appVersion.match( /Chrome\/(\d+)/ );
			return match[ 1 ] < 50;
		}
		return false;
	},

	render: function() {
		if (
			! this.props.isAuthorizationLoaded ||
			! this.props.isApiReady ||
			this.props.isBlocked ||
			this.props.isNoticeDismissed ||
			( this.props.isEnabled && this.props.isAuthorized ) ||
			this.isUnsupportedChromeVersion()
		) {
			return null;
		}
		const user = this.props.user.get();

		if ( ! user || ! user.email_verified ) {
			return null;
		}

		if ( ! this.props.section || this.props.isLoading || -1 === SECTION_NAME_WHITELIST.indexOf( this.props.section.name ) ) {
			return null;
		}

		return this.pushUnsubscribedNotice();
	}
} );

export default connect(
	( state ) => {
		return {
			isApiReady: isApiReady( state ),
			isAuthorizationLoaded: isAuthorizationLoaded( state ),
			isAuthorized: isAuthorized( state ),
			isBlocked: isBlocked( state ),
			isEnabled: isEnabled( state ),
			isNoticeDismissed: isNoticeDismissed( state ),
			status: getStatus( state )
		};
	},
	{
		dismissNotice,
		toggleEnabled
	}
)( PushNotificationPrompt );
