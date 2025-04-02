'use server'

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function createTestUser() {
  try {
    await dbConnect();
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Usuario de prueba ya existe');
      return { success: true, message: 'Usuario ya existe' };
    }
    
    // Crear contraseña hasheada
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    // Crear usuario
    const user = await User.create({
      nombre: 'Usuario',
      apellidos: 'De Prueba',
      email: 'test@example.com',
      password: hashedPassword,
      dni: '12345678X',
      role: 'paciente'
    });
    
    console.log('Usuario de prueba creado:', user.email);
    return { success: true, message: 'Usuario creado' };
  } catch (error) {
    console.error('Error al crear usuario de prueba:', error);
    return { success: false, error: String(error) };
  }
}