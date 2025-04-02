'use server'

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function checkUsers() {
  try {
    await dbConnect();
    
    // Obtener todos los usuarios (sin contraseñas)
    const users = await User.find({}).select('-password');
    
    return { 
      success: true, 
      users: users.map(u => ({
        id: u._id.toString(),
        nombre: u.nombre,
        apellidos: u.apellidos,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))
    };
  } catch (error) {
    console.error('Error al verificar usuarios:', error);
    return { success: false, error: String(error) };
  }
}