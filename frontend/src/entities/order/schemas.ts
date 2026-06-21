import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  cedula: z.string().min(5, "Introduce una cédula o RIF válido"),
  phone: z.string().min(10, "Introduce un número de teléfono válido"),
  email: z.string().email("Correo electrónico inválido")
});

export const deliveryDetailsSchema = z.object({
  address: z.string().min(10, "La dirección debe ser más detallada"),
  reference: z.string().optional(),
  city: z.string().min(2, "Introduce una ciudad válida"),
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora")
});

export const pickupDetailsSchema = z.object({
  branch: z.string().min(1, "Selecciona una sucursal"),
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora")
});
