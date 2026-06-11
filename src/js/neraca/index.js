import { reloadTime, indexOf, setTime } from "../api/helper/calendar";
import { GetNeraca } from "../api/neraca";
import "../../scss/neraca/index.scss";
import React, { Component } from "react";
import Aktiva from "./aktiva";
import Pasiva from "./pasiva";

export default class Neraca extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tanggal: "- - -",
      aktiva: {
        kas: 0,
        bank: 0,
        persediaan: {
          obatPertanian: 0,
          pupukSubsidi: 0,
          pupuk: 0,
          // Added 11-6-2026
          total: 0,
        },
        inventaris: 0,
        asetTetap: 0,
        hutang: 0,
        selisih: 0,
        total: 0,
      },
      pasiva: {
        modal: 0,
        rugiLaba: 0,
        total: 0,
      },
    };
  }

  async componentDidMount() {
    // Get current-time
    let { tahun, bulan, tanggal } = await reloadTime();
    this.setState({ tanggal: `${tanggal} ${bulan} ${tahun}` });

    // Get pasiva & aktiva from database
    let { aktiva, pasiva } = await GetNeraca(this.props.workTime);

    // Change state
    this.setState({ aktiva, pasiva });
  }

  render() {
    const Theme = this.props.theme;
    const { dataToko } = this.props;

    return (
      <div className="neraca">
        <div className="judul">
          <h1 style={{ color: Theme }}>SISTEM PEMANTAU KEUANGAN</h1>
          <h2 style={{ color: Theme }}>
            {dataToko.nama} {dataToko.alamat}
          </h2>
          <p>Pemantauan data s/d {this.state.tanggal}</p>
        </div>
        <div className="tabel">
          <div className="th" style={{ backgroundColor: Theme }}>
            <p className="aktiva">AKTIVA</p>
            <p className="pasiva">PASIVA</p>
          </div>
          <div className="rp" style={{ backgroundColor: Theme }}>
            <p>Rp.</p>
            <p>Rp.</p>
          </div>
          <div className="td">
            <Aktiva theme={Theme} aktiva={this.state.aktiva} />
            <Pasiva theme={Theme} pasiva={this.state.pasiva} />
          </div>
        </div>
      </div>
    );
  }
}
