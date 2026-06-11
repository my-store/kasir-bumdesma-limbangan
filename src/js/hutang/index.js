import { DeleteHutang, GetHutang, GetOneHutang } from "../api/hutang";
import { FiPlus, FiTrash, FiEdit3 } from "react-icons/fi";
import { numberFormat } from "../api/helper/string";
import React, { Component } from "react";
import "../../scss/hutang/index.scss";
import Insert from "./insert";
import Update from "./update";

export default class Main extends Component {
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
      // jumlahDataBelumLunas: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { data, perolehan /*, jumlahDataBelumLunas */ } = await GetHutang(
      this.props.workTime
    );

    // Update state
    this.setState({ data, perolehan /*, jumlahDataBelumLunas */ });
  };

  openForm = (id) => {
    this.setState({ openForm: { ...this.state.openForm, ...id } }, () => {
      setTimeout(() => {
        $("#insert-hutang-form .form-group .keterangan").focus();
      }, 1000);
    });
  };

  openUpdateForm = async (id) => {
    const updateFormData = await GetOneHutang({ id });
    this.setState({
      openForm: { ...this.state.openForm, update: true },
      updateFormData,
    });
  };

  deleteData = async (id) => {
    await DeleteHutang({ id });
    Notif.send({ title: "Hapus Piutang", body: "Data berhasil dihapus" });
    this.loadData();
  };

  render() {
    const { theme, dataToko, workTime, login } = this.props;
    const { tahun, bulanIni, tanggal } = workTime;
    const { data, perolehan, openForm /*, jumlahDataBelumLunas */ } =
      this.state;

    return (
      <div className="hutang">
        <div className="judul">
          <h1 style={{ color: theme }}>DAFTAR PIUTANG</h1>
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
            <p className="status">Status</p>
            <p className="pelunasan">Dilunasi Pada</p>
            <p className="perolehan">Jumlah</p>
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
                    <p
                      className="status"
                      style={{ color: d.status == 1 ? "red" : "green" }}
                    >
                      {d.status == 1 ? "Belum Lunas" : "Lunas"}
                    </p>
                    <p className="pelunasan">
                      {d.pelunasan != "" ? d.pelunasan : "-"}
                    </p>
                    <p className="perolehan">Rp {numberFormat(d.total)}</p>
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
                            this.props.confirmPage.current.openConfirmForm(
                              () => {
                                this.deleteData(d.id);
                              },
                              "Hapus Piutang",
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
