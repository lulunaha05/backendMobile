const Pool = require("pg").Pool;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: "xodcpesnvrotee",
  host: "ec2-174-129-253-113.compute-1.amazonaws.com",
  database: "d86k5scvbco33e",
  password: "a65b2119c250578af373aa13eea77115aadcdb0c095a462b56b781e07dc216ed",
  port: 5432,
  ssl: true
});

// backend
const panti = (request, response) => {
  pool.query(
    "SELECT * FROM tbl_panti INNER JOIN tbl_gambar ON tbl_panti.gambar_id= tbl_gambar.gambar_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const panti_owner = (request, response) => {
  pool.query(
    "SELECT * FROM tbl_panti INNER JOIN tbl_owner ON tbl_panti.owner_kode  = tbl_owner.owner_kode",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const kategori_panti = (request, response) => {
  const id = request.params.id;
  pool.query(
    "SELECT * FROM tbl_panti WHERE kategori_panti = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const new_user = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;
  var hash = crypto.createHash('md5').update(password).digest('hex');
  console.log(hash);

  pool.query(
    "INSERT INTO tbl_user (user_first_name, user_last_name, user_email, user_password) VALUES ($1,$2,$3,$4)",
    [first_name, last_name, email, hash],
    (error, results) => {
      console.log(results.rows);
      if (error) {
        return response.status(200).json({ code: 201, message: "failed" });
      } else {
        return response.status(200).send({
          success: true,
          signup: true
        });
      }
    }
  );
};

const new_owner = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;
  const alamat_owner = request.body.alamat;
  const telepon_owner = request.body.telepon_owner;
  const nama_panti = request.body.nama_panti;
  const alamat_panti = request.body.alamat_panti;
  const telepon_panti = request.body.telepon_panti;
  const jumlah_penghuni = request.body.jumlah_penghuni;
  const kategori_panti = request.body.kategori_panti;
  var kode_owner;

  // kode_owner = await pool.query('INSERT INTO tbl_owner(owner_alamat, owner_telepon, owner_firstname, owner_lastname, owner_email, owner_password) VALUES ($1,$2,$3,$4,$5,$6) returning owner_kode', [alamat_owner, telepon_owner, first_name, last_name, email, password])

  // console.log("ownerkode => ", kode_owner);
  // console.log(kode_owner[0].kode_owner);

  // await pool.query('INSERT INTO tbl_panti(panti_nama,kontak_panti,jumlah_penghuni,kategori_panti,id_location,gambar_id,owner_kode VALUES($1,$2,$3,$4,"-","-",&7)', [nama_panti, telepon_panti, jumlah_penghuni, kategori_panti, kode_owner[0].kode_owner])

  // return response.send({ "message": 'Insert success !', code: 200 })
  // pool.query(
  //   "INSERT INTO tbl_owner (owner_alamat, owner_telepon, owner_firstname, owner_lastname, owner_email, owner_password) VALUES ($1,$2,$3,$4,$5,$6)",
  //   [alamat, telepon, first_name, last_name, email, password],
  //   (error, results) => {
  //     console.log(results.rows);
  //     if (error) {
  //       throw error;
  //     } else {
  //       return response.status(200).send({
  //         success: true,
  //         signup: true
  //       });
  //     }
  //   }
  // );
};

const login_user = (request, response) => {
  const email = request.body.email;
  const password = crypto.createHash('md5').update(request.body.password).digest('hex');
  console.log("ini email", request.body.email);

  if (!email || !password) {
    return response.status(200).json({
      success: false,
      login: false,
      massage: "Please fill all required fields!"
    });
  } else if (email.length > 0 && password.length > 0) {
    pool.query(
      "SELECT * FROM tbl_user WHERE user_email = $1",
      [email],
      (error, results) => {

        if (results.rows.length < 1) {
          console.log("email tidak terdaftar !");
          return response.send({ "message": 'User not found!', code: 404 });
        }

        console.log("results => ", results)
        console.log("ini password ", password)
        console.log("ini pass dari DB ", results.rows[0].user_password)
        console.log(results.rows);
        if (error) {
          throw error;
        }
        const result = bcrypt.compareSync(password, bcrypt.hashSync(results.rows[0].user_password, 10))
        console.log("const result lewat")
        if (!result) {
          response.status(401).send('Password not valid!')
          return;
        }
        return response.status(200).json({
          success: true,
          login: true,
          data: results.rows
        });
      }
    );
  }
};

const login_owner = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  console.log("ini email", request.body.email);

  if (!email || !password) {
    return response.status(200).json({
      success: false,
      auth: false,
      massage: "Please fill all required fields!"
    });
  } else if (email.length > 0 && password.length > 0) {
    pool.query(
      "SELECT * FROM tbl_owner WHERE owner_email = $1",
      [email],
      (error, results) => {
        console.log(results.rows);
        if (error) {
          throw error;
        }
        return response.status(200).json({
          success: true,
          login: true,
          data: results.rows
        });
      }
    );
  }
};

const detail_panti = (request, response) => {
  const id = request.params.id;
  pool.query(
    " SELECT * FROM tbl_panti AS panti INNER JOIN tbl_gambar AS gambar ON gambar.gambar_id = panti.gambar_id INNER JOIN tbl_location AS loc ON loc.id_location = panti.id_location WHERE panti_id = $1;",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const edit_profile = async (request, response) => {
  const password = crypto.createHash('md5').update(request.body.password).digest('hex');
  const id = request.body.id;
  const name = request.body.name;
  const email = request.body.email;

  var results = await pool.query(
    "select * from tbl_user where user_id = $1", [id]);
  console.log("results => ", results.rows)
  console.log("ini password ", password)
  console.log("ini pass dari DB ", results.rows[0].user_password)

  const result = bcrypt.compareSync(password, bcrypt.hashSync(results.rows[0].user_password, 10))
  if (!result) {
    return response.status(401).send('Password not valid!');
  }
  await pool.query(
    "UPDATE tbl_user SET user_first_name = $1, user_email = $2 WHERE user_id = $3",
    [name, email, id]);

  // (error, results) => {
  //   if (error) {
  //     return response.status(200).json({ code: 201, message: "failed" });
  //   }
  // }

  return response.status(200).json({ code: 200, message: "success" });
};

const search_panti = (request, response) => {
  const search = "%" + request.body.search + "%";
  pool.query(
    "SELECT panti_id , panti_nama, kontak_panti, location_nama FROM tbl_panti INNER JOIN tbl_location ON tbl_location.id_location = tbl_panti.id_location WHERE LOWER(panti_nama) LIKE LOWER($1)",
    [search],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const bookmark_panti = (request, response) => {
  const id_user = request.body.id_user;
  const id_panti = request.body.id_panti;

  pool.query(
    "SELECT * FROM bookmarks WHERE id_user=$1 AND id_panti=$2",
    [id_user, id_panti],
    (error, results) => {
      if (results.rows.length > 0) {
        return response.status(201).json({ code: 201, message: "Failed" });
      }
      pool.query(
        "INSERT INTO bookmarks (id_user, id_panti) VALUES ($1,$2)",
        [id_user, id_panti],
        (salah, hasil) => {
          if (salah) {
            throw salah;
          }
          response.status(200).json({ code: 200, message: "success" });
        }
      );
    }
  );
};

const delete_bookmark = (request, response) => {
  const id_user = request.body.id_user;
  const id_panti = request.body.id_panti;

  pool.query(
    "DELETE FROM bookmarks Where id_user = $1 AND id_panti = $2",
    [id_user, id_panti],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ code: 200, message: "success" });
    }
  );
};

const show_bookmark = (request, response) => {
  const id = request.body.id;
  pool.query(
    "SELECT id_user, id_panti, panti_nama, kontak_panti, location_nama FROM bookmarks INNER JOIN tbl_panti ON bookmarks.id_panti = tbl_panti.panti_id INNER JOIN tbl_user ON bookmarks.id_user = tbl_user.user_id INNER JOIN tbl_location ON tbl_location.id_location = tbl_panti.id_location WHERE tbl_user.user_id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ code: 200, message: "success", data: results.rows });
    }
  );
};

module.exports = {
  panti,
  panti_owner,
  kategori_panti,
  login_user,
  new_user,
  new_owner,
  login_owner,
  detail_panti,
  edit_profile,
  search_panti,
  bookmark_panti,
  delete_bookmark,
  show_bookmark
};

//post tapi bodynya banyak
// var {param1, param2} = request.body
//get
//const _param = request.params.id

// pool.query(
//   "SELECT * FROM tbl_panti WHERE id_panti = $1",
//   [id],
//   [nama],
//   (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   }
// );
