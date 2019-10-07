/**
 * user profile page
 */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Avatar } from "@material-ui/core";
import AccountCircle from '@material-ui/icons/AccountCircle';
//component
import ContentLoader from '../../../../components/global/loaders/ContentLoader';
import AddUser from './components/AddUser';
//action
import { initCollaborationData, deleteUser } from '../../../../actions/action';
import ConfirmUser from './components/ConfirmUser';
import api from '../../../../api/api';
import { showAlert } from "../../../../actions/action";
import authAction from "../../../../redux/auth/actions";
import appConfig from '../../../../constants/AppConfig';

const { waiting, profileUpdate } = authAction;
const CollaborationColumns = ['image', 'Name', 'Address', 'Email', 'Phone Number', 'action'];

class Collaboration extends React.Component {

  constructor(props) {
    super(props);
    this.confirmationDialog = React.createRef();
    this.state = {}
  }
  
  componentWillMount() {
    var self = this;
    var payload = {
      token: this.props.token,
      farmid: this.props.profile.farminfo.farm_id
    }
    api.POST('farmowner/get_farmers', payload)
      .then(function(res) {
        if (res.data.success) {
          self.props.initCollaborationData(res.data.results);
        } else {
          self.props.showAlert(res.data.message, 'error');
        }
      })
      .catch(function(err) {
        self.props.showAlert('Failed to fetch data. Please try again later...', 'error');
      })
  }

  onAdminRemove(list) {
      this.list = list;
      this.confirmationDialog.current.openDialog();
  }

  /**
    * function for delete cart product
    * @param {boolean} popupResponse 
    */
  deleteListItem(popupResponse) {
      if (popupResponse) {
      var payload = {
        token: this.props.token,
        farmerid: this.list.id
      };
      this.props.waiting(true);
      var self = this;
      api.POST('farmowner/delete_farmer', payload)
        .then(function(res) {
          if (res.data.success) {
            self.props.deleteUser(self.list);
          } else {
            self.props.showAlert(res.data.message, 'error');
          }
          self.list = "";
          self.props.waiting(false);
        })
        .catch(function(err) {
          self.list = "";
          self.props.waiting(false);
          self.props.showAlert('Failed to delete farmer. Please try again later...', 'error');
        })
      }
  }

  render() {
    var { collaborationData } = this.props;
    var { profile } = this.props;

    return (
      <Fragment>
        {collaborationData !== null ?
          <div className="admin-collaboration">
            {parseInt(profile.role) === 2 ?
              <AddUser />
            :
              ""
            }
            <Table className="table-wrap">
              <TableHead>
                <TableRow>
                  {CollaborationColumns.map((th, index) => (
                    parseInt(profile.role) === 2 ?
                      <TableCell key={index} className="fw-bold">{th}</TableCell>
                      :
                      th !== 'action' ?
                        <TableCell key={index} className="fw-bold">{th}</TableCell>
                        :
                        null
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {collaborationData.map((list, index) => (
                  <TableRow key={index}>
                    <TableCell>
                    {list.avatar ?
                      <img src={`${appConfig.S3_BUCKET}${list.avatar}`} alt="user-thumb" height="40" width="40" />
                      :
                      <Avatar
                        aria-haspopup="true"
                        onClick={this.handleMenu}
                        className="icon-btn"
                      >
                        <AccountCircle />
                      </Avatar>
                    }
                    </TableCell>
                    <TableCell>{list.fname} {list.lname}</TableCell>
                    <TableCell>{list.address}, {list.city}, {list.state} {list.zipcode}</TableCell>
                    <TableCell>{list.email}</TableCell>
                    <TableCell>{list.phone}</TableCell>
                    {parseInt(profile.role) === 2 ?
                      <TableCell>
                        <Button
                          className="btn-icon"
                          onClick={() => this.onAdminRemove(list)}
                          disabled={this.props.wait}
                        >
                          <i className="material-icons active-color">delete</i>
                        </Button>
                      </TableCell>
                      :
                      null
                    }                              
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ConfirmUser
              ref={this.confirmationDialog}
              onConfirm={(res) => this.deleteListItem(res)}
            />
          </div>
          :
          <ContentLoader />
        }
      </Fragment >
    )
  }
}

export default connect(
  state => ({
    token: state.Auth.idToken,
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null,
    wait: state.Auth.waiting,
    collaborationData: state.ecommerce.collaborationData
  }), { initCollaborationData, deleteUser, waiting, showAlert, profileUpdate })(Collaboration);
