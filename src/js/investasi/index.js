import { FiPlus, FiTrash, FiEdit3 } from "react-icons/fi";
import { numberFormat } from "../api/helper/string";
import React, { Component } from "react";
import "../../scss/investasi/index.scss";
import InsertModal from "./insert";
import UpdateModal from "./update";
import {
  GetInvestasi,
  GetOneInvestasi,
  DeleteInvestasi,
} from "../api/investasi";

export default class Investasi extends Component {
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
    const { data, perolehan } = await GetInvestasi(this.props.workTime);
    this.setState({ data, perolehan });
  };

  openForm = (id) => {
    this.setState({ openForm: { ...this.state.openForm, ...id } }, () => {
      setTimeout(() => {
        $("#insert-modal-form .form-group .keterangan").focus();
      }, 1000);
    });
  };

  openUpdateForm = async (id) => {
    const updateFormData = await GetOneInvestasi({ id });
    this.setState({
      openForm: { ...this.state.openForm, update: true },
      updateFormData,
    });
  };

  deleteData = async (id) => {
    await DeleteInvestasi({ id });
    Notif.send({
      title: "Hapus Modal",
      body: "Data berhasil dihapus",
    });
    this.loadData();
  };

  render() {
    const { theme, dataToko, workTime, login, confirmPage } = this.props;
    const { tahun, bulanIni, tanggal } = workTime;
    const { data, perolehan, openForm } = this.state;

    return (
      <div className="investasi">
        <div className="judul">
          <h1 style={{ color: theme }}>DAFTAR PINJAMAN MODAL TOKO</h1>
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
            <p className="nominal">Nominal</p>
            {login.status && <p className="aksi">Tindakan</p>}
          </div>
          <div className="td">
            {data.length > 0 ? (
              data.map((d, dx) => {
                return (
                  <div className="tr-td" key={dx}>
                    <p className="no">{dx + 1}</p>
                    <p className="keterangan">{d.keterangan}</p>
                    <p className="tanggal">
                      {d.timestamp.hari +
                        ", " +
                        d.timestamp.tanggal +
                        " " +
                        d.timestamp.bulan +
                        " " +
                        d.timestamp.tahun}
                    </p>
                    <p className="nominal">Rp {numberFormat(d.nominal)}</p>
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
                              "Hapus Modal",
                              d.keterangan
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
            <div className="action">
              <div
                className="insert"
                onClick={() => this.openForm({ insert: true })}
              >
                <FiPlus size={15} />
                <p>Tambahkan</p>
              </div>
            </div>
          </div>
        </div>

        <InsertModal
          theme={theme}
          reload={this.loadData}
          workTime={workTime}
          opened={openForm.insert}
          close={() => this.openForm({ insert: false })}
        />
        <UpdateModal
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
