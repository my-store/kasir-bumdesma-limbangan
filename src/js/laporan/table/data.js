import { numberFormat } from "../../api/helper/string";
import React, { PureComponent } from "react";

export default class Print extends PureComponent {
  render() {
    const { pendapatan, biaya, total } = this.props;

    // Total pendapatan
    let totalPendapatan = {
      bulanLalu: 0,
      bulanIni: 0,
      bulanDepan: 0,
    };

    // Pendapatan bulan lalu
    totalPendapatan.bulanLalu += pendapatan.bulanLalu.obatPertanian;
    totalPendapatan.bulanLalu += pendapatan.bulanLalu.pupuk;
    totalPendapatan.bulanLalu += pendapatan.bulanLalu.pupukSubsidi;
    // Pendapatan bulan ini
    totalPendapatan.bulanIni += pendapatan.bulanIni.obatPertanian;
    totalPendapatan.bulanIni += pendapatan.bulanIni.pupuk;
    totalPendapatan.bulanIni += pendapatan.bulanIni.pupukSubsidi;
    // Pendapatan bulan depan
    totalPendapatan.bulanDepan += pendapatan.bulanDepan.obatPertanian;
    totalPendapatan.bulanDepan += pendapatan.bulanDepan.pupuk;
    totalPendapatan.bulanDepan += pendapatan.bulanDepan.pupukSubsidi;

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

    return (
      <div className="data">
        <div className="left-side">
          <div className="title">
            <h1>OPERASIONAL</h1>
          </div>
          <div className="sub-title">
            <p className="no">No</p>
            <p className="keterangan">Keterangan</p>
          </div>
          <div className="content">
            <div className="pendapatan">
              <div className="no">
                <p>1</p>
              </div>
              <div className="keterangan">
                <p className="header">PENDAPATAN</p>
                <p className="items pupukSubsidi">Pupuk Subsidi</p>
                <p className="items pupuk">Pupuk Non-Subsidi</p>
                <p className="items obat-pertanian">Obat Pertanian</p>
                <p className="items total-pendapatan">TOTAL PENDAPATAN</p>
              </div>
            </div>
            <div className="biaya">
              <div className="no">
                <p>2</p>
              </div>
              <div className="keterangan">
                <p className="header">BIAYA</p>
                <p className="items honor">Honor Pengelola</p>
                <p className="items transport">Transport</p>
                <p className="items lainnya">Operasional Lain-lain</p>
                <p className="items total-biaya">TOTAL BIAYA</p>
              </div>
            </div>
            <div className="defisit">
              <p>SURPLUS / DEFISIT</p>
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="title">
            <h1>PEROLEHAN</h1>
          </div>
          <div className="sub-title">
            <p>s/d Bulan lalu</p>
            <p>Bulan ini</p>
            <p>s/d Bulan ini</p>
          </div>
          <div className="content">
            {/* BULAN LALU */}
            <div className="bulan-lalu">
              {/* PUPUK SUBSIDI*/}
              <p className="pupukSubsidi">
                {pendapatan.bulanLalu.pupukSubsidi > 0
                  ? `${numberFormat(pendapatan.bulanLalu.pupukSubsidi)}`
                  : "-"}
              </p>
              {/* PUPUK */}
              <p className="pupuk">
                {pendapatan.bulanLalu.pupuk > 0
                  ? `${numberFormat(pendapatan.bulanLalu.pupuk)}`
                  : "-"}
              </p>
              {/* OBAT */}
              <p className="obat-pertanian">
                {pendapatan.bulanLalu.obatPertanian > 0
                  ? `${numberFormat(pendapatan.bulanLalu.obatPertanian)}`
                  : "-"}
              </p>

              {/* Total PENDAPATAN bulan lalu */}
              <p className="total-pendapatan total-pendapatan-bulan-lalu">
                {totalPendapatan.bulanLalu > 0
                  ? `${numberFormat(totalPendapatan.bulanLalu)}`
                  : "-"}
              </p>

              <div className="content-spacer"></div>

              <p className="honor">
                {biaya.bulanLalu.honor > 0
                  ? `${numberFormat(biaya.bulanLalu.honor)}`
                  : "-"}
              </p>
              <p className="transport">
                {biaya.bulanLalu.transport > 0
                  ? `${numberFormat(biaya.bulanLalu.transport)}`
                  : "-"}
              </p>
              <p className="lainnya">
                {biaya.bulanLalu.lainnya > 0
                  ? `${numberFormat(biaya.bulanLalu.lainnya)}`
                  : "-"}
              </p>

              {/* Total BIAYA bulan lalu */}
              <p className="total-biaya total-biaya-bulan-lalu">
                {totalBiaya.bulanLalu > 0
                  ? `${numberFormat(totalBiaya.bulanLalu)}`
                  : "-"}
              </p>

              {/* Surplus bulan lalu */}
              <div className="content-total">
                <h1 style={total.bulanLalu < 0 ? { color: "red" } : null}>
                  {Math.abs(total.bulanLalu) > 0
                    ? numberFormat(total.bulanLalu)
                    : "-"}
                </h1>
              </div>
            </div>
            {/* BULAN INI */}
            <div className="bulan-ini">
              {/* PUPUK SUBSIDI*/}
              <p className="pupukSubsidi">
                {pendapatan.bulanIni.pupukSubsidi > 0
                  ? `${numberFormat(pendapatan.bulanIni.pupukSubsidi)}`
                  : "-"}
              </p>
              {/* PUPUK */}
              <p className="pupuk">
                {pendapatan.bulanIni.pupuk > 0
                  ? `${numberFormat(pendapatan.bulanIni.pupuk)}`
                  : "-"}
              </p>
              {/* OBAT */}
              <p className="obat-pertanian">
                {pendapatan.bulanIni.obatPertanian > 0
                  ? `${numberFormat(pendapatan.bulanIni.obatPertanian)}`
                  : "-"}
              </p>

              {/* Total PENDAPATAN bulan ini */}
              <p className="total-pendapatan total-pendapatan-bulan-ini">
                {totalPendapatan.bulanIni > 0
                  ? `${numberFormat(totalPendapatan.bulanIni)}`
                  : "-"}
              </p>

              <div className="content-spacer"></div>

              <p className="honor">
                {biaya.bulanIni.honor > 0
                  ? `${numberFormat(biaya.bulanIni.honor)}`
                  : "-"}
              </p>
              <p className="transport">
                {biaya.bulanIni.transport > 0
                  ? `${numberFormat(biaya.bulanIni.transport)}`
                  : "-"}
              </p>
              <p className="lainnya">
                {biaya.bulanIni.lainnya > 0
                  ? `${numberFormat(biaya.bulanIni.lainnya)}`
                  : "-"}
              </p>

              {/* Total BIAYA bulan ini */}
              <p className="total-biaya total-biaya-bulan-ini">
                {totalBiaya.bulanIni > 0
                  ? `${numberFormat(totalBiaya.bulanIni)}`
                  : "-"}
              </p>

              {/* Surplus bulan ini */}
              <div className="content-total">
                <h1 style={total.bulanIni < 0 ? { color: "red" } : null}>
                  {Math.abs(total.bulanIni) > 0
                    ? numberFormat(total.bulanIni)
                    : "-"}
                </h1>
              </div>
            </div>
            {/* BULAN DEPAN */}
            <div className="bulan-depan">
              {/* PUPUK SUBSIDI */}
              <p className="pupukSubsidi">
                {pendapatan.bulanDepan.pupukSubsidi > 0
                  ? `${numberFormat(pendapatan.bulanDepan.pupukSubsidi)}`
                  : "-"}
              </p>
              {/* PUPUK */}
              <p className="pupuk">
                {pendapatan.bulanDepan.pupuk > 0
                  ? `${numberFormat(pendapatan.bulanDepan.pupuk)}`
                  : "-"}
              </p>
              {/* OBAT */}
              <p className="obat-pertanian">
                {pendapatan.bulanDepan.obatPertanian > 0
                  ? `${numberFormat(pendapatan.bulanDepan.obatPertanian)}`
                  : "-"}
              </p>

              {/* Total PENDAPATAN bulan depan */}
              <p className="total-pendapatan total-pendapatan-bulan-depan">
                {totalPendapatan.bulanDepan > 0
                  ? `${numberFormat(totalPendapatan.bulanDepan)}`
                  : "-"}
              </p>

              <div className="content-spacer"></div>

              <p className="honor">
                {biaya.bulanDepan.honor > 0
                  ? `${numberFormat(biaya.bulanDepan.honor)}`
                  : "-"}
              </p>
              <p className="transport">
                {biaya.bulanDepan.transport > 0
                  ? `${numberFormat(biaya.bulanDepan.transport)}`
                  : "-"}
              </p>
              <p className="lainnya">
                {biaya.bulanDepan.lainnya > 0
                  ? `${numberFormat(biaya.bulanDepan.lainnya)}`
                  : "-"}
              </p>

              {/* Total BIAYA bulan depan */}
              <p className="total-biaya total-biaya-bulan-depan">
                {totalBiaya.bulanDepan > 0
                  ? `${numberFormat(totalBiaya.bulanDepan)}`
                  : "-"}
              </p>

              {/* Surplus s/d bulan ini */}
              <div className="content-total">
                <h1 style={total.bulanDepan < 0 ? { color: "red" } : null}>
                  {Math.abs(total.bulanDepan) > 0
                    ? numberFormat(total.bulanDepan)
                    : "-"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
