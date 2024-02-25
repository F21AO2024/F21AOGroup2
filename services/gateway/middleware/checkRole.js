
function checkRole(roles) {

    return function(req, res, next) {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).send({ message: `Unauthorized, your role is = ${user.role}`, success: false});
        }
        else
            //if the user's roles in array of roles then allow access
            req.authMessage = `Authorized, your role is = ${user.role}`
            next();
        };
}
export default checkRole;