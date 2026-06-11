import { indexOf, reloadTime } from "../../api/helper/calendar";
import { numberFormat } from "../../api/helper/string";
import "../../../scss/mesin-kasir/margin/index.scss";
import { FiActivity } from "react-icons/fi";
import Loading from "react-loading";
import React, { Component } from "react";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: {
        hari: "",
        tanggal: "",
        bulan: "",
        tahun: "",
      },
    };
  }

  async componentDidMount() {
    const timestamp = await reloadTime();
    this.setState({ timestamp });
  }

  render() {
    const { workTime } = this.props;
    const indexBulan = indexOf(workTime.bulanIni) + 1; // Index dimulai dari 0

    return (
      <div className="margin">
        <h1 style={{ backgroundColor: this.props.theme }}>
          <span>
            <span style={{ color: "#45efff" }}>MARGIN</span>
            <span
              style={{ fontWeight: "normal", paddingLeft: 5, fontSize: 13 }}
            >
              {workTime.tahun == this.state.timestamp.tahun
                ? workTime.bulanIni == this.state.timestamp.bulan
                  ? workTime.tanggal == this.state.timestamp.tanggal
                    ? "Hari ini"
                    : workTime.tanggal + "/" + indexBulan + "/" + workTime.tahun
                  : workTime.tanggal + "/" + indexBulan + "/" + workTime.tahun
                : workTime.tanggal + "/" + indexBulan + "/" + workTime.tahun}
            </span>
          </span>
          <FiActivity size={16} color="#45efff" />
        </h1>

        {this.props._isLoading ? (
          <div className="list pupuk">
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          </div>
        ) : (
          <div className="list pupuk">
            <p className="list-head">Pupuk Subsidi</p>
            <p className="list-item">
              {this.props.pendapatan.margin.pupukSubsidi > 0 ? (
                numberFormat(this.props.pendapatan.margin.pupukSubsidi)
              ) : (
                <span style={{ fontWeight: "normal" }}>-</span>
              )}
            </p>
          </div>
        )}

        <div className="spacer"></div>

        {this.props._isLoading ? (
          <div className="list pupuk">
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          </div>
        ) : (
          <div className="list pupuk">
            <p className="list-head">Pupuk Nonsubsidi</p>
            <p className="list-item">
              {this.props.pendapatan.margin.pupuk > 0 ? (
                numberFormat(this.props.pendapatan.margin.pupuk)
              ) : (
                <span style={{ fontWeight: "normal" }}>-</span>
              )}
            </p>
          </div>
        )}

        <div className="spacer"></div>

        {this.props._isLoading ? (
          <div className="list obatPertanian">
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          </div>
        ) : (
          <div className="list obatPertanian">
            <p className="list-head">Obat</p>
            <p className="list-item">
              {this.props.pendapatan.margin.obatPertanian > 0 ? (
                numberFormat(this.props.pendapatan.margin.obatPertanian)
              ) : (
                <span style={{ fontWeight: "normal" }}>-</span>
              )}
            </p>
          </div>
        )}

        <div className="spacer"></div>

        {this.props._isLoading ? (
          <div className="list totalMargin">
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          </div>
        ) : (
          <div className="list totalMargin">
            <p className="list-head">Total</p>
            <p className="list-item">
              {this.props.pendapatan.margin.semua > 0 ? (
                numberFormat(this.props.pendapatan.margin.semua)
              ) : (
                <span style={{ fontWeight: "normal" }}>-</span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }
}
