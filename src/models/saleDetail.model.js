const db = require('../config/db.config');
const { createNewSalesDetail: createNewSaleDetailQuery} = require('../database/queries');
const { logger } = require('../utils/logger');
const {json} = require("express");

class SaleDetail {
    constructor(id_penjualan,id_produk,harga,disc,qty) {
        this.id_penjualan = id_penjualan;
        this.id_produk = id_produk;
        this.harga = harga;
        this.disc = disc;
        this.qty = qty;
    }

    static create(newSalesDetail, cb) {
        var query = db.query(createNewSaleDetailQuery,
            [newSalesDetail.map(item => [item.id_penjualan, item.id_produk, item.harga, item.disc, item.qty])], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    newSalesDetail
                })
            })
        console.log(query.sql);
    }
}

module.exports = SaleDetail;