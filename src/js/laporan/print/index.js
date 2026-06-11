import "../../../scss/laporan/print/index.scss";
import React, { PureComponent } from "react";
import RugiLaba from "./rugi-laba";
import Neraca from "./neraca";

export default class Print extends PureComponent {
  render() {
    const { pendapatan, biaya, total, workTime, neraca, dataToko } = this.props;
    const { hari, tanggal, bulanIni, tahun } = workTime;
    const { aktiva, pasiva } = neraca;

    return (
      <div className="laporan-print-page">
        <div className="lpp-head">
          <div className="logo-upk"></div>
          <div className="title">
            <h1>LAPORAN RUGI LABA DAN NERACA</h1>
            <h1>{dataToko.nama}</h1>
            <h1>{dataToko.alamat}</h1>
            <h1>
              Per {tanggal} {bulanIni} {tahun}
            </h1>
          </div>

          {/* Update 2025 */}
          {/* <div className="logo-dana"></div> */}
        </div>

        <div className="lpp-body">
          <h1 className="lpp-body-title-rugiLaba">RUGI LABA</h1>
          <RugiLaba
            pendapatan={pendapatan}
            biaya={biaya}
            total={total}
            workTime={workTime}
          />
          <h1 className="lpp-body-title-neraca">NERACA</h1>
          <Neraca aktiva={aktiva} pasiva={pasiva} />
        </div>

        <div className="lpp-footer">
          <div className="pf-left">
            <p>Diketahui dan disetujui Oleh:</p>
            <h1>{dataToko.laporan.print.penyetuju.nama}</h1>
            <p>{dataToko.laporan.print.penyetuju.jabatan}</p>
          </div>
          <div className="pf-right">
            <p>Dibuat Oleh:</p>
            <h1>{dataToko.laporan.print.pembuat.nama}</h1>
            <p>{dataToko.laporan.print.pembuat.jabatan}</p>
          </div>
        </div>
        <div className="lpp-footer-app">
          <p>&copy; Permata Kasir</p>
          <p>
            Brebes, {hari} {tanggal} {bulanIni} {tahun}
          </p>
          <p>Permata Komputer Brebes (0823-2438-0852)</p>
        </div>
      </div>
    );
  }
}
