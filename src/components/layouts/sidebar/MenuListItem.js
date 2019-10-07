/**
 * Menu List Item
 */
import React, { Component } from 'react';
import { connect } from "react-redux";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { showAlert } from '../../../actions/action';

//Intl message
import IntlMessages from '../../../util/IntlMessages';

class MenuListItem extends Component {

   state = {
      menuOpen: false,
      subMenuOpen: ''
   }

   /**
   * On Toggle  Menu
   */
   onToggleMenu() {
      this.setState({ menuOpen: !this.state.menuOpen });
   }

   /**
   * On Toggle Collapse Menu
   */
   onToggleCollapseMenu(key) {
      if (this.state.subMenuOpen === '') {
         this.setState({ subMenuOpen: key });
      } else {
         this.setState({ subMenuOpen: '' });
      }
   }

   render() {
      const { menu, role, showAlert } = this.props;
      return (
         <ListItem button component="li">
				{String(role) === "1" && (menu.menu_title === "menu.farmer" || menu.menu_title === "menu.driver") ? 
					<Button
						to={window.location.pathname}
						component={Link}
						className="tab-element"
						onClick={() => {showAlert("You have no permission!", 'error')}}
					>
						<ListItemIcon>
							<i className="material-icons">{menu.icon}</i>
						</ListItemIcon>
						<IntlMessages id={menu.menu_title} />
					</Button>
					:
					String(role) === "4" && menu.menu_title === "menu.farmer"?
						<Button
							to={window.location.pathname}
							component={Link}
							className="tab-element"
							onClick={() => {showAlert("You have no permission!", 'error')}}
						>
							<ListItemIcon>
								<i className="material-icons">{menu.icon}</i>
							</ListItemIcon>
							<IntlMessages id={menu.menu_title} />
						</Button>
						:
						String(role) === "2" && menu.menu_title === "menu.driver" ?
							<Button
								to={window.location.pathname}
								component={Link}
								className="tab-element"
								onClick={() => {showAlert("You have no permission!", 'error')}}
							>
								<ListItemIcon>
									<i className="material-icons">{menu.icon}</i>
								</ListItemIcon>
								<IntlMessages id={menu.menu_title} />
							</Button>
							:
							String(role) === "null" && (menu.menu_title === "menu.farmer" || menu.menu_title === "menu.driver") ?
								<Button
									to={'/sign-in'}
									component={Link}
									className="tab-element"
									onClick={this.props.closeDrawer}
								>
									<ListItemIcon>
										<i className="material-icons">{menu.icon}</i>
									</ListItemIcon>
									<IntlMessages id={menu.menu_title} />
								</Button>
								:
								<Button
									to={menu.path}
									component={Link}
									className="tab-element"
									onClick={this.props.closeDrawer}
								>
									<ListItemIcon>
										<i className="material-icons">{menu.icon}</i>
									</ListItemIcon>
									<IntlMessages id={menu.menu_title} />
								</Button>
				}
         </ListItem>
      );
   }
}

export default connect(
	state => ({
		role: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile).role : null
	}), {showAlert})(MenuListItem);
