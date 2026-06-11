import { numberFormat } from "../api/helper/string";
import React, { Component } from "react";

export default class Aktiva extends Component {
  render() {
    const { aktiva, theme } = this.props;
    const {
      hutang,
      kas,
      bank,
      asetTetap,
      selisih,
      inventaris,
      persediaan,
      total,
    } = aktiva;

    return (
      <div className="aktiva">
        <div className="tr-th-aktiva">
          <p>
            <strong>KAS</strong>
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p></p>
          <p>
            <strong style={{ color: kas < 0 ? "red" : "black" }}>
              {kas != 0 ? numberFormat(kas) : "-"}
            </strong>
          </p>
        </div>

        <div className="tr-th-aktiva">
          <p>
            <strong>BANK</strong>
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p></p>
          <p>
            <strong style={{ color: bank < 0 ? "red" : "black" }}>
              {bank != 0 ? numberFormat(bank) : "-"}
            </strong>
          </p>
        </div>

        <div className="tr-th-aktiva">
          <p>
            <strong>PERSEDIAAN</strong>
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p>Pupuk Subsidi</p>
          <p style={{ color: persediaan.pupukSubsidi < 0 ? "red" : "black" }}>
            {persediaan.pupukSubsidi != 0
              ? numberFormat(persediaan.pupukSubsidi)
              : "-"}
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p>Pupuk Non-Subsidi</p>
          <p style={{ color: persediaan.pupuk < 0 ? "red" : "black" }}>
            {persediaan.pupuk != 0 ? numberFormat(persediaan.pupuk) : "-"}
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p>Obat Pertanian</p>
          <p style={{ color: persediaan.obatPertanian < 0 ? "red" : "black" }}>
            {persediaan.obatPertanian != 0
              ? numberFormat(persediaan.obatPertanian)
              : "-"}
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p
            className="total-persediaan"
            style={{ color: persediaan.total < 0 ? "red" : "black" }}
          >
            {persediaan.total != 0 ? numberFormat(persediaan.total) : "-"}
          </p>
        </div>

        <div className="tr-th-aktiva">
          <p>
            <strong>INVENTARIS</strong>
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p></p>
          <p>
            <strong style={{ color: inventaris < 0 ? "red" : "black" }}>
              {inventaris != 0 ? numberFormat(inventaris) : "-"}
            </strong>
          </p>
        </div>

        <div className="tr-th-aktiva">
          <p>
            <strong>PIUTANG</strong>
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p></p>
          <p>
            <strong style={{ color: hutang < 0 ? "red" : "black" }}>
              {hutang != 0 ? numberFormat(hutang) : "-"}
            </strong>
          </p>
        </div>

        {/* Update 2025 */}
        <div className="tr-th-aktiva">
          <p>
            <strong>ASET TETAP</strong>
          </p>
        </div>
        <div className="tr-td-aktiva">
          <p></p>
          <p>
            <strong style={{ color: asetTetap < 0 ? "red" : "black" }}>
              {asetTetap != 0 ? numberFormat(asetTetap) : "-"}
            </strong>
          </p>
        </div>

        {selisih > 0 && (
          <div
            className="tr-th-aktiva"
            style={{ backgroundColor: "rgb(218, 48, 48)", color: "white" }}
          >
            <p>
              <strong>SELISIH</strong>
            </p>
            <p>
              <strong>{numberFormat(selisih)}</strong>
            </p>
          </div>
        )}

        <div
          className="tr-td-aktiva"
          style={{
            marginTop: selisih > 0 ? -11 : 20,
          }}
        >
          <p className="total-aktiva" style={{ backgroundColor: theme }}>
            <strong>TOTAL AKTIVA</strong>
            <strong>{numberFormat(total)}</strong>
          </p>
        </div>
      </div>
    );
  }
}
