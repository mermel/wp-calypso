/**
 * External dependencies
 */
const React = require( 'react' );

/**
 * Internal dependencies
 */
const Card = require( 'components/card' );

const NonOwnerCard = React.createClass( {
	render() {
		return (
			<Card className="domain-management-non-owner-card">
				<p className="domain-management-non-owner-card__explanation">
					{ this.translate(
						'Only the owner of the domain can perform this action.'
					) }
				</p>
			</Card>
		);
	}
} );

export default NonOwnerCard;
