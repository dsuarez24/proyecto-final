import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

// Obtener todos los usuarios
export const usersGet = async (req = request, res = response) => {
    const query = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
    ]);

    res.status(200).json({
        total,
        users
    });
}

// Agregar un usuario
export const userPost = async (req, res) => {
    const { name, email, phone, address, password, role } = req.body;
    const user = new User({ name, email, phone, address, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();

    res.status(200).json({
        user
    });
}
// Registrar usuario default
export const register = async (req, res) => {
    const { name, email, phone, address, password} = req.body;
    const user = new User({ name, email, phone, address, password, role: 'CLIENT'});

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    await user.save();

    res.status(200).json({
        user
    });
}

// Editar usuario LOGUEADO
export const userPutLog = async (req, res = response) => {
    const {id} = req.user;
    const { _id, password, email, ...resto } = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Profile actualized',
        user
    });
}
// Editar usuario
export const userPut = async (req, res = response) => {
    const { _id, password, email, ...resto } = req.body;

    const Iduser = await User.findOne({email});

    if(!Iduser){
        return res.status(404).json({ msg: 'User doesnt exist in the databse' });
    }
    if(!Iduser.state){
        return res.status(404).json({ msg: 'User was desactivated'});
    }

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(Iduser._id, resto);

    res.status(200).json({
        msg: 'Profile actualized',
        user
    });
}

// Eliminar perfil
export const userDeleteLog = async (req, res) => {
    const {_id} = req.user;
    const { password } = req.body;

    const user = await User.findById(_id);

    const validatePassword = bcryptjs.compareSync(password, user.password);
    if (!validatePassword) {
        return res.status(400).json({
            msg: "Incorrect password",
        });
    }
  
    user.state = false;
    
    await user.save();
    res.status(200).json({
        msg: 'Profile desactivated',
        user,
    });
}
export const userDelete = async (req, res) => {
    const {email} = req.body;

    const Iduser = await User.findOne({email});

    if(!Iduser){
        return res.status(404).json({ msg: 'User doesnt exist in the databse' });
    }
    if(!Iduser.state){
        return res.status(404).json({ msg: 'User was desactivated'});
    }

    const user = await User.findByIdAndUpdate(Iduser._id, {state: false});

    res.status(200).json({
        msg: 'Profile desactivated',
        user,
    });
}
