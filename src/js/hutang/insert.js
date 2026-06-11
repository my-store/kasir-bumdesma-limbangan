import { upperCase, numberFormat } from "../api/helper/string";
import { InsertHutang } from "../api/hutang";
import React, { Component } from "react";
import { CekModal } from "../api/neraca";
import { FiEdit3 } from "react-icons/fi";
import "../../scss/hutang/form.scss";

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

    const keterangan = await upperCase(
      $("#insert-hutang-form .keterangan").val()
    );
    const total = parseInt(
      $("#insert-hutang-form .total").val().replace(/\,/gi, "")
    );

    const { workTime, reload } = this.props;

    // Validasi
    if (keterangan != "" && total != "") {
      const { hari, tanggal, bulanIni, tahun } = workTime;
      const timestamp = {
        hari,
        tanggal,
        bulan: bulanIni,
        tahun,
      };

      let data = {
        keterangan,
        total: parseInt(total),
        status: 1, // Status 1 = "Belum lunas"
        timestamp,
        pelunasan: "",
      };

      // Cek modal/ kas
      const cekModal = await CekModal(workTime, {
        a: total,

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
        Notif.send({ title: "Input Piutang", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.insertWait = false;

        return;
      }

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Insert data
      await InsertHutang(data);

      // Success message
      Notif.send({
        title: "Input Piutang",
        body: "Data baru ditambahkan",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Input Piutang",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  errorHighlight = () => {
    // Keterangan
    const keteranganInput = $("#insert-hutang-form .form-group .keterangan");
    if (keteranganInput.val().length < 1) {
      keteranganInput.css("border", "1px solid red");
    }

    // Total
    const totalInput = $("#insert-hutang-form .form-group .total");
    if (totalInput.val().length < 1) {
      totalInput.css("border", "1px solid red");
    }

    // Reset border color
    setTimeout(() => {
      // Keterangan
      keteranganInput.css("border", "1px solid grey");
      // Total
      totalInput.css("border", "1px solid grey");
    }, 1000);
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#insert-hutang-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#insert-hutang-form")[0].reset();
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
        <form id="insert-hutang-form" onSubmit={(e) => e.preventDefault()}>
          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>PIUTANG</span>
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
              type="text"
              className="total"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "total")
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
