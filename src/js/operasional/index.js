import { FiPlus, FiTrash, FiEdit3 } from "react-icons/fi";
import { numberFormat } from "../api/helper/string";
import "../../scss/operasional/index.scss";
import React, { Component } from "react";

import {
  GetOperasional,
  GetOneOperasional,
  DeleteOperasional,
} from "../api/operasional";

import Insert from "./insert";
import Update from "./update";

export default class Operasional extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openForm: {
        insert: false,
        update: false,
      },

      updateFormData: null, // Data untuk update form

      data: [],
      perolehan: 0,
      perolehanBulanIni: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { data, perolehan, perolehanBulanIni } = await GetOperasional(
      this.props.workTime,
    );

    // Update state
    this.setState({
      data,
      perolehan,
      perolehanBulanIni,
      openForm: {
        insert: false,
        update: false,
      },
      updateFormData: null, // Data untuk update form
    });
  };

  openForm = (id) => {
    this.setState({ openForm: { ...this.state.openForm, ...id } }, () => {
      setTimeout(() => {
        $("#insert-operasional-form .form-group .keterangan").focus();
      }, 1000);
    });
  };

  openUpdateForm = async (id) => {
    const updateFormData = await GetOneOperasional({ id });
    this.setState({
      openForm: { ...this.state.openForm, update: true },
      updateFormData,
    });
  };

  deleteData = async (id) => {
    await DeleteOperasional({ id });
    Notif.send({
      title: "Hapus Operasional",
      body: "Data berhasil dihapus",
    });
    this.loadData();
  };

  render() {
    const { theme, workTime, dataToko, login, confirmPage } = this.props;
    const { tahun, bulanIni, tanggal } = workTime;
    const { data, perolehan, perolehanBulanIni, openForm, updateFormData } =
      this.state;

    return (
      <div className="operasional">
        <div className="judul">
          <h1 style={{ color: theme }}>DAFTAR OPERASIONAL BULANAN</h1>
          <h2 style={{ color: theme }}>
            {dataToko.nama} {dataToko.alamat}
          </h2>
          <p>
            Pemantauan data s/d {tanggal} {bulanIni} {tahun}
          </p>
        </div>
        <div className="tabel">
          <div className="th" style={{ backgroundColor: theme }}>
            <p className="no">No</p>
            <p className="keterangan">Keterangan</p>
            <p className="tanggal">Tanggal</p>
            <p className="tipe">Tipe</p>
            <p className="jumlah">Jumlah</p>
            {login.status && <p className="aksi">Aksi</p>}
          </div>
          <div className="td">
            {data.length > 0 ? (
              data.map((d, index) => {
                const { timestamp } = d;
                return (
                  <div
                    className="tr-td"
                    key={index}
                    // Update 2026
                    // Add red mark for this mount in this year
                    style={{
                      color:
                        timestamp.tahun == workTime.tahun &&
                        timestamp.bulan == workTime.bulanIni
                          ? "#e00404"
                          : "#000",
                    }}
                  >
                    <p className="no">{index + 1}</p>
                    <p className="keterangan">{d.keterangan}</p>
                    <p className="tanggal">
                      {timestamp.hari +
                        ", " +
                        timestamp.tanggal +
                        " " +
                        timestamp.bulan +
                        " " +
                        timestamp.tahun}
                    </p>
                    <p className="tipe">{d.tipe}</p>
                    <p className="jumlah">Rp {numberFormat(d.jumlah)}</p>
                    {login.status && (
                      <p className="aksi">
                        <FiEdit3
                          onClick={() => this.openUpdateForm(d.id)}
                          width={14}
                          height={15}
                          style={{ cursor: "pointer", marginRight: 4 }}
                          title="Ubah"
                        />
                        <FiTrash
                          onClick={() => {
                            confirmPage.current.openConfirmForm(
                              () => {
                                this.deleteData(d.id);
                              },
                              "Hapus Operasional",
                              d.keterangan,
                            );
                          }}
                          width={14}
                          height={15}
                          style={{ cursor: "pointer", marginLeft: 4 }}
                          title="Hapus"
                        />
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="empty-table">Masih kosong.</p>
            )}
          </div>

          <div className="total">
            <p className="label">
              Bulan ini: Rp{" "}
              {perolehanBulanIni > 0 ? numberFormat(perolehanBulanIni) : "-"}
              {" | "}
              s/d Bulan ini: Rp {perolehan > 0 ? numberFormat(perolehan) : "-"}
            </p>
            <div
              className="action"
              onClick={() => this.openForm({ insert: true })}
            >
              <FiPlus size={15} />
              <p>Tambahkan</p>
            </div>
          </div>
        </div>

        <Insert
          theme={theme}
          reload={this.loadData}
          workTime={workTime}
          opened={openForm.insert}
          close={() => this.openForm({ insert: false })}
        />

        <Update
          theme={theme}
          reload={this.loadData}
          updateTipe={this.updateTipe}
          workTime={workTime}
          opened={openForm.update}
          updateFormData={updateFormData}
          close={() => this.openForm({ update: false })}
        />
      </div>
    );
  }
}
