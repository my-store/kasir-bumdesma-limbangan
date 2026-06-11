import { numberFormat, upperCase } from "../api/helper/string";
import { CekModal } from "../api/neraca";
import React, { Component } from "react";
import { InsertBank } from "../api/bank";
import { FiEdit3 } from "react-icons/fi";
import "../../scss/bank/form.scss";

export default class Setor extends Component {
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

    const keteranganInput = $("#setor-bank-form .keterangan");
    const keterangan = keteranganInput.val();

    const nominalInput = $("#setor-bank-form .nominal");
    const nominal = nominalInput.val().replace(/\,/gi, "");

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
      const data = {
        tipe: "SetorBank",
        nominal: parseInt(nominal),
        timestamp,
        keterangan: upperCase(keterangan),
      };

      // Update 2025
      // Cek modal/ kas
      const cekModal = await CekModal(workTime, {
        a: data.nominal,

        // Hanya mengelabuhi perkalian pada variable 'result' di CekModal
        // Karna nilai a akan dikalikan dengan nilai b,
        // CekModal dibuat karna kebutuhan pengecekan modal sebelum menginput data persediaan.
        b: 1,
      });
      if (cekModal.status == false) {
        this.errorHighlight();
        let modalMsg = "Jumlah uang kas kurang";
        if (cekModal.kurangan > 0) {
          modalMsg += ` Rp ${numberFormat(Math.abs(cekModal.kurangan))}`;
        }
        Notif.send({ title: "Setor Bank", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.insertWait = false;

        return;
      }

      // Reset form (HARUS setelah data form diambil)
      await this.removeForm();

      // Insert data
      await InsertBank(data);

      // Success message
      Notif.send({ title: "Setor Bank", body: "Data berhasil ditambahkan" });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({ title: "Setor Bank", body: "Mohon isi seluruh data" });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  errorHighlight = () => {
    // Apply border style
    const keteranganInput = $("#setor-bank-form .keterangan");
    if (keteranganInput.val().length < 1) {
      keteranganInput.css("border", "1px solid red");
    }

    // Apply border style
    const nominalInput = $("#setor-bank-form .nominal");
    if (nominalInput.val().length < 1) {
      nominalInput.css("border", "1px solid red");
    }

    // Reset border style
    setTimeout(() => {
      keteranganInput.css("border", "1px solid grey");
      nominalInput.css("border", "1px solid grey");
    }, 1000);
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#setor-bank-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#setor-bank-form")[0].reset();
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
        <form id="setor-bank-form" onSubmit={(e) => e.preventDefault()}>
          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>SETOR BANK</span>
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
