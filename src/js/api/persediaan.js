import { SearchProductInsideTransaksi } from "./transaksi";
import { indexOf, reloadTime } from "./helper/calendar";
import { makeUniqueId } from "./helper/string";
import * as request from "./request";

export const GetPupukNonSubsidi = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Persediaan.Pupuk",
    options: {
      filter: {
        timestamp: {
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  let response = { data: [], perolehan: 0 };

  // Filter pupuk NON-SUBSIDI | stok > 0 (masih ada stok)
  for (let data of _getData) {
    let totalPupuk = 0;
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }

    let { id, hargaPokok, stok } = data;
    hargaPokok = parseInt(hargaPokok);
    stok = parseInt(stok);

    // Update 2025
    const matchedTrs = await SearchProductInsideTransaksi({
      keyname: "produk",
      arg: { idBarang: id },
    });
    if (matchedTrs.length > 0) {
      let trsMatchedTestAmount = 0;
      for (let trs of matchedTrs) {
        if (trs.timestamp.tahun <= workTime.tahun) {
          if (indexOf(trs.timestamp.bulan) < indexOf(workTime.bulanIni)) {
            for (let prd of trs.produk) {
              if (prd.idBarang == id) {
                trsMatchedTestAmount = prd.hargaPokok;
              }
            }
          }
        }
      }
      totalPupuk += trsMatchedTestAmount;
    }

    // Perolehan
    if (stok > 0) {
      totalPupuk += hargaPokok * stok;
      response.perolehan += totalPupuk;
    }

    // Push pupuk
    await response.data.push(data);
  }

  return response;
};

export const GetPupukSubsidi = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Persediaan.PupukSubsidi",
    options: {
      filter: {
        timestamp: {
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  let response = { data: [], perolehan: 0 };

  // Filter pupuk SUBSIDI | stok > 0 (masih ada stok)
  for (let data of _getData) {
    let totalPupukSubsidi = 0;
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }

    let { id, hargaPokok, stok } = data;

    // Update 2025
    const matchedTrs = await SearchProductInsideTransaksi({
      keyname: "produk",
      arg: { idBarang: id },
    });
    if (matchedTrs.length > 0) {
      let trsMatchedTestAmount = 0;
      for (let trs of matchedTrs) {
        if (trs.timestamp.tahun <= workTime.tahun) {
          if (indexOf(trs.timestamp.bulan) < indexOf(workTime.bulanIni)) {
            for (let prd of trs.produk) {
              if (prd.idBarang == id) {
                trsMatchedTestAmount = prd.hargaPokok;
              }
            }
          }
        }
      }
      totalPupukSubsidi += trsMatchedTestAmount;
    }

    // Perolehan
    if (stok > 0) {
      totalPupukSubsidi += hargaPokok * stok;
      response.perolehan += totalPupukSubsidi;
    }

    // Push pupuk
    await response.data.push(data);
  }

  return response;
};

export const GetObatPertanian = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Persediaan.ObatPertanian",
    options: {
      filter: {
        timestamp: {
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  let response = { data: [], perolehan: 0 };

  // Filter obat pertanian | stok > 0 (masih ada stok)
  for (let data of _getData) {
    let totalObat = 0;
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }

    let { id, hargaPokok, stok } = data;

    // Update 2025
    const matchedTrs = await SearchProductInsideTransaksi({
      keyname: "produk",
      arg: { idBarang: id },
    });
    if (matchedTrs.length > 0) {
      let trsMatchedTestAmount = 0;
      for (let trs of matchedTrs) {
        if (trs.timestamp.tahun <= workTime.tahun) {
          if (indexOf(trs.timestamp.bulan) < indexOf(workTime.bulanIni)) {
            for (let prd of trs.produk) {
              if (prd.idBarang == id) {
                trsMatchedTestAmount = prd.hargaPokok;
              }
            }
          }
        }
      }
      totalObat += trsMatchedTestAmount;
    }

    // Perolehan
    if (stok > 0) {
      totalObat += hargaPokok * stok;
      response.perolehan += totalObat;
    }

    // Push obat pertanian
    await response.data.push(data);
  }

  return response;
};

// Hanya di akses oleh halaman persediaan
export const GetNota = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Persediaan.Nota",
    options: {
      filter: {
        timestamp: {
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  let response = { data: [] };

  // Nota
  for (let data of _getData) {
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }
    await response.data.push(data);
  }

  return response;
};

export const GetPersediaan = async (workTime) => {
  // Get data from database
  const getData = {};

  /*
  | Jika stok dari sebuah produk berkurang, maka nilai persediaan pun ikut berkurang
  | namun akan menambah nilai Kas.
  |
  | Penghitungan:
  |   Semua produk dengan stok > 0
  |     Persediaan += Harga Pokok * Stok
  |
  */
  let responseData = {
    obatPertanian: [],
    pupuk: [],
    pupukSubsidi: [],
    perolehan: {
      semua: 0,
      obatPertanian: 0,
      pupuk: 0,
      pupukSubsidi: 0,
    },
  };

  // ... Pupuk subsidi | Update 2025
  const _getObatPertanian = await GetObatPertanian(workTime);
  responseData.obatPertanian = _getObatPertanian.data;
  responseData.perolehan.obatPertanian = _getObatPertanian.perolehan;

  // ... Pupuk nonsubsidi | Update 2025
  const _getPupukSubsidi = await GetPupukSubsidi(workTime);
  responseData.pupukSubsidi = _getPupukSubsidi.data;
  responseData.perolehan.pupukSubsidi = _getPupukSubsidi.perolehan;

  // ... Obat pertanian | Update 2025
  const _getPupuk = await GetPupukNonSubsidi(workTime);
  responseData.pupuk = _getPupuk.data;
  responseData.perolehan.pupuk = _getPupuk.perolehan;

  // Semua perolehan
  responseData.perolehan.semua += responseData.perolehan.pupukSubsidi;
  responseData.perolehan.semua += responseData.perolehan.pupuk;
  responseData.perolehan.semua += responseData.perolehan.obatPertanian;

  // Response data
  return responseData;
};

export const InsertPersediaan = async ({ id, data }) => {
  let _DB = null;
  if (id == "Obat") {
    _DB = "Persediaan.ObatPertanian";
  } else if (id == "Pupuk") {
    _DB = "Persediaan.Pupuk";
  } else if (id == "PupukSubsidi") {
    _DB = "Persediaan.PupukSubsidi";
  }

  // Simpan nota
  await InsertNota(data);

  // Simpan data, update 2025
  await request.post("/db/insert", { db: _DB, data });
};

export const UpdatePersediaan = async ({ id, data }) => {
  let _DB = null;
  let _checkData = null;

  // Pupuk
  if (id == "Pupuk") {
    // Ambil data untuk penambahan stok (sebelum diupdate) dibawah
    // Update 2025
    _checkData = await request.post("/db/getone", {
      db: "Persediaan.Pupuk",
      options: { id: data.id },
    });

    // Update data
    // Update 2025
    _DB = await request.post("/db/update", { db: "Persediaan.Pupuk", data });
  }

  // Pupuk subsidi
  if (id == "PupukSubsidi") {
    // Ambil data untuk penambahan stok (sebelum diupdate) dibawah
    // Update 2025
    _checkData = await request.post("/db/getone", {
      db: "Persediaan.PupukSubsidi",
      options: { id: data.id },
    });

    // Update data
    // Update 2025
    _DB = await request.post("/db/update", {
      db: "Persediaan.PupukSubsidi",
      data,
    });
  }

  // Obat
  else if (id == "Obat") {
    // Ambil data untuk penambahan stok (sebelum diupdate) dibawah
    // Update 2025
    _checkData = await request.post("/db/getone", {
      db: "Persediaan.ObatPertanian",
      options: { id: data.id },
    });

    // Update data
    // Update 2025
    _DB = await request.post("/db/update", {
      db: "Persediaan.ObatPertanian",
      data,
    });
  }

  // Penambahan stok (jika ada)
  if (parseInt(data.stok) > parseInt(_checkData.stok)) {
    const timestamp = await reloadTime();
    const _noteData = Object.assign({}, data, {
      id: makeUniqueId(30),

      // Khusus penambahan stok, timestamp harus waktu saat data di inputkan
      timestamp: {
        hari: timestamp.hari,
        tanggal: timestamp.tanggal,
        bulan: timestamp.bulan,
        tahun: timestamp.tahun,
      },

      // Stok baru = stok baru - stok lama
      stok: parseInt(data.stok) - parseInt(_checkData.stok),
    });

    // Insert nota
    await InsertNota(_noteData);
  }

  return _DB;
};

export const DeletePersediaan = async ({ id, data }) => {
  // Pupuk non-subsidi
  if (id == "Pupuk") {
    // Update 2025
    await request.post("/db/delete", { db: "Persediaan.Pupuk", data });
  }

  // Pupuk subsidi
  else if (id == "PupukSubsidi") {
    // Update 2025
    await request.post("/db/delete", {
      db: "Persediaan.PupukSubsidi",
      data,
    });
  }

  // Obat pertanian
  else if (id == "Obat") {
    // Update 2025
    await request.post("/db/delete", {
      db: "Persediaan.ObatPertanian",
      data,
    });
  }
};

export const SearchObat = async (key) => {
  // Update 2025
  const responseData = await request.post("/db/get", {
    db: "Persediaan.ObatPertanian",
    options: {
      filter: {
        namaBarang: {
          $contain: key,
        },
      },
    },
  });
  return responseData;
};

export const SearchPupuk = async (key) => {
  // Update 2025
  const responseData = await request.post("/db/get", {
    db: "Persediaan.Pupuk",
    options: {
      filter: {
        namaBarang: {
          $contain: key,
        },
      },
    },
  });
  return responseData;
};

export const SearchPupukSubsidi = async (key) => {
  // Update 2025
  const responseData = await request.post("/db/get", {
    db: "Persediaan.PupukSubsidi",
    options: {
      filter: {
        namaBarang: {
          $contain: key,
        },
      },
    },
  });
  return responseData;
};

export const GetOneObat = async (options) =>
  await request.post("/db/getone", {
    db: "Persediaan.ObatPertanian",
    options,
  });

export const GetOnePupuk = async (options) =>
  await request.post("/db/getone", {
    db: "Persediaan.Pupuk",
    options,
  });

// Update 2025 (NEW FEATURE)
export const GetOnePupukSubsidi = async (options) =>
  await request.post("/db/getone", {
    db: "Persediaan.PupukSubsidi",
    options,
  });

// Nota pembelian barang
async function InsertNota(data) {
  await request.post("/db/insert", {
    db: "Persediaan.Nota",
    data: {
      keterangan: `Pembelian ${data.namaBarang}`,
      id: data.id,
      qty: data.stok,
      satuan: data.satuan,
      timestamp: data.timestamp,
      hargaJual: data.hargaJual,
      hargaPokok: data.hargaPokok,
      hargaPerolehan: data.hargaPokok * data.stok,
    },
  });
}
