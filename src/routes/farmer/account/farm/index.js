/**
 * user profile page
 */
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';

//component
import ContentLoader from '../../../../components/global/loaders/ContentLoader';


class Farm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			infoData: [
				{title: "Farm Name", value: props.profile.farminfo.name},
				{title: "Farm URL", value: props.profile.farminfo.link_url},
				{title: "Farm Street Address", value: props.profile.farminfo.address},
				{title: "Town/City", value: props.profile.farminfo.city},
				{title: "State", value: props.profile.farminfo.state},
				{title: "Zip", value: props.profile.farminfo.zipcode},
				{title: "Phone Number", value: props.profile.farminfo.link_phone}
			]
	 	};
	}

   render() {

      const { infoData } = this.state;

      return (
         <Fragment>
            {infoData !== null ?
               <div className="profile-wrapper p-sm-15 py-5">
                  <h4 className="mb-30">Farm Infomation</h4>
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
                        to={{ pathname: "edit", search: "?type=farm" }}
                        className="button btn-active"
                     >
                        edit
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
	}), {})(Farm);
