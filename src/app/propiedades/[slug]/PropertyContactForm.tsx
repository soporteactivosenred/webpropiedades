'use client';

import { useState } from 'react';
import { Button, Input, TextArea } from '@/components/ui';
import { validateForm, contactFormSchema } from '@/lib';
import { Mail, Send } from 'lucide-react';

interface Props {
  propertyId: string;
  propertyTitle: string;
}

export function PropertyContactForm({ propertyId, propertyTitle }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    const validation = validateForm(contactFormSchema, data);
    if (!validation.success) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Simulate submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white">¡Mensaje enviado!</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Nos pondremos en contacto contigo pronto sobre "{propertyTitle}".
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Nombre completo"
        placeholder="Tu nombre"
        required
        error={errors.name}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="tu@email.com"
        required
        error={errors.email}
      />
      <Input
        name="phone"
        type="tel"
        label="Teléfono (opcional)"
        placeholder="+56 9 1234 5678"
        error={errors.phone}
      />
      <TextArea
        name="message"
        label="Mensaje"
        placeholder={`Estoy interesado/a en "${propertyTitle}". Me gustaría obtener más información.`}
        rows={4}
        error={errors.message}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        leftIcon={<Send className="w-4 h-4" />}
      >
        Enviar mensaje
      </Button>
    </form>
  );
}