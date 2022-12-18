const db = require('../config/db.config');
const { logger } = require('../utils/logger');
const Sale = require("./sale.model");
const SaleDetail = require("./saleDetail.model");
const {response} = require("express");

class Promo {
    constructor(produk, qty) {
        this.produk = produk;
        this.qty = qty;
    }
    static checkPromo(produk,qty, cb) {
        var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var date = new Date();
        var thisDay = date.getDay(),
            thisDay = myDays[thisDay];
        var yy = date.getYear();
        var year = (yy < 1000) ? yy + 1900 : yy;
        var now = year + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' +("0" + date.getDate()).slice(-2)


        var promo = []
        let nama_promo
        let disc,total = 0
        let min_qty,id_promo
        var allDetail = []
        const saleDetail = allDetail;
        db.query("select harga,stok from produk where id = ?",produk,(err, resproduk) => {

            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (resproduk.length) {
                if (resproduk[0].stok >= qty){
                    db.query("select id_promo,min_qty_beli from promo_produk where id_produk = ?",produk, (err, respromoproduk) => {
                        if (err) {
                            logger.error(err.message);
                            cb(err, null);
                            return;
                        }
                        if (respromoproduk.length) {
                            min_qty = respromoproduk[0].min_qty_beli
                            id_promo = respromoproduk[0].id_promo
                            let tot_beli = resproduk[0].harga*qty
                            if (qty >= min_qty){
                                db.query("select id,nama_promo,tgl_awal,tgl_akhir,hari,min_beli,berlaku_kelipatan,jns_disc,nilai_disc,kuota_promo from promo where id = ?",id_promo, (err, respromo) => {
                                    if (err) {
                                        logger.error(err.message);
                                        cb(err, null);
                                        return;
                                    }
                                    if (respromo.length) {
                                        let min_beli = respromo[0].min_beli
                                        var x = respromo[0].tgl_awal
                                        var y = respromo[0].tgl_akhir
                                        var day_promo = respromo[0].hari
                                        var stringDay = day_promo.split(",");
                                        if (date >= x && date <= y){
                                            var hari = stringDay.includes(thisDay)
                                            if (hari == true){
                                                if (tot_beli >= min_beli){
                                                    if (respromo[0].kuota_promo > 0){
                                                        nama_promo = respromo[0].nama_promo
                                                        let kelipatan = respromo[0].berlaku_kelipatan
                                                        let jns_disc = respromo[0].jns_disc
                                                        let pengali = 1
                                                        if (kelipatan == 0){
                                                            if (jns_disc == 'Rp'){
                                                                disc = respromo[0].nilai_disc
                                                                total = tot_beli - disc
                                                                cb(null, {
                                                                    id_promo: respromo[0].id,
                                                                    nm_promo: respromo[0].nama_promo,
                                                                    tot_promo: pengali,
                                                                    disc: disc,
                                                                    total: total
                                                                });
                                                            } else if (jns_disc == '%'){
                                                                disc = (respromo[0].nilai_disc/100)*tot_beli
                                                                total = tot_beli - disc
                                                                cb(null, {
                                                                    id_promo: respromo[0].id,
                                                                    nm_promo: respromo[0].nama_promo,
                                                                    tot_promo: pengali,
                                                                    disc: disc,
                                                                    total: total
                                                                });
                                                            }
                                                        } else{
                                                            if (qty % min_qty == 0){
                                                                pengali = qty/min_qty
                                                                if (jns_disc == 'Rp'){
                                                                    disc = respromo[0].nilai_disc*pengali
                                                                    total = tot_beli - disc
                                                                    cb(null, {
                                                                        id_promo: respromo[0].id,
                                                                        nm_promo: respromo[0].nama_promo,
                                                                        tot_promo: pengali,
                                                                        disc: disc,
                                                                        total: total
                                                                    });
                                                                } else if (jns_disc == '%'){
                                                                    disc = ((respromo[0].nilai_disc*pengali)/100)*tot_beli
                                                                    total = tot_beli - disc
                                                                    cb(null, {
                                                                        id_promo: respromo[0].id,
                                                                        nm_promo: respromo[0].nama_promo,
                                                                        tot_promo: pengali,
                                                                        disc: disc,
                                                                        total: total
                                                                    });
                                                                }
                                                            } else{
                                                                if (jns_disc == 'Rp'){
                                                                    disc = respromo[0].nilai_disc*pengali
                                                                    total = tot_beli - disc
                                                                    cb(null, {
                                                                        id_promo: respromo[0].id,
                                                                        nm_promo: respromo[0].nama_promo,
                                                                        tot_promo: pengali,
                                                                        disc: disc,
                                                                        total: total
                                                                    });
                                                                } else if (jns_disc == '%'){
                                                                    disc = ((respromo[0].nilai_disc*pengali)/100)*tot_beli
                                                                    total = tot_beli - disc
                                                                    cb(null, {
                                                                        id_promo: respromo[0].id,
                                                                        nm_promo: respromo[0].nama_promo,
                                                                        tot_promo: pengali,
                                                                        disc: disc,
                                                                        total: total
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    }else{
                                                        cb(null, {
                                                            id_promo: null,
                                                            nm_promo: null,
                                                            tot_promo: 0,
                                                            disc: 0,
                                                            total: tot_beli
                                                        });
                                                    }
                                                } else{
                                                    cb(null, {
                                                        id_promo: null,
                                                        nm_promo: null,
                                                        tot_promo: 0,
                                                        disc: 0,
                                                        total: tot_beli
                                                    });
                                                }
                                            } else{
                                                cb(null, {
                                                    id_promo: null,
                                                    nm_promo: null,
                                                    tot_promo: 0,
                                                    disc: 0,
                                                    total: tot_beli
                                                });
                                            }
                                        } else{
                                            cb(null, {
                                                id_promo: null,
                                                nm_promo: null,
                                                tot_promo: 0,
                                                disc: 0,
                                                total: tot_beli
                                            });
                                        }
                                    }
                                })
                            } else{
                                cb(null, {
                                    id_promo: null,
                                    nm_promo: null,
                                    tot_promo: 0,
                                    disc: 0,
                                    total: tot_beli
                                });
                            }
                        }
                    })
                } else{
                    cb({ kind: "out of stock" }, null);
                }
            }
            // cb({ kind: "not_found" }, null);
        })
    }
}

module.exports = Promo;