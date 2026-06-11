import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetHutang = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Hutang",
    options: {
      filter: {
        timestamp: {
          // Ambil data dari tahun ini (workTime) kebawah
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  // Prepare default response data
  let response = { data: [], perolehan: 0, jumlahDataBelumLunas: 0 };

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

    // Push data, sekalipun sudah lunas, tetap ditampilkan
    await response.data.push(data);

    // Belum lunas
    if (data.status == 1) {
      // Increase perolehan
      response.perolehan += parseInt(data.total);

      // Increase belum lunas
      response.jumlahDataBelumLunas += 1;
    }
  }

  // Return the response
  return response;
};

// Insert data
export const InsertHutang = async (data) =>
  await request.post("/db/insert", { db: "Hutang", data });

// Delete data
export const DeleteHutang = async (data) =>
  await request.post("/db/delete", { db: "Hutang", data });

// Update data
export const UpdateHutang = async (data) =>
  await request.post("/db/update", { db: "Hutang", data });

// Get one data
export const GetOneHutang = async (options) =>
  await request.post("/db/getone", {
    db: "Hutang",
    options,
  });
