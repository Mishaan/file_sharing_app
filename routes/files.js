const router = require('express').Router();
const multer = require('multer');     // first add it into config folder through terminal 'yarn add multer'
const path = require('path');          // this is for file.originalname
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // filename should be unique for all files otherwise it can mix
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        // in above line we generated a random number, and this path.extname will tell the file extension & this we enable with the help of importing require('path') module

        // cb -> callback, it takes two perimeter (error, destination)
        cb(null, uniqueName);
    }
});


let upload = multer({
    storage,                // this we can write as storage: storage as both the name are same that's why
    limits: {fileSize: 1000000 * 100},           // limit
}).single('myfile');               // this 'myfile' we take from the upload file name in insomnia, or this will be the frontend filename attribute

router.post('/', (req, res) => {

    // 2) store files
        upload(req, res, async (err) => {
            // 1) validate request
            if (!req.file)  {
                return res.json({ error: 'All fields are required!'});
            }

            if (err)  {
                return res.status(500).send({ error: err.message });
            }

            // 3) Store in Database
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            })

            // 4) Response i.e send the link for downloading
            const response = await file.save();
            return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
            // http://localhost:3000/files/2354798757-fhskh343       the download link will look like this, which we sent to the client
        });
});

// email part
router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;

    // validate request
    if (!uuid || !emailTo || !emailFrom)  {
        return res.status(422).send({ error: 'All fields are required!'});
    }

    // get data from the database
    try {
        const file = await File.findOne({ uuid: uuid });
        // console.log(file);
        if (file.sender) {
            // check this in models folder in file.js, the sender row there is by default we kept false
            // here it checks whether the sender had already send the data before or not

            return res.status(422).send({ error: 'Email already sent.' });
        }

        // this is if this the new user/sender
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // send email, and this we are doing by making another folder services -> emailService (file)
        const sendMail = require('../services/emailService');
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'Inshare File Sharing',
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailTemplate') ({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
        }).then(() => {
            return res.json({ success: true });
        }).catch(err => {
            return res.status(500).json({ erro : 'Error in email sending!' });
        });
    } catch (err) {
        return res.status(500).send({ error : 'Something went wrong !' });
    }
});

module.exports = router;