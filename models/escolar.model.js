const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            uppercase: true,
            minLength: 3,
            maxLength: 50
        },
        lastname: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50
        },
        curp: {
            type: String,
            required: true,
            validate: {
                validator: function(curp) {
                  return /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(curp);
                },
                message: `CURP Invalid!`
            }
        },
        create_date: {
            type: Date,
            required: true,
            default: Date.now
        },
        controlnumber: {
            type: String,
            required: true,
            unique: true
        },
        grade: {
            type: Number,
            required: true,
            validate(cal) {
                if (cal >= 0 && cal <= 100) {     
                } else {
                    throw new Error("Calificación incorrecta.");
                }
            }
        },
        career: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                  return /(ISC|IM|IGE|IC){1}/.test(v);
                },
                message: 
                `Carrera invalida, validas: 
                ISC
                IM
                IGE
                IG,
                `
            }
        }
    }
);

const escolarModel = mongoose.model('Scholar', schema, 'scholar');

module.exports = escolarModel;