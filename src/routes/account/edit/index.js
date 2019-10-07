/**
 * user edit page
 */
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import EditCard from './components/EditCard';
import EditAddress from './components/EditAddress';
import EditInfo from './components/EditInfo';
import ChangePassword from './components/ChangePassword';


export default class EditUser extends React.Component {

  render() {
    const { search } = this.props.location;

    return (
      <Fragment>
        {search && search === '?type=info'
          ?
          <EditInfo />
          :
            search === '?type=changepw' ?
              <ChangePassword />
              :
              search === '?type=address' || search === '?type=ship-address' ?
                <EditAddress type={search} />
                :
                search.includes('?type=card&id=') || search === '?type=add-card' ?
                  <EditCard type={search} />
                  :
                  <Redirect to={`/account/profile`} />
        }
      </Fragment>
    )
  }
}

