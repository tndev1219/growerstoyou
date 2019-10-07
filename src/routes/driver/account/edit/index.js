/**
 * user edit page
 */
import React, { Fragment } from 'react';
import EditInfo from './components/EditInfo';
import ChangePassword from '../../../account/edit/components/ChangePassword';


export default class EditUser extends React.Component {

  render() {
    const { search } = this.props.location;

    return (
      <Fragment>
        {search && search === '?type=info' ?
          <EditInfo />
          :
          <ChangePassword />
        }
      </Fragment>
    )
  }
}

