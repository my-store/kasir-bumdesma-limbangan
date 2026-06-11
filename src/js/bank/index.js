import { numberFormat } from "../api/helper/string";
import { GetBank, DeleteBank } from "../api/bank";
import React, { Component } from "react";
import { FiTrash } from "react-icons/fi";
import "../../scss/bank/index.scss";
import SetorBank from "./setor";
import TarikBank from "./tarik";

export default class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openForm: {
        setor: false,
        tarik: false,
      },

      data: [],
      perolehan: 0,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { data, perolehan } = await GetBank(this.props.workTime);
    this.setState({ data, perolehan });
  };

  openForm = (id) =>
    this.setState({ openForm: { ...this.state.openForm, ...id } });

  deleteData = async (id) => {
    await DeleteBank({ id });
    Notif.send({
      title: "Hapus Catatan Setor Bank",
      body: "Data berhasil dihapus",
    });
    this.loadData();
  };

  render() {
    const { data, perolehan, openForm } = this.state;
    const { dataToko, theme, workTime, login } = this.props;
    const { tahun, bulanIni, tanggal } = workTime;

    return (
      <div className="bank">
        <div className="judul">
          <h1 style={{ color: theme }}>DAFTAR TARIK / SETOR BANK</h1>
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
                  <div
                    className="tr-td"
                    key={dx}
                    style={{
                      color: d.tipe == "SetorBank" ? "black" : "red",
                    }}
                  >
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
                        <FiTrash
                          onClick={() => {
                            this.props.confirmPage.current.openConfirmForm(
                              () => {
                                this.deleteData(d.id);
                              },
                              "Hapus Transaksi Bank",
                              d.keterangan
                            );
                          }}
                          width={14}
                          height={15}
                          style={{ cursor: "pointer", alignSelf: "flex-end" }}
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
                onClick={() => {
                  setTimeout(
                    () => $("#tarik-bank-form .form-group .keterangan").focus(),
                    1000
                  );
                  this.openForm({ tarik: true });
                }}
              >
                <p>Tarik</p>
              </div>
              <div
                onClick={() => {
                  setTimeout(
                    () => $("#setor-bank-form .form-group .keterangan").focus(),
                    1000
                  );
                  this.openForm({ setor: true });
                }}
              >
                <p>Setor</p>
              </div>
            </div>
          </div>
        </div>

        <SetorBank
          theme={theme}
          reload={this.loadData}
          workTime={workTime}
          opened={openForm.setor}
          close={() => this.openForm({ setor: false })}
        />

        <TarikBank
          theme={theme}
          perolehan={perolehan}
          reload={this.loadData}
          workTime={workTime}
          opened={openForm.tarik}
          close={() => this.openForm({ tarik: false })}
        />
      </div>
    );
  }
}
