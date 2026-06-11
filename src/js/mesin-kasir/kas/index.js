import { FiLayers, FiAlertTriangle } from "react-icons/fi";
import { numberFormat } from "../../api/helper/string";
import "../../../scss/mesin-kasir/kas/index.scss";
import React, { Component } from "react";
import Loading from "react-loading";

export default class Main extends Component {
  render() {
    const {
      shareProfit_1,
      shareProfit_2,
      theme,
      _isLoading,
      kas /* hutang */,
    } = this.props;

    return (
      <div className="kas-hutang">
        <div className="kas">
          <h1 style={{ backgroundColor: theme }}>
            <span>
              <span style={{ color: "#ffc145" }}>KAS</span>
              <span>s/d Bulan ini</span>
            </span>
            <FiLayers size={16} color="#ffc145" />
          </h1>
          {_isLoading._kas ? (
            <div className="list">
              <div className="loading">
                <Loading width={50} height={50} type="bubbles" color="grey" />
              </div>
            </div>
          ) : (
            <div className="list">
              <p className="list-item">
                {kas > 0 ? (
                  numberFormat(kas)
                ) : (
                  <span style={{ fontWeight: "normal" }}>-</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="spacer"></div>

        {/* Hutang | Removed in 2025 */}
        {/* <div className="hutang">
          <h1 style={{ backgroundColor: theme }}>
            <span>
              <span style={{ color: "#ff94a4" }}>PIUTANG</span>
              <span>s/d Bulan ini</span>
            </span>
            <FiAlertTriangle size={16} color="#ff94a4" />
          </h1>
          {_isLoading._hutang ? (
            <div className="list">
              <div className="loading">
                <Loading width={50} height={50} type="bubbles" color="grey" />
              </div>
            </div>
          ) : (
            <div className="list">
              <p className="list-item">
                {hutang > 0 ? (
                  numberFormat(hutang)
                ) : (
                  <span style={{ fontWeight: "normal" }}>-</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="spacer"></div> */}

        {/* Share Profit | Applied in 2025 */}
        <div className="share">
          <h1 style={{ backgroundColor: theme }}>
            <span style={{ color: "#ff94a4" }}>SHARE PROFIT</span>
            <span style={{ fontWeight: "normal" }}>s/d Bulan ini</span>
          </h1>
          {/* Profit 1 & 2 */}
          {_isLoading._shareProfit_1 || _isLoading._shareProfit_2 ? (
            <div className="list">
              <div className="loading">
                <Loading width={50} height={50} type="bubbles" color="grey" />
              </div>
            </div>
          ) : (
            <div className="list">
              <p className="list-item">
                {shareProfit_1.total > 0 ? (
                  numberFormat(shareProfit_1.total)
                ) : (
                  <span style={{ fontWeight: "normal" }}>-</span>
                )}
                {shareProfit_1.total > 0 && (
                  <span className="percent">{shareProfit_1.percent}%</span>
                )}
              </p>
              <p className="list-item">
                {shareProfit_2.total > 0 ? (
                  numberFormat(shareProfit_2.total)
                ) : (
                  <span style={{ fontWeight: "normal" }}>-</span>
                )}
                {shareProfit_2.total > 0 && (
                  <span className="percent">{shareProfit_2.percent}%</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
