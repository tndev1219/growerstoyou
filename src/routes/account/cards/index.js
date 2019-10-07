/**
 * card detail
 */
import React from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import { api } from '../../../api';
import { showAlert } from '../../../actions/action';


class UserCards extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cardData: []
		}
	}

	componentWillMount() {
		var payload = {
			token: this.props.token
		}
		var self = this;

		api.POST('card/usercard', payload)
			.then(function(res) {
				if (res.data.success) {
					self.setState({ cardData: res.data.results });
				} else {
					self.props.showAlert(res.data.message, 'error');
				}
			})
			.catch(function(err) {
				self.props.showAlert('Failed to fetch card data. Please try again later...', 'error');
			})
	}

	render() {
		return (
			<div className="card-wrapper p-sm-15">
				<div className="d-sm-flex justify-content-between align-items-center card-title">
					<h4>Saved Card Infomation</h4>
					<Button
						component={Link}
						to={{ pathname: "edit", search: "?type=add-card" }}
						className="button btn-active mb-sm-0 mb-10"
					>
						add new card
					</Button>
				</div>
				<Grid container spacing={4} className="my-0">
					{this.state.cardData.map((card, index) => (
						<Grid item xs={12} sm={12} md={6} lg={5} xl={5} key={index}>
							<div className="iron-shadow p-15 rounded">
								<h5>
									{card.branch} -- {card.funding} Card
								</h5>
								<div className="pt-15">
									<div className="saved-card-box mb-25">
										<span>XXXX XXXX XXXX {card.number}</span>
									</div>
									<Button
										component={Link}
										to={{ pathname: "edit", search: `?type=card&id=${card.id}` }}
										className="button btn-active"
									>
										edit
									</Button>
								</div>
							</div>
						</Grid>
					))}
				</Grid>
			</div>
		)
	}
}

export default connect(
	state => ({
		token: state.Auth.idToken,
	}), { showAlert })(UserCards);