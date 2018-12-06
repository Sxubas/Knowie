import React, { Component } from 'react';
import Navbar from './Navbar.js';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
/* import {Link} from 'react-router-dom'; unused imprort*/
import { Redirect } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';
/* import Ima from 'react-image'; unused import*/

class ActivityDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentActivity: {},
      currentUser: {},
      showParticipants: false,
      deleted: false,
      twits: [],
      hayMasTwits: false,
      cantidadTwits: 10
    };
  }

  componentDidMount() {

    let path = window.location.href;
    let splitPath = path.split('/');

    const activityId = splitPath[splitPath.length - 1];

    Meteor.call('activities.findone', activityId, (err, activity) => {
      this.setState({
        currentActivity: activity,
        currentUser: Meteor.user(),
      });
    });
    //Cambiar uniandes por el nombre del detail
    Meteor.call('activities.twitter', activityId, this.state.cantidadTwits, (err, twits) => {
      // console.log('twits', twits);
      let hayMas = false;
      let sumarTwits = this.state.cantidadTwits;
      if (twits.length === 10) {
        hayMas = true;
        sumarTwits = sumarTwits + 10;
      }
      this.setState({
        twits: twits,
        hayMasTwits: hayMas,
        cantidadTwits: sumarTwits
      });
    });
  }


  deleteThisActivity() {
    Meteor.call('activities.remove', this.state.currentActivity._id);

    this.setState({
      deleted: true,
    });
  }

  participateInActivity() {
    Meteor.call('activities.participate', this.state.currentActivity._id, (err, activity) => {
      this.setState({
        currentActivity: activity
      });
    });


  }

  showActivityParticipants() {
    let show = this.state.showParticipants;
    this.setState({
      showParticipants: !show,
    });

  }

  renderParticipantsList() {
    return this.state.currentActivity.participants.map((participant, i) => (
      <li key={i} className="texto-info list-group-item">{participant}</li>
    ));
  }

  cargarMas() {
    Meteor.call('activities.twitter', this.state.currentActivity._id, this.state.cantidadTwits, (err, twits) => {
      // console.log('twits', twits);
      let hayMas = false;
      let sumarTwits = this.state.cantidadTwits;
      if (twits.length === 10) {
        hayMas = true;
        sumarTwits = sumarTwits + 10;
      }
      this.setState({
        twits: twits,
        hayMasTwits: hayMas,
        cantidadTwits: sumarTwits
      });
    });
  }

  render() {
    let currentActivity = this.state.currentActivity;
    let currentUser = Meteor.user();
    let participate = false;
    let isParticipant = false;
    if (currentUser === null) {
      return <Redirect to="/" />;
    }


    if (currentActivity.participants !== undefined && currentUser !== undefined) {
      if (currentActivity.participants.includes(currentUser.username) || currentActivity.capacity === 0) {
        participate = true;
      }
    }

    if (currentActivity.participants !== undefined && currentUser !== undefined) {
      if (currentActivity.participants.includes(currentUser.username)) {
        isParticipant = true;
      }
    }

    let deleted = this.state.deleted;
    if (deleted) {
      return (
        <div>
          <Navbar />
          <br />

          <div className="container detail-container">
            <h3>Actividad Eliminada Exitosamente</h3>
            <br />
            <br />
            <h5><a href="/">Regresar a la lista de actividades.</a></h5>
          </div>

        </div>
      );

    }

    var items = [];
    {
      this.state.twits[0] !== undefined ? this.state.twits.map((twit, i) => (
        items.push(
          <div key={'twits' + i} className="row filaTwits">
            <div className="col-3">
              <img className="imagenTwitter" src={twit.user.profile_image_url} alt="imagen_perfil" />
            </div>
            <div className="col-9">
              <h5 className="nombreTwitter">{twit.user.name}</h5>
              <h5 className="usuarioTwitter">@{twit.user.screen_name}</h5>
              <p className="textoTwitter">{twit.text}</p>
            </div>
          </div>
        ))) : '';
    }


    return (
      <div>
        <Navbar />
        <br />
        <div className="container col-md-8" id="detailContainer">
          <div id="titulo-detail">
            <h3 id="titulo">{currentActivity.title}</h3>
          </div>
          <div className="row" id="ambas-partes">
            <div id="detail-descripcion" className="col-6">
              <div className="row">
                <p className="label-info">Lugar:</p>
                <p className="texto-info">{currentActivity.place}</p>
              </div>
              <div className="row">
                <p className="label-info">Fecha:</p>
                <p className="texto-info">{currentActivity.date}</p>
              </div>
              <div className="row">
                <p className="label-info">Hora:</p>
                <p className="texto-info">{currentActivity.initTime + ' - ' + currentActivity.finishTime}</p>
              </div>
              <div className="row">
                <p className="label-info">Capacidad:</p>
                <p className="texto-info">{currentActivity.capacity}</p>
              </div>
              <div className="row">
                <p className="label-info">Precio:</p>
                <p className="texto-info">{currentActivity.price}</p>
              </div>
              <div className="row">
                <p className="label-info">Hashtag Twitter:</p>
                <p className="texto-info">#{currentActivity.hashtag} #knowie</p>
              </div>
              <br />
              {
                currentUser !== undefined && currentUser.username === currentActivity.username ?
                  <button id="btnBorrar" className="delete btn btn-danger" onClick={this.deleteThisActivity.bind(this)}>
                    Borrar
                  </button> : ''

              }
              {
                !participate ? <button id="btnParticipar" className="participate btn btn-primary"
                  onClick={this.participateInActivity.bind(this)}>
                  Participar
                </button> : ''
              }

              {
                currentUser !== undefined && currentUser.username === currentActivity.username ?
                  <button id="btnListaParticipantes" className="userlist btn btn-success"
                    onClick={this.showActivityParticipants.bind(this)}>
                    Lista Participantes
                  </button> : ''
              }

              {
                isParticipant ?
                  <div className="alert alert-primary" role="alert">
                    Ya estás inscrito a esta actividad.
                  </div> : ''
              }
              <br />
              <br />
            </div>
            <div className="col-6">
              <p className="label-info" id="twits">Actividad Reciente</p>
              <div id="container-twits" className="col-12">
                {this.state.twits.length > 0 ?
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.cargarMas.bind(this)}
                    hasMore={this.state.hayMasTwits}
                    useWindow={false}
                    loader={<p>Loading, Please Wait</p>}>
                    {items}
                  </InfiniteScroll>
                  : <div id="sinTwits">
                    <h5 id="tituloNoTwit">Unete a la comunidad tuiteando con nuestro hashtag</h5>
                    <img id="logoTwit" src="/twitter.png" alt="Logo Twitter" />
                  </div>
                }
              </div>
              {
                this.state.showParticipants ?
                  <div>
                    <p className="label-info" id="titulo-participantes">Lista Participantes: </p>
                    <ul className="list-group">
                      {this.renderParticipantsList()}
                    </ul>
                    <br />
                  </div> : ''
              }
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    );
  }
}


export default withTracker(() => {
  Meteor.subscribe('activities');

  return {
    currentUser: Meteor.user()
  };
})(ActivityDetail);
