import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetInventaris = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Inventaris",
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
  let response = { data: [], perolehan: 0 };

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

    // Push data
    await response.data.push(data);

    // Icrease perolehan
    response.perolehan += parseInt(data.hargaPerolehan);
  }

  return response;
};

// Insert data
export const InsertInventaris = async (data) =>
  await request.post("/db/insert", { db: "Inventaris", data });

// Delete data
export const DeleteInventaris = async (data) =>
  await request.post("/db/delete", { db: "Inventaris", data });

// Update data
export const UpdateInventaris = async (data) =>
  await request.post("/db/update", { db: "Inventaris", data });

// Get one data
export const GetOneInventaris = async (options) =>
  await request.post("/db/getone", {
    db: "Inventaris",
    options,
  });
