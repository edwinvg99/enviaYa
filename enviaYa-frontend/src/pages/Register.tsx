import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import Input from '../components/Input';
import Button from '../components/Button';
import type { RegisterData } from '../types/user.types';

const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

const isValidPhone = (phone: string): boolean => /^\+?[\d\s-]+$/.test(phone);

const isValidPassword = (password: string): boolean => password.length >= 6;

const isValidName = (name: string): boolean => name.trim().length >= 3;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Colombia'
    }
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address!,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || !isValidName(formData.name)) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password || !isValidPassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.phone || !isValidPhone(formData.phone)) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }

    if (!formData.address?.street || formData.address.street.trim().length < 5) {
      newErrors['address.street'] = 'Ingresa una dirección válida (mínimo 5 caracteres)';
    }
    if (!formData.address?.city || formData.address.city.trim().length < 3) {
      newErrors['address.city'] = 'Ingresa una ciudad válida';
    }
    if (!formData.address?.state || formData.address.state.trim().length < 3) {
      newErrors['address.state'] = 'Ingresa un departamento válido';
    }
    if (!formData.address?.postalCode || formData.address.postalCode.trim().length < 5) {
      newErrors['address.postalCode'] = 'Ingresa un código postal válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.register(formData);
      setSuccess(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string; message?: string } } };
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al registrar usuario';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Crear Cuenta</h2>
          <p className="mt-2 text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Error Messages */}
        {errors && Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
            {Object.values(errors).map((err, idx) => (
              <p key={idx} className="text-red-800 text-sm font-semibold">{err}</p>
            ))}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <p className="text-green-800 text-sm font-semibold">¡Registro exitoso! Redirigiendo...</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            error={errors.name}
            required
          />

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            error={errors.email}
            required
          />

          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="+57 300 123 4567"
            error={errors.phone}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            required
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
          />

          {/* Sección de Dirección */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dirección de Envío</h3>
            
            <div className="space-y-4">
              <Input
                label="Dirección"
                type="text"
                name="address.street"
                value={formData.address?.street || ''}
                onChange={handleChange}
                placeholder="Calle 123 #45-67"
                error={errors['address.street']}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ciudad"
                  type="text"
                  name="address.city"
                  value={formData.address?.city || ''}
                  onChange={handleChange}
                  placeholder="Bogotá"
                  error={errors['address.city']}
                  required
                />

                <Input
                  label="Departamento"
                  type="text"
                  name="address.state"
                  value={formData.address?.state || ''}
                  onChange={handleChange}
                  placeholder="Cundinamarca"
                  error={errors['address.state']}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Código Postal"
                  type="text"
                  name="address.postalCode"
                  value={formData.address?.postalCode || ''}
                  onChange={handleChange}
                  placeholder="110111"
                  error={errors['address.postalCode']}
                  required
                />

                <Input
                  label="País"
                  type="text"
                  name="address.country"
                  value={formData.address?.country || 'Colombia'}
                  onChange={handleChange}
                  placeholder="Colombia"
                  required
                />
              </div>
            </div>
          </div>


          <Button type="submit" isLoading={isLoading} className="w-full rounded-full text-lg font-semibold">
            Crear Cuenta
          </Button>
        </form>

        

        </div>
      </div>
    </div>
  );
};

export default Register;
