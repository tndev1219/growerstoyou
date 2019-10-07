/**
 * user edit page
 */
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import EditInfo from './components/EditInfo';
import EditFarm from './components/EditFarm';
import ChangePassword from '../../../account/edit/components/ChangePassword';


export default class EditUser extends React.Component {

  render() {
    const { search } = this.props.location;
    return (
      <Fragment>
        {search && search === '?type=info'
          ?
          <EditInfo />
          :
            search && search === '?type=farm' ?
              <EditFarm />
              :
              search && search === '?type=changepw' ?
                <ChangePassword />
                :
                <Redirect to={`/farmer/account/profile`} />
        }
      </Fragment>
    )
  }
}

