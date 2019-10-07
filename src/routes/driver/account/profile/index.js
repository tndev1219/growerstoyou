/**
 * user profile page
 */
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';

//component
import ContentLoader from '../../../../components/global/loaders/ContentLoader';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoData: [
        {title: "First Name", value: props.profile.fname},
        {title: "Last Name", value: props.profile.lname},
        {title: "Street Address", value: props.profile.address},
        {title: "Town/City", value: props.profile.city},
        {title: "State", value: props.profile.state},
        {title: "Zip", value: props.profile.zipcode},
        {title: "Phone Number", value: props.profile.phone}
      ]
    };
  }

  render() {

    const { infoData } = this.state;

    return (
      <Fragment>
        {infoData !== null ?
          <div className="profile-wrapper p-sm-15 py-5">
            <h4 className="mb-30">Profile Infomation</h4>
            <div>
              <ul className="user-basic-info">
                {infoData.map((info, index) => {
                  return (
                    <li key={index} className="profile-field mb-15">
                      <span>{info.title}</span>
                      <span>{info.value}</span>
                    </li>
                  )
                })}
              </ul>
              <Button
                component={Link}
                to={{ pathname: "edit", search: "?type=info" }}
                className="button btn-active mr-20"
              >
                edit
              </Button>
              <Button
                component={Link}
                to={{ pathname: "edit", search: "?type=changepw" }}
                className="button btn-active"
              >
                change password
              </Button>
            </div>
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
    profile: state.Auth.idProfile ? JSON.parse(state.Auth.idProfile) : null
  }), {})(Profile);