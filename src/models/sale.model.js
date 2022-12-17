const db = require('../config/db.config');
const { createNewSales: createNewSaleQuery} = require('../database/queries');
const { logger } = require('../utils/logger');

class Sale {
    constructor(tgl,nama_promo,disc,total) {
        this.tgl = tgl;
        this.nama_promo = nama_promo;
        this.disc = disc;
        this.total = total;
    }

    static create(newSales, cb) {
        db.query(createNewSaleQuery,
            [
                newSales.tgl,
                newSales.nama_promo,
                newSales.disc,
                newSales.total
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    tgl: newSales.tgl,
                    nama_promo: newSales.nama_promo,
                    disc: newSales.disc,
                    total: newSales.total
                })
            })
    }
}

module.exports = Sale;