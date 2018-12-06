import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import './main.html';
 
import '../imports/startup/accounts-config.js';
//import App from '../imports/ui/App.js'; unused import
import { AppRoutes } from '../imports/routes.js';


Meteor.startup(() => {
  render(<AppRoutes />, document.getElementById('render-target'));
});
