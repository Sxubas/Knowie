import React, { Component } from 'react';
import {Meteor} from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ActivitiesList from './ListaActivities.js';
import Inicio from './Inicio.js';
import Navbar from './Navbar.js';
 
// App component - represents the whole app
class App extends Component {
 
  //Unused method
  /* renderActivities() {
    return this.props.activities.map((activity) => (
      <Activity key={activity._id} activity={activity} />
    ));
  } */
 
  render() {
    return (
      <div>
        <Navbar/>
        {/*redundante !!*/Meteor.user() ?
          <ActivitiesList/>:<Inicio/>
        }
        <div className="footer">
          <p>Juan Sebastián Millán L - Andrés Felipe Lopez. <br/> All Rights Reserved.</p>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(App);
