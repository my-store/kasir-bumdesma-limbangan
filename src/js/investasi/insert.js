import { upperCase, numberFormat } from "../api/helper/string";
import { InsertInvestasi } from "../api/investasi";
import React, { Component } from "react";
import { FiEdit3 } from "react-icons/fi";
import "../../scss/investasi/form.scss";

export default class Insert extends Component {
  constructor(props) {
    super(props);

    // Update 2025 - Sistem pemblokiran input ganda
    this.insertWait = false;
  }

  saveData = async () => {
    // Update 2025 - Sistem pemblokiran input ganda
    // Blokir jika user melakukan klik berkali-kali
    // pada tombol simpan saat input atau ubah data.
    if (this.insertWait) return;
    // Aktifkan pemblokiran sementara, jika sudah ter-input
    // makan pemblokiran akan di non-aktifkan kembali.
    this.insertWait = true;

    const nominal = $("#insert-modal-form .nominal").val().replace(/\,/gi, "");
    const keterangan = await upperCase(
      $("#insert-modal-form .keterangan").val()
    );

    const { workTime, reload } = this.props;

    if (nominal != "" && keterangan != "") {
      const { hari, tanggal, bulanIni, tahun } = workTime;
      const timestamp = {
        hari,
        tanggal,
        bulan: bulanIni,
        tahun,
      };

      // Prepare data
      const data = { nominal: parseInt(nominal), timestamp, keterangan };

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Insert data
      await InsertInvestasi(data);

      // Success message
      Notif.send({
        title: "Input Modal",
        body: "Data berhasil ditambahkan",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Input Modal",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  errorHighlight = () => {
    // Keterangan
    const keteranganInput = $("#insert-modal-form .form-group .keterangan");
    if (keteranganInput.val().length < 1)
      keteranganInput.css("border", "1px solid red");
    // Nominal
    const nominalInput = $("#insert-modal-form .form-group .nominal");
    if (nominalInput.val().length < 1)
      nominalInput.css("border", "1px solid red");
    // Reset border color
    setTimeout(() => {
      // Keterangan
      keteranganInput.css("border", "1px solid grey");
      // Nominal
      nominalInput.css("border", "1px solid grey");
    }, 1000);
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#insert-modal-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#insert-modal-form")[0].reset();
    this.props.close();
  };

  render() {
    return (
      <div
        className={
          this.props.opened
            ? "form-container form-container-active"
            : "form-container"
        }
      >
        <form id="insert-modal-form" onSubmit={(e) => e.preventDefault()}>
          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>MODAL</span>
            <span className="form-title-indicator">
              <FiEdit3 size={15} style={{ marginRight: 3 }} />
              Input data
            </span>
          </h1>
          <div className="form-group">
            <label>Keterangan</label>
            <textarea className="keterangan"></textarea>
          </div>
          <div className="form-group">
            <label>Nominal</label>
            <input
              className="nominal"
              type="text"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "nominal")
              }
            />
          </div>
          <div className="form-group form-btns">
            <button className="save-btn" type="button" onClick={this.saveData}>
              Simpan
            </button>
            <div className="spacer"></div>
            <button
              className="cancel-btn"
              type="button"
              onClick={this.removeForm}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    );
  }
}
