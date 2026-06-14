import { FiLayers, FiAlertTriangle } from "react-icons/fi";
import { numberFormat } from "../../api/helper/string";
import "../../../scss/mesin-kasir/kas/index.scss";
import React, { Component } from "react";
import Loading from "react-loading";

export default class Main extends Component {
  render() {
    const { theme, _isLoading, kas } = this.props;

    return (
      <div className="kas">
        <h1 style={{ backgroundColor: theme }}>
          <span>
            <span style={{ color: "#ffc145" }}>KAS</span>
            <span>s/d Bulan ini</span>
          </span>
          <FiLayers size={16} color="#ffc145" />
        </h1>
        {_isLoading ? (
          <div className="list">
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          </div>
        ) : (
          <div className="list">
            <p
              className="list-item"
              style={{ color: kas < 1 ? "red" : "black" }}
            >
              {numberFormat(kas)}
            </p>
          </div>
        )}
      </div>
    );
  }
}
