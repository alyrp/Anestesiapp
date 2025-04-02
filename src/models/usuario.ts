import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Definir el esquema del usuario
const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor, proporcione un nombre'],
    trim: true,
  },
  apellidos: {
    type: String,
    required: [true, 'Por favor, proporcione apellidos'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor, proporcione un email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor, proporcione un email válido'],
  },
  password: {
    type: String,
    required: [true, 'Por favor, proporcione una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false, // No incluir por defecto en las consultas
  },
  dni: {
    type: String,
    required: [true, 'Por favor, proporcione un DNI/NIE'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['paciente', 'medico'],
    default: 'paciente',
  },
  especialidad: {
    type: String,
    required: function() { return this.role === 'medico'; },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware para hacer hash de la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Verificar si el modelo ya existe para evitar sobreescribirlo
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;