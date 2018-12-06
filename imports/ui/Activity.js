import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
/* import {Activities} from '../api/activities.js'; unused import*/

export default class Activity extends Component {


  render() {
    return (
      <div id="activityContainer">
        <Link to={{
          pathname: `activity/${this.props.activity._id}`,
          state: {
            currentActivity: this.props.activity,
            currentUser: Meteor.user(),
          }
        }}>
          <h5>{this.props.activity.title}</h5>

          <br />
          <p>{'Hora: ' + this.props.activity.initTime + ' - ' + this.props.activity.finishTime}</p>
          <br />
        </Link>
      </div>
    );

  }


}
