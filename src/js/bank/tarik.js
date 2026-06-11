import { numberFormat, upperCase } from "../api/helper/string";
import React, { Component } from "react";
import { InsertBank } from "../api/bank";
import { FiEdit3 } from "react-icons/fi";
import "../../scss/bank/form.scss";

export default class Tarik extends Component {
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

    const keteranganInput = $("#tarik-bank-form .keterangan");
    const keterangan = keteranganInput.val();

    const nominalInput = $("#tarik-bank-form .nominal");
    const nominal = nominalInput.val().replace(/\,/gi, "");

    const { perolehan, workTime, reload } = this.props;

    if (nominal != "" && keterangan != "") {
      const { hari, tanggal, bulanIni, tahun } = workTime;
      const timestamp = {
        hari,
        tanggal,
        bulan: bulanIni,
        tahun,
      };

      // Prepare data
      const data = {
        nominal: parseInt(nominal),
        tipe: "TarikTunai",
        timestamp,
        keterangan: upperCase(keterangan),
      };

      // Jumalh uang di bank tidak cukup
      if (perolehan < data.nominal) {
        this.errorHighlight();
        let modalMsg = "Jumlah uang kas kurang";
        if (cekModal.kurangan > 0) {
          modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
        }
        Notif.send({ title: "Tarik Bank", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.insertWait = false;

        return;
      }

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Insert data
      await InsertBank(data);

      // Success message
      Notif.send({ title: "Tarik Tunai", body: "Data berhasil ditambahkan" });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({ title: "Tarik Tunai", body: "Mohon isi seluruh data" });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  errorHighlight = () => {
    const nominalInput = $("#tarik-bank-form .nominal");
    if (nominalInput.val().length < 1) {
      nominalInput.css("border", "1px solid red");
    }
    setTimeout(() => nominalInput.css("border", "1px solid grey"), 1000);
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#tarik-bank-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#tarik-bank-form")[0].reset();
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
        <form id="tarik-bank-form" onSubmit={(e) => e.preventDefault()}>
          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>TARIK TUNAI</span>
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
