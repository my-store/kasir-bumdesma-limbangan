import React, { Component } from "react";
import {
  DeletePersediaan,
  GetPersediaan,
  GetOnePupuk,
  SearchPupuk,
  SearchObat,
  GetOneObat,
  SearchPupukSubsidi,
  GetOnePupukSubsidi,
  GetObatPertanian,
  GetNota,
  GetPupukNonSubsidi,
  GetPupukSubsidi,
} from "../api/persediaan";
import { InsertPupukSubsidi, UpdatePupukSubsidi } from "./pupuk-subsidi";
import { InsertPupuk, UpdatePupuk } from "./pupuk";
import { InsertObat, UpdateObat } from "./obat";
import "../../scss/persediaan/index.scss";
import * as request from "../api/request";
import Presentasi from "./presentasi";
import Table from "./table";

// Entry point
export default class Persediaan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tanggal: "- - -",
      persediaan: {
        semua: {
          daftar: [],
          total: 0, // Belum dipakai
        },
        pupuk: {
          daftar: [],
          total: 0,
        },
        pupukSubsidi: {
          daftar: [],
          total: 0,
        },
        obatPertanian: {
          daftar: [],
          total: 0,
        },
      },
      forms: {
        insert: {
          state: false,
          component: null,
        },
        update: {
          state: false,
          component: null,
        },
      },
      searchBox: {
        obatPertanian: false,
        pupuk: false,
        pupukSubsidi: false,
      },
      _isLoading: true,
    };
    this.__mounted__ = false;
  }

  async componentDidMount() {
    this.__mounted__ = true;

    let { tahun, bulanIni, tanggal } = this.props.workTime;

    this.__mounted__ &&
      this.setState(
        { tanggal: `${tanggal} ${bulanIni} ${tahun}` },
        async () => await this.loadData()
      );
  }

  componentWillUnmount() {
    this.__mounted__ = false;
  }

  loadData = async () => {
    // Remove all forms
    this.removeForm();

    const { workTime } = this.props;

    // Pupuk subsidi
    const _getPupukSubsidi = await GetPupukSubsidi(workTime);
    const pupukSubsidi = _getPupukSubsidi.data;
    const perolehanPupukSubsidi = _getPupukSubsidi.perolehan;
    this.__mounted__ &&
      this.setState({
        persediaan: {
          ...this.state.persediaan,
          pupukSubsidi: {
            daftar: pupukSubsidi,
            total: perolehanPupukSubsidi,
          },
        },
      });

    // Pupuk nonsubsidi
    const _getPupuk = await GetPupukNonSubsidi(workTime);
    const pupuk = _getPupuk.data;
    const perolehanPupuk = _getPupuk.perolehan;
    this.__mounted__ &&
      this.setState({
        persediaan: {
          ...this.state.persediaan,
          pupuk: {
            daftar: pupuk,
            total: perolehanPupuk,
          },
        },
      });

    // Obat pertanian
    const _getObatPertanian = await GetObatPertanian(workTime);
    const obatPertanian = _getObatPertanian.data;
    const perolehanObatPertanian = _getObatPertanian.perolehan;
    this.__mounted__ &&
      this.setState({
        persediaan: {
          ...this.state.persediaan,
          obatPertanian: {
            daftar: obatPertanian,
            total: perolehanObatPertanian,
          },
        },
      });

    // Nota
    const _getNota = await GetNota(workTime);
    const nota = _getNota.data;
    const perolehanNota = _getNota.perolehan;
    this.__mounted__ &&
      this.setState({
        persediaan: {
          ...this.state.persediaan,
          semua: {
            daftar: nota,
            total: perolehanNota,
          },
        },
      });

    this.__mounted__ && this.setState({ _isLoading: false });
  };

  removeNote = async (id) => {
    await request.post("/db/delete", { db: "Persediaan.Nota", data: { id } });
    this.loadData();
  };

  openInsertForm = ({ id }) => {
    // Insert form pupuk pupuk non-subsidi
    if (id == "Pupuk") {
      this.setState({
        forms: {
          ...this.state.forms,
          insert: {
            state: true,
            component: (
              <InsertPupuk
                reload={this.loadData}
                close={this.removeForm}
                theme={this.props.theme}
                workTime={this.props.workTime}
              />
            ),
          },
        },
      });
    }

    // Insert form pupuk pupuk subsidi
    if (id == "PupukSubsidi") {
      this.setState({
        forms: {
          ...this.state.forms,
          insert: {
            state: true,
            component: (
              <InsertPupukSubsidi
                reload={this.loadData}
                close={this.removeForm}
                theme={this.props.theme}
                workTime={this.props.workTime}
              />
            ),
          },
        },
      });
    }

    // Insert form pupuk obat pertanian
    else if (id == "Obat") {
      this.setState({
        forms: {
          ...this.state.forms,
          insert: {
            state: true,
            component: (
              <InsertObat
                reload={this.loadData}
                close={this.removeForm}
                theme={this.props.theme}
                workTime={this.props.workTime}
              />
            ),
          },
        },
      });
    }
  };

  openUpdateForm = async ({ id, data }) => {
    let _getData = null;

    // Update form pupuk non-subsidi
    if (id == "Pupuk") {
      _getData = await GetOnePupuk(data); // Fetch data
      this.setState({
        forms: {
          ...this.state.forms,
          update: {
            state: true,
            component: (
              <UpdatePupuk
                updateData={_getData}
                reload={this.loadData}
                close={this.removeForm}
                theme={this.props.theme}
                workTime={this.props.workTime}
              />
            ),
          },
        },
      });
    }

    // Update form pupuk non-subsidi
    else if (id == "PupukSubsidi") {
      _getData = await GetOnePupukSubsidi(data); // Fetch data
      this.setState({
        forms: {
          ...this.state.forms,
          update: {
            state: true,
            component: (
              <UpdatePupukSubsidi
                updateData={_getData}
                reload={this.loadData}
                close={this.removeForm}
                theme={this.props.theme}
                workTime={this.props.workTime}
              />
            ),
          },
        },
      });
    }

    // Update form obat pertanian
    else if (id == "Obat") {
      _getData = await GetOneObat(data); // Fetch data
      this.setState({
        forms: {
          ...this.state.forms,
          update: {
            state: true,
            component: (
              <UpdateObat
                updateData={_getData}
                reload={this.loadData}
                close={this.removeForm}
                theme={this.props.theme}
                workTime={this.props.workTime}
              />
            ),
          },
        },
      });
    }
  };

  removeForm = () => {
    this.setState({
      forms: {
        insert: {
          state: false,
          component: null,
        },
        update: {
          state: false,
          component: null,
        },
      },
    });
  };

  searchData = async (key, id) => {
    let data = [];
    let newState = {};

    // Obat
    if (id == "Obat") {
      if (key.length > 0) {
        data = await SearchObat(key);
      } else {
        const _getObatPertanian = await GetObatPertanian(this.props.workTime);
        data = _getObatPertanian.data;
      }
      newState = {
        ...this.state.persediaan,
        obatPertanian: {
          ...this.state.persediaan.obatPertanian,
          daftar: data,
        },
      };
    }

    // Pupuk non-subsidi
    else if (id == "Pupuk") {
      if (key.length > 0) {
        data = await SearchPupuk(key);
      } else {
        const _getPupuk = await GetPupukNonSubsidi(this.props.workTime);
        data = _getPupuk.data;
      }
      newState = {
        ...this.state.persediaan,
        pupuk: {
          ...this.state.persediaan.pupuk,
          daftar: data,
        },
      };
    }

    // Pupuk subsidi
    else if (id == "PupukSubsidi") {
      if (key.length > 0) {
        data = await SearchPupukSubsidi(key);
      } else {
        const _getPupukSubsidi = await GetPupukSubsidi(this.props.workTime);
        data = _getPupukSubsidi.data;
      }
      newState = {
        ...this.state.persediaan,
        pupukSubsidi: {
          ...this.state.persediaan.pupukSubsidi,
          daftar: data,
        },
      };
    }

    // Update state
    this.setState({ persediaan: { ...newState } });
  };

  deleteData = async ({ id, data }) => {
    await DeletePersediaan({ id, data });
    Notif.send({
      title: "Hapus " + id,
      body: "Data berhasil dihapus",
    });
    this.loadData();
  };

  openSearchBox = ({ state, id }) => {
    if (id == "Obat") {
      setTimeout(
        () => $(".persediaan .search-obat-pertanian input").focus(),
        500
      );
    }
    if (id == "Pupuk") {
      setTimeout(() => $(".persediaan .search-pupuk input").focus(), 500);
    }
    if (id == "PupukSubsidi") {
      setTimeout(
        () => $(".persediaan .search-pupuk-subsidi input").focus(),
        500
      );
    }
    this.setState({ searchBox: { ...this.state.searchBox, ...state } });
  };

  closeSearchBox = ({ id, state }) => {
    if (id == "Obat") {
      $(".persediaan .search-obat-pertanian input").val(null);
    }
    if (id == "Pupuk") {
      $(".persediaan .search-pupuk input").val(null);
    }
    if (id == "PupukSubsidi") {
      $(".persediaan .search-pupuk-subsidi input").val(null);
    }
    this.setState({ searchBox: { ...this.state.searchBox, ...state } }, () =>
      this.loadData()
    );
  };

  render() {
    const { theme, login, confirmPage } = this.props;
    const { obatPertanian, pupuk, pupukSubsidi } = this.state.persediaan;
    const DATA_PRESENTASI = { obatPertanian, pupuk, pupukSubsidi };

    return (
      <div className="persediaan">
        <div className="judul">
          <h1 style={{ color: theme }}>DAFTAR PERSEDIAAN BARANG</h1>
          <h2 style={{ color: theme }}>
            {this.props.dataToko.nama + " " + this.props.dataToko.alamat}
          </h2>
          <p>Pemantauan data s/d {this.state.tanggal}</p>
        </div>
        <div className="tabel">
          {/* Presentasi data */}
          <Presentasi
            theme={theme}
            data={DATA_PRESENTASI}
            openPrintingPage={this.openPrintingPage}
            removePrintingPage={this.removePrintingPage}
            deleteData={this.deleteData}
            _isLoading={this.state._isLoading}
            openInsertForm={this.openInsertForm}
            openUpdateForm={this.openUpdateForm}
            openSearchBox={this.openSearchBox}
            searchBox={this.state.searchBox}
            searchData={this.searchData}
            closeSearchBox={this.closeSearchBox}
            login={login}
            confirmPage={confirmPage}
          />

          {/* Seluruh data | Transaksi pembelian | Nota */}
          <div className="th" style={{ backgroundColor: theme }}>
            <p className="no">No</p>
            <p className="keterangan">Keterangan</p>
            <p className="tanggal">Tanggal</p>
            <p className="qty">Jumlah</p>
            <p className="satuan">Satuan</p>
            <p className="harga-pokok">Harga Pokok</p>
            <p className="harga-perolehan">Harga Perolehan</p>
            {login.status && <p className="aksi">Tindakan</p>}
          </div>
          <Table
            removeNote={this.removeNote}
            _isLoading={this.state._isLoading}
            persediaan={this.state.persediaan}
            login={login}
            confirmPage={confirmPage}
          />

          {/* Insert Form */}
          <div
            className={
              this.state.forms.insert.state
                ? "form-container insert-form form-container-active"
                : "form-container insert-form"
            }
          >
            {this.state.forms.insert.state
              ? this.state.forms.insert.component
              : null}
          </div>

          {/* Update Form */}
          <div
            className={
              this.state.forms.update.state
                ? "form-container update-form form-container-active"
                : "form-container update-form"
            }
          >
            {this.state.forms.update.state
              ? this.state.forms.update.component
              : null}
          </div>
        </div>
      </div>
    );
  }
}
