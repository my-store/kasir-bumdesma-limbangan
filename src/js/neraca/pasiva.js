import { numberFormat } from "../api/helper/string";
import React, { Component } from "react";

export default class Pasiva extends Component {
  render() {
    const { pasiva, theme } = this.props;
    const { modal, rugiLaba, total } = pasiva;

    return (
      <div className="pasiva">
        <div className="tr-th-pasiva">
          <p>
            <strong>MODAL</strong>
          </p>
        </div>
        <div className="tr-td-pasiva">
          <p></p>
          <p>
            <strong>{modal > 0 ? numberFormat(modal) : "-"}</strong>
          </p>
        </div>

        <div className="tr-th-pasiva rugi-laba">
          <p>
            <strong>RUGI/ LABA</strong>
          </p>
        </div>
        <div className="tr-td-pasiva">
          <p></p>
          <p>
            <strong style={rugiLaba < 0 ? { color: "red" } : null}>
              {rugiLaba != 0 ? numberFormat(rugiLaba) : "-"}
            </strong>
          </p>
        </div>

        <div className="tr-td-pasiva">
          <p className="total-pasiva" style={{ backgroundColor: theme }}>
            <strong>TOTAL PASIVA</strong>
            <strong>{total > 0 ? numberFormat(total) : "-"}</strong>
          </p>
        </div>
      </div>
    );
  }
}
