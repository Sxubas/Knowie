import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
//import * as _ from 'meteor/underscore'; unused import
import { HTTP } from 'meteor/http';
import btoa from 'btoa';

export const Activities = new Mongo.Collection('activities');

if (Meteor.isServer) {

  Meteor.publish('activities', function activitiesPublication() {
    return Activities.find();
  });
}

Meteor.methods({
  'activities.insert'(title, place, date, initTime, finishTime, capacity, price, hashtag) {
    check(title, String);
    check(hashtag, String);
    check(place, String);
    check(capacity, Number);
    check(price, Number);

    //Revisar un poco más los parámetros no estaría mal
    //if(initTime > finishTime) throw new Meteor.Error('bad-request');
    //if(price < 0 || capacity < 0) throw new Meteor.Error('bad-request');

    if (!/* this.userId usar el meteor.user puede ser más seguro */ Meteor.user()._id) {
      throw new Meteor.Error('not-authorized');
    }


    Activities.insert({
      title,
      place,
      date,
      initTime,
      finishTime,
      capacity,
      price,
      hashtag,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      participants: [],
    });

  },
  'activities.organizadores'() {
    const organizadores = Activities.find({}, { sort: { username: 1 }, fields: { username: true, _id: false } });
    var result = [];
    organizadores.forEach((a, i) => {
      //Por qué hacen ! a un entero y luego lo comparan contra un número?
      //Al menos poner un comentario de por qué
      if (!result.indexOf(a.username) >= 0) {
        result[i] = a;
      }
    });
    return result;
  },
  'activities.remove'(activityId) {
    check(activityId, String);
    //Cualquiera puede borrar actividades?
    //Al menos pídanle que esté autenticado
    if (Meteor.user())
      Activities.remove(activityId);
    else
      throw new Meteor.Error('unauthorized');
  },
  'activities.participate'(activityId) {
    check(activityId, String);

    //Solo dejar que los usuarios puedan participar
    if (!Meteor.user()) throw new Meteor.Error('unauthorized');
    //Se puede revisar primero que la capacidad no sea negativa después de disminuirle 1
    Activities.update(activityId, {
      $inc: { capacity: -1 },
      //Se puede acceder al perfil directamente con Meteor.user()
      $push: { participants: Meteor.user().profile.username }
    });

    const answer = Activities.findOne({ _id: activityId });
    return answer;
  },
  'activities.findone'(activityId) {
    check(activityId, String);

    const answer = Activities.findOne({ _id: activityId });
    return answer;
  },
  'activities.busqueda'(busqueda) {
    check(busqueda, String);
    let resultado = Activities.find({ 'title': { $regex: busqueda } });
    return resultado.fetch();
  },
  'activities.twitter'(activityId, cantidadTwits) {

    //La manera que funciona pero muy poco nivel
    check(activityId, String);
    const answer = Activities.findOne({ _id: activityId });
    let access = HTTP.call('POST', 'https://api.twitter.com/oauth2/token', {
      params: { grant_type: 'client_credentials' },
      headers: {
        Authorization: 'Basic ' + btoa('G8A7dgn273u77c3F6ivFs3GC7:XCuP9Jt3HEDq9Cb1qymQL5TE6VrbcbUnAXcxeaQtjtqnPxYTeV')
      }
    }
    );
    let accessToken = JSON.parse(access.content).access_token;
    let result = HTTP.call('GET', 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + answer.hashtag + '%20%23knowie&count=' + cantidadTwits + '&result_type=recent', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    return JSON.parse(result.content).statuses;

    //Para usar un cliente http con promesas/callbacks, prueben usar Axios

    //La manera más cool pero re imposible hasta el momento
    // return HTTP.call('POST', 'https://api.twitter.com/oauth2/token', {
    //   params: {grant_type: 'client_credentials'},
    //   headers: {
    //     Authorization: 'Basic ' + btoa('a8rTnlPA0tB3QXXstZnnRfiyx:GUSiHbf1FrPZURYKfT1LQ8RytRqkHtr96SZhgK4aLCwXE30H8p')
    //   }
    // },
    //   function (error, response) {
    //   if (error) console.log('error', error);
    //   else {
    //     let accessToken = JSON.parse(response.content).access_token;
    //     return HTTP.call('GET', 'https://api.twitter.com/1.1/search/tweets.json?q=knowie', {
    //       headers: {
    //         Authorization: 'Bearer ' + accessToken
    //       }
    //     }, (error, response) => {
    //       if (error) console.log('error', error);
    //       else {
    //         return response.content;
    //       }
    //     })
    //     return accessToken;
    //   }
    // }
    // )
  },
  'activities.findbyadmin'(adminUsername) {
    check(adminUsername, String);
    let resultado = Activities.find({ 'username': adminUsername });
    return resultado;
  }
});
