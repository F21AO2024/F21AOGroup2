

// function checkRole(roles) {
//  return async function(req, res, next) {
//     const user = req.user;
//     console.log(user)
//     console.log(`user id = ${user.id}`);
//     if (!user) {
//         return res.status(401).send({ message: 'Unauthorized, you are an employee that does not exist', success: false });
//     }
//     try {
//         /*
//         BUG observation:
//         Earlier, prisma schemas were used to register employees into the system
//         the schema uses UUIDs as strings and not ObjectIDs as in mongoose
//         So it tries to convert the string to an ObjectID and fails
//         reason: BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
        
//         Had the idea of duplicating the code here but that is not quite smart,
//         could use an API call via axios to get the employee ID and match it from prisma collection
//         it would keep it decoupled and more maintainable
//         */
//         const DBRole = await EmployeeModel.findOne({_id: user.id});
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ message: 'An error occurred while checking the role', success: false });
//     }
//  }
// }

//F21AO-86, F21AO-46  To fix the bug, use the API call to get the employee by id
//Update version 1.0.2 to use axios to get the employee by id and perform a db check

// const api = require('./api');
//this code works but as pointed out and after thoughts, it is actually tightly coupled because it involves the gateway service
// function checkRole(roles) {
//     return async function(req, res, next) {
//         const user = req.user;
//         console.log(user)
//         console.log(`checkRole.js: user id = ${user.id}`);
//         if (!user) {
//             return res.status(401).send({ message: 'Unauthorized, undefined or null', success: false });
//         }
//         try {
//             const employee = await api.getEmployeeById(user.id);
//             console.log(employee);
//              if (!employee) {
//                  return res.status(401).send({ message: 'Unauthorized, you are an employee that does not exist', success: false });
//              }
//              if (!roles.includes(employee.role)) {
//                  return res.status(403).send({ message: `Unauthorized role attempting to access, your true role is = ${employee.role}`, success: false });
//              }
//              //if ok
//              next();
//         } catch (error) {
//             console.error(error);
//             return res.status(500).send({ message: 'An internal server error occurred', success: false });
//         }
//     }
// }

//Update version 1.0.3 to remove db checks, remove dependency on gateway and remove axios
//pass the user from the decoded authRole.js rather relying on the incoming request!
function checkRole(roles) {
    return async function(req, res, next) {
        try {
        const user = req.user;
        console.log(user)
        console.log('checkRole again')
        console.log(`checkRole.js: user id = ${user.id}`);
        if (!user || user === null) {
            return res.status(401).send({ message: 'Unauthorized, undefined or null', success: false });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).send({ message: `Unauthorized role attempting to access, your true role is = ${user.role}`, success: false });
        }
        //if ok
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'An internal server error occurred', success: false });
    }
    }
}

module.exports = checkRole;