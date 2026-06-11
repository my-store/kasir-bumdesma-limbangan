import { FiPlus, FiTrash, FiEdit3 } from "react-icons/fi";
import { numberFormat } from "../api/helper/string";
import "../../scss/inventaris/index.scss";
import React, { Component } from "react";
import Insert from "./insert";
import Update from "./update";
import {
  GetInventaris,
  DeleteInventaris,
  GetOneInventaris,
} from "../api/inventaris";

export default class Inventaris extends Component {
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
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { data, perolehan } = await GetInventaris(this.props.workTime);
    this.setState({ data, perolehan });
  };

  openForm = (id) => {
    this.setState({ openForm: { ...this.state.openForm, ...id } }, () => {
      setTimeout(() => {
        $("#insert-inventaris-form .form-group .jenis").focus();
      }, 1000);
    });
  };

  openUpdateForm = async (id) => {
    const updateFormData = await GetOneInventaris({ id });
    this.setState({
      openForm: { ...this.state.openForm, update: true },
      updateFormData,
    });
  };

  deleteData = async (id) => {
    await DeleteInventaris({ id });
    Notif.send({
      title: "Hapus Inventaris",
      body: "Data berhasil dihapus",
    });
    this.loadData();
  };

  render() {
    const { data, perolehan, openForm } = this.state;
    const { dataToko, theme, workTime, login, confirmPage } = this.props;
    const { tahun, bulanIni, tanggal } = workTime;

    return (
      <div className="inventaris">
        <div className="judul">
          <h1 style={{ color: theme }}>DAFTAR INVENTARIS</h1>
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
            <p className="jenis">Jenis Inventaris</p>
            <p className="tanggal">Tanggal</p>
            <p className="unit">Unit</p>
            <p className="harga-satuan">Harga Satuan</p>
            <p className="harga-perolehan">Harga Perolehan</p>
            {login.status && <p className="aksi">Tindakan</p>}
          </div>
          <div className="td">
            {data.length > 0 ? (
              data.map((d, dx) => {
                return (
                  <div className="tr-td" key={dx}>
                    <p className="no">{dx + 1}</p>
                    <p className="jenis">{d.jenis}</p>
                    <p className="tanggal">
                      {d.timestamp.hari +
                        ", " +
                        d.timestamp.tanggal +
                        " " +
                        d.timestamp.bulan +
                        " " +
                        d.timestamp.tahun}
                    </p>
                    <p className="unit">{numberFormat(d.unit)}</p>
                    <p className="harga-satuan">
                      Rp {numberFormat(d.hargaSatuan)}
                    </p>
                    <p className="harga-perolehan">
                      Rp {numberFormat(d.hargaPerolehan)}
                    </p>
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
                              "Hapus Inventaris",
                              d.jenis
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
              Rp {perolehan > 0 ? numberFormat(perolehan) : "-"}
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
          workTime={workTime}
          opened={openForm.update}
          updateFormData={this.state.updateFormData}
          close={() => this.openForm({ update: false })}
        />
      </div>
    );
  }
}
