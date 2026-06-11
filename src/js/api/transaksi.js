import * as request from "./request";

export const GetDayTransaction = async (workTime) => {
  const data = await request.post("/db/get", {
    db: "Transaksi",
    options: {
      filter: {
        timestamp: {
          tahun: workTime.tahun,
          bulan: workTime.bulanIni,
          tanggal: workTime.tanggal,
        },
      },
      order: "DESC",
    },
  });

  // List
  let transaksi = [];

  // Omset harian
  let omset = {
    semua: 0,
    pupuk: 0,
    pupukSubsidi: 0,
    obatPertanian: 0,
  };

  // Margin harian
  let margin = {
    semua: 0,
    pupuk: 0,
    pupukSubsidi: 0,
    obatPertanian: 0,
  };

  if (data.length > 0) {
    for (let x = 0; x < data.length; x++) {
      let _trs = data[x];

      // Ambil daftar produk dalam 1 transaksi & biaya operasional
      let { produk, operasional } = _trs;

      // Biaya tambahan dibagi jumlah produk dalam 1 transaksi
      const _ops = parseInt(operasional.biaya) / produk.length;

      for (let z = 0; z < produk.length; z++) {
        // Obat | Pupuk
        const { tipeProduk, hargaJual, hargaPokok, beli } = produk[z];

        // Obat
        if (tipeProduk == "Obat") {
          // Increase omset | Obat pertanian
          omset.obatPertanian += parseInt(hargaJual) * parseInt(beli);

          // Increase margin | Obat pertanian
          margin.obatPertanian +=
            (parseInt(hargaJual) - parseInt(hargaPokok)) * parseInt(beli);

          // Tambahkan biaya tambahan untuk omset (obat)
          omset.obatPertanian += _ops;

          // Tambahkan biaya tambahan untuk margin (pupuk)
          margin.obatPertanian += _ops;
        }

        // Pupuk
        else if (tipeProduk == "Pupuk") {
          // Increase omset | Pupuk
          omset.pupuk += parseInt(hargaJual) * parseInt(beli);

          // Increase margin | Pupuk
          margin.pupuk +=
            (parseInt(hargaJual) - parseInt(hargaPokok)) * parseInt(beli);

          // Tambahkan biaya tambahan untuk omset (pupuk)
          omset.pupuk += _ops;

          // Tambahkan biaya tambahan untuk margin (pupuk)
          margin.pupuk += _ops;
        }

        // Pupuk subsidi
        else if (tipeProduk == "PupukSubsidi") {
          // Increase omset | Pupuk
          omset.pupukSubsidi += parseInt(hargaJual) * parseInt(beli);

          // Increase margin | Pupuk
          margin.pupukSubsidi +=
            (parseInt(hargaJual) - parseInt(hargaPokok)) * parseInt(beli);

          // Tambahkan biaya tambahan untuk omset (pupuk)
          omset.pupukSubsidi += _ops;

          // Tambahkan biaya tambahan untuk margin (pupuk)
          margin.pupukSubsidi += _ops;
        }
      }

      transaksi.push(_trs);
    }
  }

  // Total omset
  omset.semua = omset.obatPertanian + omset.pupuk + omset.pupukSubsidi;

  // Total margin
  margin.semua = margin.obatPertanian + margin.pupuk + margin.pupukSubsidi;

  // Return data as object
  return { transaksi, omset, margin };
};

// Getall Transaksi
export const GetAllTransaksi = async () =>
  await request.post("/db/get", { db: "Transaksi" });

// Getwhere Transaksi
export const GetWhereTransaksi = async (options) =>
  await request.post("/db/get", { db: "Transaksi", options });

// Search Product inside Transaksi
export const SearchProductInsideTransaksi = async ({ keyname, arg }) =>
  await request.post("/db/get/search-object-inside-array", {
    db: "Transaksi",
    keyname,
    arg,
  });

// Getone Transaksi
export const GetoneTransaksi = async (options) =>
  await request.post("/db/getone", { db: "Transaksi", options });

// Insert Transaksi
export const InsertTransaksi = async (data) =>
  await request.post("/db/insert", { db: "Transaksi", data });

// Delete Transaksi
export const DeleteTransaksi = async (data) =>
  await request.post("/db/delete", { db: "Transaksi", data });
