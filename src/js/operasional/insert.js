import { upperCase, numberFormat } from "../api/helper/string";
import { InsertOperasional } from "../api/operasional";
import "../../scss/operasional/form.scss";
import { FiEdit3 } from "react-icons/fi";
import React, { Component } from "react";
import { CekModal } from "../api/neraca";

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

    // Keterangan
    const keterangan = await upperCase(
      $("#insert-operasional-form .keterangan").val()
    );

    // Tipe biaya (gaji, listrik dll)
    const tipe = $("#insert-operasional-form .tipe-operasional").val();

    // Jumlah/ Total biaya
    const jumlah = $("#insert-operasional-form .jumlah")
      .val()
      .replace(/\,/gi, "");

    const { workTime, reload } = this.props;

    // Validasi
    if (keterangan != "" && jumlah != "") {
      const { hari, tanggal, bulanIni, tahun } = workTime;
      const timestamp = {
        hari,
        tanggal,
        bulan: bulanIni,
        tahun,
      };

      // Hentikan jika tiper operasional tidak di set
      if (tipe == null || tipe == "") {
        return Notif.send({
          title: "Input Operasional",
          body: "Silahkan pilih tipe operasional",
        });
      }

      // Prepare data
      const data = { keterangan, jumlah: parseInt(jumlah), tipe, timestamp };

      // Update 2025
      // Cek modal/ kas
      const cekModal = await CekModal(workTime, {
        a: data.jumlah,

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
        Notif.send({ title: "Input Operasional", body: modalMsg });

        // Update 2025
        // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
        this.insertWait = false;

        return;
      }

      // Reset form (setelah data form diambil)
      await this.removeForm();

      // Insert data
      await InsertOperasional(data);

      // Success message
      Notif.send({
        title: "Input Operasional",
        body: "Data baru ditambahkan",
      });

      // Reload data
      await reload();
    }

    // Failed message
    else {
      this.errorHighlight();
      Notif.send({
        title: "Input Operasional",
        body: "Mohon isi seluruh data",
      });
    }

    // Update 2025
    // Non-aktifkan kembali sistem pemblokiran input ganda sementara.
    this.insertWait = false;
  };

  errorHighlight = () => {
    // Keterangan
    const keteranganInput = $(
      "#insert-operasional-form .form-group .keterangan"
    );
    if (keteranganInput.val().length < 1)
      keteranganInput.css("border", "1px solid red");
    // Jumlah
    const jumlahInput = $("#insert-operasional-form .form-group .jumlah");
    if (jumlahInput.val().length < 1)
      jumlahInput.css("border", "1px solid red");
    // Reset border color
    setTimeout(() => {
      // Keterangan
      keteranganInput.css("border", "1px solid grey");
      // Jumlah
      jumlahInput.css("border", "1px solid grey");
    }, 1000);
  };

  reformatNumber = async (getVal, target) => {
    let newVal = await numberFormat(getVal.replace(/\,/gi, ""));
    $("#insert-operasional-form ." + target).val(newVal);
  };

  removeForm = () => {
    $("#insert-operasional-form")[0].reset();
    this.props.close();
  };

  getTipeOperasional = () => {
    const tipe = [
      { class: "honor", text: "Honor" },
      { class: "transport", text: "Transport" },
      { class: "lainnya", text: "Lainnya" },
    ];

    return (
      <div className="operasional-list">
        {tipe.map((data, index) => {
          return (
            <div
              key={index}
              className="operasional-item"
              onClick={() => {
                $("#insert-operasional-form ." + tipe[index].class).prop(
                  "checked",
                  true
                );
                $("#insert-operasional-form .tipe-operasional").val(
                  tipe[index].text
                );
              }}
            >
              <input
                type="radio"
                name="operasional-item"
                onChange={() => null}
                className={data.class}
              />
              <p>{data.text}</p>
            </div>
          );
        })}
      </div>
    );
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
        <form id="insert-operasional-form" onSubmit={(e) => e.preventDefault()}>
          <input type="hidden" className="tipe-operasional" />

          <h1
            className="form-title"
            style={{ backgroundColor: this.props.theme }}
          >
            <span>OPERASIONAL</span>
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
              className="jumlah"
              onChange={({ target: { value } }) =>
                this.reformatNumber(value, "jumlah")
              }
            />
          </div>
          <div className="form-group">
            <label>Tipe Operasional</label>
            {this.getTipeOperasional()}
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
