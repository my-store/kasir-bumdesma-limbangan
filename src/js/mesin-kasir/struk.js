import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import { FiPrinter } from "react-icons/fi";
import Print from "./print";
import { reloadTime } from "../api/helper/calendar";

export default class PrintStruk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: null,
    };
    this.__mounted__ = false;
  }

  async componentDidMount() {
    this.__mounted__ = true;
    const timestamp = await reloadTime();
    this.__mounted__ && this.setState({ timestamp });
  }

  componentWillUnmount() {
    this.__mounted__ = false;
  }

  render() {
    if (this.props.strukData != null && this.state.timestamp != null) {
      return (
        <div>
          <Print
            ref={(el) => (this.componentRef = el)}
            time={this.state.timestamp}
            // Struk data
            strukData={this.props.strukData}
          />
          <div style={{ display: "none", height: 0 }}>
            <ReactToPrint
              trigger={() => {
                return (
                  <button className="print-struk-btn">
                    <FiPrinter size={15} style={{ marginRight: 3 }} />
                    Cetak
                  </button>
                );
              }}
              content={() => this.componentRef}
              onAfterPrint={this.props.removeCetakStruk}
              //   onBeforeGetContent={this.openPrintingPage}
            />
          </div>
        </div>
      );
    } else return null;
  }
}
