// types/cuestionario.ts
export interface Cuestionario {
  id: string;
  pacienteId: string;
  revisado: boolean;
  nombrePaciente: string;
  email: string;
  fechaEnvio: string;
  estado: string;
  datos: {
    personal: {
      nombre: string;
      apellidos: string;
      dni: string;
      telefono: string;
      direccion: string;
      edad: number;
      estadoEmocional: string;
    };
    historial: Record<string, any>;
    medicamentos: Record<string, any>;
  };
}