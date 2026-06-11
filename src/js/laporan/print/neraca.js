import { numberFormat } from "../../api/helper/string";
import "../../../scss/laporan/print/neraca.scss";
import React, { Component } from "react";

export default class Neraca extends Component {
  render() {
    const { aktiva, pasiva } = this.props;

    return (
      <div className="lpp-neraca">
        {/* Aktiva */}
        <div className="lpp-neraca-left">
          <div className="lpp-neraca-left-head">
            <h1>AKTIVA</h1>
            <p>(Rp.)</p>
          </div>
          {/* Aktiva Body */}
          <div className="lpp-neraca-left-body">
            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Kas */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>KAS</strong>
              </p>
              <p>
                <strong>
                  {aktiva.kas > 0 ? numberFormat(aktiva.kas) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Bank */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>BANK</strong>
              </p>
              <p>
                <strong>
                  {aktiva.bank > 0 ? numberFormat(aktiva.bank) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Persediaan */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>PERSEDIAAN</strong>
              </p>
              <p style={{ color: "white" }}>-</p>
            </div>

            {/* Pupuk Subsidi */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <span>Pupuk Subsidi</span>
              </p>
              <p>
                {aktiva.persediaan.pupukSubsidi > 0
                  ? numberFormat(aktiva.persediaan.pupukSubsidi)
                  : "-"}
              </p>
            </div>

            {/* Pupuk Nonsubsidi */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <span>Pupuk Nonsubsidi</span>
              </p>
              <p>
                {aktiva.persediaan.pupuk > 0
                  ? numberFormat(aktiva.persediaan.pupuk)
                  : "-"}
              </p>
            </div>

            {/* Obat Pertanian */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <span>Obat Pertanian</span>
              </p>
              <p>
                {aktiva.persediaan.obatPertanian > 0
                  ? numberFormat(aktiva.persediaan.obatPertanian)
                  : "-"}
              </p>
            </div>

            {/* Total Persediaan */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong className="lpp-neraca-left-body-data-total">
                  TOTAL PERSEDIAAN
                </strong>
              </p>
              <p>
                <strong>
                  {aktiva.persediaan.total > 0
                    ? numberFormat(aktiva.persediaan.total)
                    : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Inventaris */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>INVENTARIS</strong>
              </p>
              <p>
                <strong>
                  {aktiva.inventaris > 0
                    ? numberFormat(aktiva.inventaris)
                    : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Piutang */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>PIUTANG</strong>
              </p>
              <p>
                <strong>
                  {aktiva.hutang > 0 ? numberFormat(aktiva.hutang) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Aset Tetap */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>ASET TETAP</strong>
              </p>
              <p>
                <strong>
                  {aktiva.asetTetap > 0 ? numberFormat(aktiva.asetTetap) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Selisih */}
            <div className="lpp-neraca-left-body-data">
              <p>
                <strong>SELISIH</strong>
              </p>
              <p>
                <strong>
                  {aktiva.selisih > 0 ? numberFormat(aktiva.selisih) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-left-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Total Aktiva */}
            <div
              className="lpp-neraca-left-body-data"
              style={{ backgroundColor: "#b1b1b1", lineHeight: 20 + "px" }}
            >
              <p>
                <strong className="lpp-neraca-left-body-data-total">
                  TOTAL AKTIVA
                </strong>
              </p>
              <p>
                <strong>
                  {aktiva.total > 0 ? numberFormat(aktiva.total) : "-"}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Pasiva */}
        <div className="lpp-neraca-right">
          <div className="lpp-neraca-right-head">
            <h1>PASIVA</h1>
            <p>(Rp.)</p>
          </div>
          <div className="lpp-neraca-right-body">
            {/* Spacer */}
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Modal */}
            <div className="lpp-neraca-right-body-data">
              <p>
                <strong>MODAL</strong>
              </p>
              <p>
                <strong>
                  {pasiva.modal > 0 ? numberFormat(pasiva.modal) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Rugi/ Laba */}
            <div className="lpp-neraca-right-body-data">
              <p>
                <strong>RUGI LABA</strong>
              </p>
              <p>
                <strong>
                  {pasiva.rugiLaba > 0 ? numberFormat(pasiva.rugiLaba) : "-"}
                </strong>
              </p>
            </div>

            {/* Spacer */}
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>
            <div
              className="lpp-neraca-right-body-data"
              style={{ color: "white" }}
            >
              <p>-</p>
              <p>-</p>
            </div>

            {/* Total Pasiva */}
            <div
              className="lpp-neraca-right-body-data"
              style={{ backgroundColor: "#b1b1b1", lineHeight: 20 + "px" }}
            >
              <p>
                <strong className="lpp-neraca-right-body-data-total">
                  TOTAL PASIVA
                </strong>
              </p>
              <p>
                <strong>
                  {pasiva.total > 0 ? numberFormat(pasiva.total) : "-"}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
