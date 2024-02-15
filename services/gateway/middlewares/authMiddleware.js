const JWT = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    try {
        //TODO: improve message error handling messages, they are vague now
    const token = req.headers['authorization'].split(" ")[1];
    // console.log(`The token inside = ${token}`)
    JWT.verify(token, process.env.JWT_SECRET, (error, decode) => {
        if (error) {
            return res.status(200).send({
                message: 'Authentization failed', success: false
            });
        } else {
            req.body.HospitalEmployeeId = decode.id;
            next();
        }
    });
} catch (error) { 
    console.error(error);
    res.status(401).send({
        message: 'Auth failed',
        success: false
    });
}
}
