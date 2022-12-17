const db = require('../config/db.config');
const Sale = require('../models/sale.model');
const SaleDetail = require('../models/saleDetail.model');
const Promo = require('../models/promo.model');
const {logger} = require("../utils/logger");
const {array} = require("joi");


exports.sales = (req, res) => {
    const { tgl, produk } = req.body;
    var promo = []
    let nama_promo = ''
    var total=0
    var disc=0
    const sale = new Sale(tgl, nama_promo, disc, total);
    var allDetail = []
    const saleDetail = allDetail;
    let tot_produk = produk.length
    let completedCount = 0;
        for (let i = 0;i < tot_produk;i++) {
            db.query("select harga,stok from produk where id = ?",produk[i].id,(err, resproduk) => {
                if (err) {
                    logger.error(err.message);
                    resproduk.status(500).send({
                        status: "error",
                        message: err.message
                    });
                }
                if (resproduk.length) {
                    Promo.checkPromo(produk[i].id, produk[i].qty,(err, dataPromo) => {
                        if (err) {
                            res.status(500).send({
                                status: "error",
                                message: err.message
                            });
                        } else {

                            total += dataPromo.total
                            disc += dataPromo.disc
                            if (dataPromo.tot_promo > 0){
                                var use_promo = {}
                                use_promo['id'] = dataPromo.id_promo
                                use_promo['name'] = dataPromo.nm_promo
                                use_promo['use'] = dataPromo.tot_promo
                                promo.push(use_promo)
                            }
                            var obj = {}
                            obj['id_penjualan'] = 0
                            obj['id_produk'] = produk[i].id
                            obj['harga'] = resproduk[0].harga
                            obj['disc'] = dataPromo.disc
                            obj['qty'] = produk[i].qty
                            allDetail.push(obj)

                            completedCount += 1;
                            // if (i == tot_produk - 1){
                            if (completedCount == tot_produk){
                                let allPromo = promo.map(value => value.name)
                                nama_promo = allPromo.join()
                                sale.total = total
                                sale.disc = disc
                                sale.nama_promo = nama_promo
                                Sale.create(sale, (err, data) => {
                                    if (err) {

                                        res.status(500).send({
                                            status: "error",
                                            message: err.message
                                        });
                                    } else {
                                        for (let j = 0;j < tot_produk;j++) {
                                            allDetail[j].id_penjualan = data.id
                                            db.query("select stok from produk where id = ?",produk[j].id,(err, dataProduk) => {
                                                if (err) {
                                                    logger.error(err.message);
                                                    dataProduk.status(500).send({
                                                        status: "error",
                                                        message: err.message
                                                    });
                                                } else {
                                                    let stok_produk = dataProduk[0].stok - produk[j].qty
                                                    db.query("update produk set stok = "+stok_produk+" where id = ?",produk[j].id, (err, resuptproduk) => {
                                                        if (err) {
                                                            logger.error(err.message);
                                                            resuptproduk.status(500).send({
                                                                status: "error",
                                                                message: err.message
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        SaleDetail.create(saleDetail, (err, dataDetail) => {
                                            if (err) {
                                                res.status(500).send({
                                                    status: "error",
                                                    message: err.message
                                                });
                                            } else {
                                                let detail = dataDetail.newSalesDetail
                                                let tot_promo = promo.length
                                                if (tot_promo > 0){
                                                    let countPromo = 0
                                                    for (let k = 0;k < tot_promo;k++) {
                                                        db.query("select kuota_promo from promo where id = ?",promo[k].id,(err, respromo) => {
                                                            if (err) {
                                                                logger.error(err.message);
                                                                respromo.status(500).send({
                                                                    status: "error",
                                                                    message: err.message
                                                                });
                                                            } else{
                                                                let kuota_promo = respromo[0].kuota_promo - promo[k].use
                                                                db.query("update promo set kuota_promo = "+kuota_promo+" where id = ?",promo[k].id, (err, resuptpromo) => {
                                                                    if (err) {
                                                                        logger.error(err.message);
                                                                        resuptpromo.status(500).send({
                                                                            status: "error",
                                                                            message: err.message
                                                                        });
                                                                    } else{
                                                                        res.status(201).send({
                                                                            status: "success",
                                                                            data: {
                                                                                data,
                                                                                detail
                                                                            }
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });

                }
            })
        }
};
