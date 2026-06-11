import { indexOf, reloadTime } from "../../api/helper/calendar";
import "../../../scss/mesin-kasir/pendapatan/index.scss";
import { numberFormat } from "../../api/helper/string";
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
      <div className="pendapatan">
        <h1 style={{ backgroundColor: this.props.theme }}>
          <span>
            <span style={{ color: "#57ff45" }}>OMSET</span>
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
          <FiActivity size={16} color="#57ff45" />
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
              {this.props.pendapatan.omset.pupukSubsidi > 0 ? (
                "Rp " + numberFormat(this.props.pendapatan.omset.pupukSubsidi)
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
              {this.props.pendapatan.omset.pupuk > 0 ? (
                "Rp " + numberFormat(this.props.pendapatan.omset.pupuk)
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
              {this.props.pendapatan.omset.obatPertanian > 0 ? (
                "Rp " + numberFormat(this.props.pendapatan.omset.obatPertanian)
              ) : (
                <span style={{ fontWeight: "normal" }}>-</span>
              )}
            </p>
          </div>
        )}

        <div className="spacer"></div>

        {this.props._isLoading ? (
          <div className="list totalPendapatan">
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          </div>
        ) : (
          <div className="list totalPendapatan">
            <p className="list-head">Total</p>
            <p className="list-item">
              {this.props.pendapatan.omset.semua > 0 ? (
                "Rp " + numberFormat(this.props.pendapatan.omset.semua)
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
