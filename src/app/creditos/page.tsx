import { Metadata } from 'next';
import { Button } from '@/components/ui';
import { CheckCircle2, Calculator, ArrowRight } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

export const metadata: Metadata = {
  title: 'Acceso a Créditos',
  description: 'Te asesoramos y ayudamos a conseguir el financiamiento ideal para tu nueva propiedad con Activos en Red.',
};

export default function CreditosPage() {
  return (
    <div className="pt-[104px] pb-16 md:pb-24">
      <div className="bg-primary-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Financia tu nuevo hogar</h1>
          <p className="text-xl max-w-2xl mx-auto text-primary-100">
            Te asesoramos paso a paso para que obtengas el crédito hipotecario con las mejores condiciones del mercado.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              ¿Por qué gestionar tu crédito con nosotros?
            </h2>
            <ul className="space-y-4">
              {[
                'Convenios con los principales bancos e instituciones financieras de Chile.',
                'Asesoría personalizada según tu perfil y capacidad de pago.',
                'Agilizamos la recopilación de antecedentes y tramitación.',
                'Te ayudamos a comparar tasas, CAE y gastos operacionales.',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a href="/contacto">
                <Button size="lg" className="gap-2">
                  Solicitar Evaluación <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Requisitos básicos
              </h3>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                Renta líquida compatible con el dividendo (usualmente 4 veces).
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                Antigüedad laboral mínima de 1 año (dependientes) o 2 años (independientes).
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                Buen comportamiento comercial (sin Dicom).
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                Pie mínimo desde el 10% al 20% del valor de la propiedad.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
