import "../../scss/templates/welcome.scss";
import React, { Component } from "react";
import { FiHeart } from "react-icons/fi";
import Loading from "react-loading";

export default class Welcome extends Component {
  render() {
    const { dataToko } = this.props;

    return (
      <div className="welcome">
        <div className="welcome-logo"></div>
        <h1 className="welcome-title">SISTEM PEMBUKUAN DAN LAPORAN BULANAN</h1>
        <h2 className="welcome-subtitle">
          {dataToko.nama} {dataToko.alamat}
        </h2>
        <p className="welcome-body">
          Loading ... <FiHeart size={15} />
        </p>
        <Loading width={50} height={50} type="bubbles" color="grey" />
      </div>
    );
  }
}
