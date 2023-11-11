const {user:User} = require("../../prisma/index")
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * @description this function using for create user
 * @param {*} req 
 * @param {*} res 
 * @returns create user object 
 */
const requiredFields = ["email", "password", "name", "address"]
const createUserSchema = Joi.object().keys({
    name: Joi.string().min(4).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).max(15).required(),
    address:Joi.object().keys({street:Joi.string(), city:Joi.string(), state:Joi.string(), zip:Joi.string()})
});
module.exports.createUser = async (req, res)=> {
    try {
        // check all requeued filed  
        if (!Object.keys(req.body).every(f=> requiredFields.includes(f))) return res.status(201).send("fields is missing")
        
        // check all filed data type
        const {error} = createUserSchema.validate(req.body);
        if(error) return res.status(202).send("Invalid request");
         
        // bcrypt user password
        req.body.password = await bcrypt.hash(req.body.password, 10);

        // creating user 
        const createdUser  = await User.create({data:req.body});
        res.status(200).send({user:createdUser});
    } catch (err) {
        console.log(err);
        if(err.code === "P2002") return  res.status(203).send("Email Already exists ");
        res.status(500).send("soothing wrong");
    }
} 


/**
 * @description this function using for get all users
 * @param {*} req 
 * @param {*} res 
 * @returns all user data array of object  
 */
module.exports.getUsers = async (req, res)=> {
    try {
        const users =  await User.findMany();
        res.status(200).send(users);
    } catch (error) {
        console.log(err);
        res.status(500).send("soothing wrong")
    }
} 


/**
 * @description this function using for get single user
 * @param {*} req 
 * @param {*} res 
 * @returns single user object  
 */
module.exports.getUser = async (req, res)=> {
    try {
        const user = await User.findUnique({where:{id:req.params.id}});
        res.status(200).send(user);
    } catch (error) {
        console.log(err);
        res.status(500).send("soothing wrong")
    }
} 



/**
 * @description this function using for update user
 * @param {*} req 
 * @param {*} res 
 * @returns updated user
 */
const updateUserSchema = Joi.object().keys({
    name: Joi.string().min(4).max(30),
    email:Joi.string().email(),
    password:Joi.string().min(6).max(15),
    address:Joi.object().keys({street:Joi.string(), city:Joi.string(), state:Joi.string(), zip:Joi.string()})
});
module.exports.updateUser = async (req, res)=> {
    try {
         // check all filed data type
         const {error} = updateUserSchema.validate(req.body);
         if(error) return res.status(202).send("Invalid request");

        // password bcrypt
        if(req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);

        //  updating user 
        const user = await User.update({where:{id:req.params.id},data:req.body});
        res.status(200).send(user);
        
    } catch (error) {
        console.log(err);
        if(err.code === "P2002") return  res.status(203).send("Email Already exists ");
        res.status(500).send("soothing wrong")
    }
} 



/**
 * @description this function using for delete user
 * @param {*} req 
 * @param {*} res 
 * @returns deleted user
 */
module.exports.deleteUser = async (req, res)=> {
    try {
        const user = await User.delete({where:{id:req.params.id}});
        res.status(200).send(user);
    } catch (error) {
        console.log(err);
        res.status(500).send("soothing wrong")
    }
} 


/**
 * @description this function using for forget password
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.forgetPassword = async (req, res)=> {
    try {

    } catch (error) {
        console.log(err);
        res.status(500).send("soothing wrong")
    }
} 


/**
 * @description this function using for logout user
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
module.exports.logoutUser = async (req, res)=> {} 


/**
 * @description this function using for login user
 * @param {*} req 
 * @param {*} res 
 * @returns user object 
 */
const requiredField = ["email", "password"]
const loginUserSchema = Joi.object().keys({
    email:Joi.string().email(),
    password:Joi.string().min(6).max(15),
});
module.exports.loginUser = async (req, res)=> {

    try {
        // check all requeued filed  
        if (!Object.keys(req.body).every(f=> requiredField.includes(f))) return res.status(201).send("fields is missing")

        // check all filed data type
        const {error} = loginUserSchema.validate(req.body);
        if(error) return res.status(202).send("Invalid request");

        const user = await User.findUnique({where:{email:req.body.email}});

        if(user){
            // check password valid
           const isValid = await bcrypt.compare(req.body.password,user.password);
           if(!isValid) return res.status(200).send("Password or Email invalid");

           // creating wen token  
           user.token = jwt.sign({email:user.email, id:user.id}, process.env.JWT_SECRET, {expiresIn: "7d"})
           return res.status(200).send(user);
        }
        res.status(200).send("Password or Email invalid");
    } catch (error) {
        console.log(err);
        res.status(500).send("soothing wrong")
    }

} 

