import React, { Component } from 'react';
/* import { Meteor } from 'meteor/meteor'; unused import*/

export default class Inicio extends Component {

  render() {
    return (
      <div>
        <div className="container" id="container-inicio">
          <img id="titulo" src="calendariobg.png" alt="" /> {/* Las imágenes decorativas no deben describirse */}
          <div id="texto">
            <p id="titulo-texto">Knowie</p>
            <br />{/* Pueden usar márgenes de css para esto, para no sobrecargar el html */}
            <p id="subtitulo">El sitio perfecto para encontrar<br />nuevas actividades universitarias<br />cada día a cada hora</p>
          </div>
        </div>
        <div className="container" id="description">
          <h2 id="titulo-description">Con Knowie podrás:</h2>
          <div className="card-deck center">
            <div className="card">
              <img className="size-icon card-img-top" src="calendar-icon.svg" alt="Card image cap" />
              <div className="card-body">
                {/*<h5 className="card-title">Card title</h5>*/}
                <p className="card-text">Mantenerte actualizado constantemente de los eventos que generan los organizadores de tu comunidad
                    universitaria cada semana y a cada hora del día.</p>
                <p className="card-text">
                  <small className="text-muted">Cada semana hay más de 50 eventos!!</small>
                </p>
              </div>
            </div>
            <div className="card">
              <img className="size-icon card-img-top" src="list-icon.svg" alt="Card image cap" />
              <div className="card-body">
                {/*<h5 className="card-title">Card title</h5>*/}
                <p className="card-text">Visualizar la descripción de un evento, la cantidad de cupos que quedan disponibles,
                    el costo, las opiniones previas a la realización y los participantes.</p>
                <p className="card-text">
                  <small className="text-muted">Dejate atrapar de las actividades de la comunidad!!</small>
                </p>
              </div>
            </div>
            <div className="card">
              <img className="size-icon card-img-top" src="reserve-icon.svg" alt="Card image cap" />
              <div className="card-body">
                {/*<h5 className="card-title">Card title</h5>*/}
                <p className="card-text">Reservar la asitencia a uno o varios de los eventos y visualizar las
                    actividades a las que te has inscrito en la semana.</p>
                <p className="card-text">
                  <small className="text-muted">No dejes que se te pasen eventos de tu interés!!</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
