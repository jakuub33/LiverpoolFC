// Upload zdjęcia

const path = require('path');
// https://www.npmjs.com/package/multer
// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer'); //do obsługi multipart/form-data
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/') // null - czy chce przekazać jakiś error
    },
    filename: function(req, file, cb) {
        const name = Date.now() + path.extname(file.originalname) //nazwa pliku to bedzie data i rozszerzenie
        cb(null, name) //name - nadajemy nazwe dla nowych plików
    }
})
const upload = multer({ storage }); //gdzie zdjecia mają się uploudować

module.exports = upload;