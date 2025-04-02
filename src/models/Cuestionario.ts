import mongoose from 'mongoose';

const CuestionarioSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nombrePaciente: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fechaEnvio: {
    type: Date,
    default: Date.now,
  },
  datos: {
    personal: {
      type: Object,
      required: true,
    },
    historial: {
      type: Object,
      required: true,
    },
    medicamentos: {
      type: Object,
      required: true,
    },
  },
  estado: {
    type: String,
    enum: ['bajo', 'medio', 'alto'],
    required: true,
  },
  revisado: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.models.Cuestionario || mongoose.model('Cuestionario', CuestionarioSchema);