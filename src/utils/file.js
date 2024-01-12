const path = require('path');
const fs = require('fs');
const { uploadsPath } = require('../constants/constants');

/**
 * @description this function create for deleting file from uploads directory
 * @param {string} fileName
 */
module.exports.deleteUploadFile = (fileName)=> {fs.unlink(path.join( uploadsPath, fileName), (err)=>console.log(err));};