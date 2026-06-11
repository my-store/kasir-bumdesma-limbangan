import { numberFormat } from "../../api/helper/string";
import "../../../scss/laporan/print/rugi-laba.scss";
import React, { Component } from "react";

export default class RugiLaba extends Component {
  spacer = (
    id, // Left or right
    length // This is number but converted as array
  ) => {
    return Array.from({ length }, (item, index) => {
      if (id === "left") {
        return (
          <div
            key={index}
            className={`lpp-rugiLaba-left-body-data`}
            style={{ color: "white" }}
          >
            <p className={`lpp-rugiLaba-left-body-data-no`}>-</p>
            <p className={`lpp-rugiLaba-left-body-data-ket`}>-</p>
          </div>
        );
      } else if (id === "right") {
        return (
          <div
            key={index}
            style={{ color: "white" }}
            className="lpp-rugiLaba-right-body-data"
          >
            <p className="bulanLalu">-</p>
            <p
              className="bulanIni"
              style={{
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              -
            </p>
            <p className="bulanDepan">-</p>
          </div>
        );
      }
    });
  };

  render() {
    const { pendapatan, biaya, total, workTime } = this.props;

    // Total pendapatan
    let totalPendapatan = {
      bulanLalu: 0,
      bulanIni: 0,
      bulanDepan: 0,
    };

    // Pendapatan bulan lalu
    totalPendapatan.bulanLalu += pendapatan.bulanLalu.pupukSubsidi;
    totalPendapatan.bulanLalu += pendapatan.bulanLalu.pupuk;
    totalPendapatan.bulanLalu += pendapatan.bulanLalu.obatPertanian;
    // Pendapatan bulan ini
    totalPendapatan.bulanIni += pendapatan.bulanIni.pupukSubsidi;
    totalPendapatan.bulanIni += pendapatan.bulanIni.pupuk;
    totalPendapatan.bulanIni += pendapatan.bulanIni.obatPertanian;
    // Pendapatan bulan depan
    totalPendapatan.bulanDepan += pendapatan.bulanDepan.pupukSubsidi;
    totalPendapatan.bulanDepan += pendapatan.bulanDepan.pupuk;
    totalPendapatan.bulanDepan += pendapatan.bulanDepan.obatPertanian;

    // Total biaya
    let totalBiaya = {
      bulanLalu: 0,
      bulanIni: 0,
      bulanDepan: 0,
    };

    // Biaya bulan lalu
    totalBiaya.bulanLalu += biaya.bulanLalu.honor;
    totalBiaya.bulanLalu += biaya.bulanLalu.transport;
    totalBiaya.bulanLalu += biaya.bulanLalu.lainnya;
    // Biaya bulan ini
    totalBiaya.bulanIni += biaya.bulanIni.honor;
    totalBiaya.bulanIni += biaya.bulanIni.transport;
    totalBiaya.bulanIni += biaya.bulanIni.lainnya;
    // Biaya bulan depan
    totalBiaya.bulanDepan += biaya.bulanDepan.honor;
    totalBiaya.bulanDepan += biaya.bulanDepan.transport;
    totalBiaya.bulanDepan += biaya.bulanDepan.lainnya;

    // Pendapatan
    const pdtBlnLalu = {
      pupukSubsidi: pendapatan.bulanLalu.pupukSubsidi,
      pupuk: pendapatan.bulanLalu.pupuk,
      obat: pendapatan.bulanLalu.obatPertanian,
    };
    const pdtBlnIni = {
      pupukSubsidi: pendapatan.bulanIni.pupukSubsidi,
      pupuk: pendapatan.bulanIni.pupuk,
      obat: pendapatan.bulanIni.obatPertanian,
    };
    const pdtBlnDepan = {
      pupukSubsidi: pendapatan.bulanDepan.pupukSubsidi,
      pupuk: pendapatan.bulanDepan.pupuk,
      obat: pendapatan.bulanDepan.obatPertanian,
    };

    // Biaya
    const biayaBlnLalu = {
      honor: biaya.bulanLalu.honor,
      transport: biaya.bulanLalu.transport,
      lainnya: biaya.bulanLalu.lainnya,
    };
    const biayaBlnIni = {
      honor: biaya.bulanIni.honor,
      transport: biaya.bulanIni.transport,
      lainnya: biaya.bulanIni.lainnya,
    };
    const biayaBlnDepan = {
      honor: biaya.bulanDepan.honor,
      transport: biaya.bulanDepan.transport,
      lainnya: biaya.bulanDepan.lainnya,
    };

    return (
      <div className="lpp-rugiLaba">
        {/* Left */}
        <div className="lpp-rugiLaba-left">
          <div className="lpp-rugiLaba-head">
            <h1 className="lpp-rugiLaba-head-no">No</h1>
            <h1 className="lpp-rugiLaba-head-ket">Keterangan</h1>
          </div>
          {/* Left body */}
          <div className="lpp-rugiLaba-body">
            {/* Pendapatan */}
            <div className="lpp-rugiLaba-left-body-data">
              <p className="lpp-rugiLaba-left-body-data-no">1.</p>
              <p className="lpp-rugiLaba-left-body-data-ket">
                <strong>Pendapatan</strong>
                <span>Pupuk Subsidi</span>
                <span>Pupuk Nonsubsidi</span>
                <span>Obat Pertanian</span>
                <strong className="lpp-rugiLaba-left-body-data-total">
                  Total Pendapatan
                </strong>
              </p>
            </div>

            {/* Spacer */}
            {this.spacer("left", 1)}

            {/* Biaya */}
            <div className="lpp-rugiLaba-left-body-data">
              <p className="lpp-rugiLaba-left-body-data-no">2.</p>
              <p className="lpp-rugiLaba-left-body-data-ket">
                <strong>Biaya</strong>
                <span>Honor Pengelola</span>
                <span>Transport</span>
                <span>Lain-Lain</span>
                <strong className="lpp-rugiLaba-left-body-data-total">
                  Total Biaya
                </strong>
              </p>
            </div>

            {/* Spacer */}
            {this.spacer("left", 1)}

            {/* Surplus/ Defisit */}
            <div
              className="lpp-rugiLaba-left-body-data"
              style={{ backgroundColor: "#b1b1b1" }}
            >
              <p className="lpp-rugiLaba-left-body-data-no"></p>
              <p className="lpp-rugiLaba-left-body-data-ket">
                <strong
                  style={{ lineHeight: 20 + "px" }}
                  className="surplus-defisit"
                >
                  SURPLUS / DEFISIT
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lpp-rugiLaba-right">
          <div className="lpp-rugiLaba-right-head">
            <div className="lpp-rugiLaba-right-head-title">
              <h1>Tahun ini ({workTime.tahun})</h1>
            </div>
            <div className="lpp-rugiLaba-right-head-subtitle">
              <h1>s/d Bulan lalu</h1>
              <h1
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                Bulan ini
              </h1>
              <h1>s/d Bulan ini</h1>
            </div>
            <div className="lpp-rugiLaba-right-head-subtitle">
              <h1>1</h1>
              <h1
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                2
              </h1>
              <h1>3 = (1 + 2)</h1>
            </div>
          </div>

          {/* Right body */}
          <div className="lpp-rugiLaba-right-body">
            {/* Spacer */}
            {this.spacer("right", 1)}

            {/* Pendapatan Pupuk Subsidi */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                {pdtBlnLalu.pupukSubsidi > 0
                  ? numberFormat(pdtBlnLalu.pupukSubsidi)
                  : "-"}
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {pdtBlnIni.pupukSubsidi > 0
                  ? numberFormat(pdtBlnIni.pupukSubsidi)
                  : "-"}
              </p>
              <p className="bulanDepan">
                {pdtBlnDepan.pupukSubsidi > 0
                  ? numberFormat(pdtBlnDepan.pupukSubsidi)
                  : "-"}
              </p>
            </div>

            {/* Pendapatan Pupuk Nonsubsidi */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                {pdtBlnLalu.pupuk > 0 ? numberFormat(pdtBlnLalu.pupuk) : "-"}
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {pdtBlnIni.pupuk > 0 ? numberFormat(pdtBlnIni.pupuk) : "-"}
              </p>
              <p className="bulanDepan">
                {pdtBlnDepan.pupuk > 0 ? numberFormat(pdtBlnDepan.pupuk) : "-"}
              </p>
            </div>

            {/* Pendapatan Obat */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                {pdtBlnLalu.obat > 0 ? numberFormat(pdtBlnLalu.obat) : "-"}
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {pdtBlnIni.obat > 0 ? numberFormat(pdtBlnIni.obat) : "-"}
              </p>
              <p className="bulanDepan">
                {pdtBlnDepan.obat > 0 ? numberFormat(pdtBlnDepan.obat) : "-"}
              </p>
            </div>

            {/* Total Pendapatan */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                <strong>
                  {totalPendapatan.bulanLalu > 0
                    ? numberFormat(totalPendapatan.bulanLalu)
                    : "-"}
                </strong>
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                <strong>
                  {totalPendapatan.bulanIni > 0
                    ? numberFormat(totalPendapatan.bulanIni)
                    : "-"}
                </strong>
              </p>
              <p className="bulanDepan">
                <strong>
                  {totalPendapatan.bulanDepan > 0
                    ? numberFormat(totalPendapatan.bulanDepan)
                    : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            {this.spacer("right", 2)}

            {/* Biaya Honor */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                {biayaBlnLalu.honor > 0
                  ? numberFormat(biayaBlnLalu.honor)
                  : "-"}
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {biayaBlnIni.honor > 0 ? numberFormat(biayaBlnIni.honor) : "-"}
              </p>
              <p className="bulanDepan">
                {biayaBlnDepan.honor > 0
                  ? numberFormat(biayaBlnDepan.honor)
                  : "-"}
              </p>
            </div>
            {/* Biaya Transport */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                {biayaBlnLalu.transport > 0
                  ? numberFormat(biayaBlnLalu.transport)
                  : "-"}
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {biayaBlnIni.transport > 0
                  ? numberFormat(biayaBlnIni.transport)
                  : "-"}
              </p>
              <p className="bulanDepan">
                {biayaBlnDepan.transport > 0
                  ? numberFormat(biayaBlnDepan.transport)
                  : "-"}
              </p>
            </div>
            {/* Biaya Lainnya */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                {biayaBlnLalu.lainnya > 0
                  ? numberFormat(biayaBlnLalu.lainnya)
                  : "-"}
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                {biayaBlnIni.lainnya > 0
                  ? numberFormat(biayaBlnIni.lainnya)
                  : "-"}
              </p>
              <p className="bulanDepan">
                {biayaBlnDepan.lainnya > 0
                  ? numberFormat(biayaBlnDepan.lainnya)
                  : "-"}
              </p>
            </div>
            {/* Total Biaya */}
            <div className="lpp-rugiLaba-right-body-data">
              <p className="bulanLalu">
                <strong>
                  {totalBiaya.bulanLalu > 0
                    ? numberFormat(totalBiaya.bulanLalu)
                    : "-"}
                </strong>
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                <strong>
                  {totalBiaya.bulanIni > 0
                    ? numberFormat(totalBiaya.bulanIni)
                    : "-"}
                </strong>
              </p>
              <p className="bulanDepan">
                <strong>
                  {totalBiaya.bulanDepan > 0
                    ? numberFormat(totalBiaya.bulanDepan)
                    : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            {this.spacer("right", 1)}

            {/* Surplus/ Defisit */}
            <div
              className="lpp-rugiLaba-right-body-data"
              style={{ backgroundColor: "#b1b1b1" }}
            >
              <p className="bulanLalu">
                <strong style={{ lineHeight: 20 + "px" }}>
                  {total.bulanLalu > 0 ? numberFormat(total.bulanLalu) : "-"}
                </strong>
              </p>
              <p
                className="bulanIni"
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                <strong style={{ lineHeight: 20 + "px" }}>
                  {total.bulanIni > 0 ? numberFormat(total.bulanIni) : "-"}
                </strong>
              </p>
              <p className="bulanDepan">
                <strong style={{ lineHeight: 20 + "px" }}>
                  {total.bulanDepan > 0 ? numberFormat(total.bulanDepan) : "-"}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
