import mongoose, { Schema, type Document } from "mongoose"

export interface IPaciente extends Document {
  nombrePaciente: string
  email: string
  revisado: boolean
  fechaEnvio: Date
  datos: {
    personal: {
      nombre?: string
      apellidos?: string
      dni?: string
      fechaNacimiento?: Date
      genero?: string
      telefono?: string
      email?: string
      procedimiento?: string
      fechaProcedimiento?: Date
      estadoEmocional?: string
      actividadesFisicas?: string[]
      peso?: string
      talla?: string
    }
    historial: {
      condiciones?: string[]
      alergias?: string
      cirugias_previas?: string
      complicaciones_anestesia?: string
      detalles_complicaciones?: string
      fumador?: string
      alcohol?: string
      primera_operacion?: string
      problemas_anestesia?: string
      tipos_problemas?: string[]
      otros_problemas?: string
      marcapasos?: string
      cpap?: string
      sangrado?: string
      detalles_sangrado?: string
      drogas?: string
      detalles_drogas?: string
    }
    medicamentos: {
      toma_medicamentos?: string
      medicamentos?: Array<{
        nombre: string
        dosis?: string
        frecuencia?: string
      }>
      anticoagulantes?: string
      detalles_anticoagulantes?: string
      suplementos?: string
      reaccion_adversa?: string
      medicamento_adverso?: string
      tipo_reaccion?: string
      detalle_efecto_secundario?: string
    }
    medico?: {
      tratamiento?: string
      observaciones?: string
    }
  }
}

const PacienteSchema: Schema = new Schema(
  {
    nombrePaciente: { type: String, required: true },
    email: { type: String, required: true },
    revisado: { type: Boolean, default: false },
    fechaEnvio: { type: Date, default: Date.now },
    datos: {
      personal: {
        nombre: String,
        apellidos: String,
        dni: String,
        fechaNacimiento: Date,
        genero: String,
        telefono: String,
        email: String,
        procedimiento: String,
        fechaProcedimiento: Date,
        estadoEmocional: String,
        actividadesFisicas: [String],
        peso: String,
        talla: String,
      },
      historial: {
        condiciones: [String],
        alergias: String,
        cirugias_previas: String,
        complicaciones_anestesia: String,
        detalles_complicaciones: String,
        fumador: String,
        alcohol: String,
        primera_operacion: String,
        problemas_anestesia: String,
        tipos_problemas: [String],
        otros_problemas: String,
        marcapasos: String,
        cpap: String,
        sangrado: String,
        detalles_sangrado: String,
        drogas: String,
        detalles_drogas: String,
      },
      medicamentos: {
        toma_medicamentos: String,
        medicamentos: [
          {
            nombre: String,
            dosis: String,
            frecuencia: String,
          },
        ],
        anticoagulantes: String,
        detalles_anticoagulantes: String,
        suplementos: String,
        reaccion_adversa: String,
        medicamento_adverso: String,
        tipo_reaccion: String,
        detalle_efecto_secundario: String,
      },
      medico: {
        tratamiento: String,
        observaciones: String,
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Paciente || mongoose.model<IPaciente>("Paciente", PacienteSchema)

