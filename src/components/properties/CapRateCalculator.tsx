'use client';

import { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, DollarSign, Percent, ShieldCheck } from 'lucide-react';

type UnitType = 'UF' | 'CLP';
type ModeType = 'tradicional' | 'airbnb';

export default function CapRateCalculator() {
  const [unit, setUnit] = useState<UnitType>('UF');
  const [mode, setMode] = useState<ModeType>('tradicional');

  // Inputs state (using values suitable for UF and CLP)
  const [propertyValue, setPropertyValue] = useState<number>(3000); // 3000 UF or 100M CLP
  const [monthlyRent, setMonthlyRent] = useState<number>(15); // 15 UF or 500k CLP
  const [dailyRate, setDailyRate] = useState<number>(1.8); // 1.8 UF or 60k CLP
  const [occupancyRate, setOccupancyRate] = useState<number>(65); // % for Airbnb
  const [platformFee, setPlatformFee] = useState<number>(15); // % for Airbnb (booking/airbnb)

  // Gastos
  const [monthlyAdmin, setMonthlyAdmin] = useState<number>(2); // 2 UF or 70k CLP
  const [annualTaxes, setAnnualTaxes] = useState<number>(10); // 10 UF or 350k CLP
  const [vacancyRate, setVacancyRate] = useState<number>(8); // % vacancy
  const [maintenanceRate, setMaintenanceRate] = useState<number>(1.5); // % maintenance

  // Reset helper when changing units to provide realistic defaults
  const handleUnitChange = (newUnit: UnitType) => {
    setUnit(newUnit);
    if (newUnit === 'CLP') {
      setPropertyValue(120000000);
      setMonthlyRent(600000);
      setDailyRate(55000);
      setMonthlyAdmin(60000);
      setAnnualTaxes(400000);
    } else {
      setPropertyValue(3000);
      setMonthlyRent(15);
      setDailyRate(1.8);
      setMonthlyAdmin(2);
      setAnnualTaxes(10);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    let grossAnnualIncome = 0;
    let vacancyLoss = 0;

    if (mode === 'tradicional') {
      grossAnnualIncome = monthlyRent * 12;
      vacancyLoss = grossAnnualIncome * (vacancyRate / 100);
    } else {
      // Airbnb: Daily rate * 365 * occupancy %
      const baseIncome = dailyRate * 365 * (occupancyRate / 100);
      // Platform fees
      const platformLoss = baseIncome * (platformFee / 100);
      grossAnnualIncome = baseIncome - platformLoss;
      vacancyLoss = 0; // vacancy already accounted for in occupancyRate
    }

    const annualAdmin = monthlyAdmin * 12;
    const maintenanceLoss = grossAnnualIncome * (maintenanceRate / 100);
    const totalExpenses = annualAdmin + annualTaxes + maintenanceLoss;

    const netOperatingIncome = Math.max(0, grossAnnualIncome - vacancyLoss - totalExpenses);
    const capRate = propertyValue > 0 ? (netOperatingIncome / propertyValue) * 100 : 0;
    const monthlyFlow = netOperatingIncome / 12;

    // Classification labels
    let rating = 'Baja';
    let ratingColor = 'text-red-400 border-red-900/30 bg-red-950/20';
    if (capRate >= 6.5) {
      rating = 'Excelente';
      ratingColor = 'text-emerald-400 border-emerald-900/30 bg-emerald-950/20';
    } else if (capRate >= 4.5) {
      rating = 'Aceptable';
      ratingColor = 'text-amber-400 border-amber-900/30 bg-amber-950/20';
    }

    // Chart breakdown percentages
    const totalIn = grossAnnualIncome;
    const adminPct = totalIn > 0 ? (annualAdmin / totalIn) * 100 : 0;
    const taxesPct = totalIn > 0 ? (annualTaxes / totalIn) * 100 : 0;
    const maintPct = totalIn > 0 ? (maintenanceLoss / totalIn) * 100 : 0;
    const vacancyPct = totalIn > 0 ? (vacancyLoss / totalIn) * 100 : 0;
    const netPct = totalIn > 0 ? (netOperatingIncome / totalIn) * 100 : 0;

    return {
      grossAnnualIncome,
      vacancyLoss,
      annualAdmin,
      maintenanceLoss,
      totalExpenses,
      netOperatingIncome,
      capRate,
      monthlyFlow,
      rating,
      ratingColor,
      chart: {
        netPct,
        adminPct,
        taxesPct,
        maintPct,
        vacancyPct,
      }
    };
  }, [mode, propertyValue, monthlyRent, dailyRate, occupancyRate, platformFee, monthlyAdmin, annualTaxes, vacancyRate, maintenanceRate]);

  // Format currency
  const formatVal = (val: number) => {
    if (unit === 'UF') {
      return `${val.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} UF`;
    }
    return `$${Math.round(val).toLocaleString('es-CL')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl p-6 md:p-8 max-w-6xl mx-auto">
      {/* Unit and Mode Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex bg-gray-50 dark:bg-gray-950 p-1.5 rounded-xl border border-gray-100 dark:border-gray-850">
          <button
            onClick={() => setMode('tradicional')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              mode === 'tradicional'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Arriendo Tradicional
          </button>
          <button
            onClick={() => setMode('airbnb')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              mode === 'airbnb'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Airbnb / Vacacional
          </button>
        </div>

        <div className="flex bg-gray-50 dark:bg-gray-950 p-1.5 rounded-xl border border-gray-100 dark:border-gray-850">
          <button
            onClick={() => handleUnitChange('UF')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
              unit === 'UF' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            UF
          </button>
          <button
            onClick={() => handleUnitChange('CLP')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
              unit === 'CLP' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            CLP ($)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Datos de la Propiedad
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-gray-650 dark:text-gray-400 mb-1.5 font-medium">
                Valor del Inmueble ({unit})
              </label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none"
              />
            </div>

            {mode === 'tradicional' ? (
              <div>
                <label className="block text-xs text-gray-650 dark:text-gray-400 mb-1.5 font-medium">
                  Arriendo Mensual Estimado ({unit})
                </label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs text-gray-650 dark:text-gray-400 mb-1.5 font-medium">
                  Tarifa por Noche Estimada ({unit})
                </label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none"
                />
              </div>
            )}
          </div>

          {mode === 'airbnb' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Ocupación Anual</label>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{occupancyRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={occupancyRate}
                  onChange={(e) => setOccupancyRate(parseInt(e.target.value))}
                  className="w-full accent-primary-500 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Comisión de Plataformas (Airbnb/Booking)</label>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{platformFee}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(parseInt(e.target.value))}
                  className="w-full accent-primary-500 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 pt-4 border-t border-gray-100 dark:border-gray-850 flex items-center gap-2">
            <Percent className="w-4 h-4" /> Egresos y Vacancia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-gray-650 dark:text-gray-400 mb-1.5 font-medium">
                Gastos Comunes / Administración Mensual ({unit})
              </label>
              <input
                type="number"
                value={monthlyAdmin}
                onChange={(e) => setMonthlyAdmin(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-650 dark:text-gray-400 mb-1.5 font-medium">
                Contribuciones / Impuesto Predial Anual ({unit})
              </label>
              <input
                type="number"
                value={annualTaxes}
                onChange={(e) => setAnnualTaxes(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mode === 'tradicional' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Tasa de Vacancia Anual (Meses desocupados)</label>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{vacancyRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={vacancyRate}
                  onChange={(e) => setVacancyRate(parseInt(e.target.value))}
                  className="w-full accent-primary-500 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Provisión para Mantenimiento (% sobre ingresos)</label>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{maintenanceRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={maintenanceRate}
                onChange={(e) => setMaintenanceRate(parseFloat(e.target.value))}
                className="w-full accent-primary-500 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Results Display */}
        <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-150 dark:border-gray-850 p-6 flex flex-col items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Rentabilidad Anual (CAP RATE)
          </h4>

          {/* Large Cap Rate number */}
          <div className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mt-2 mb-1 flex items-baseline gap-1">
            {calculations.capRate.toFixed(2)}
            <span className="text-2xl font-bold text-primary-650 dark:text-primary-500">%</span>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            {(calculations.capRate / 12).toFixed(3)}% mensual
          </div>

          {/* Quality Badge */}
          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase ${calculations.ratingColor}`}>
            Rentabilidad {calculations.rating}
          </div>

          {/* Metrics summary cards */}
          <div className="w-full grid grid-cols-2 gap-3 mt-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-xl p-3.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                Flujo Mensual Neto
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-450">
                {formatVal(calculations.monthlyFlow)}
              </span>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-xl p-3.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                Ingreso Neto Anual (NOI)
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {formatVal(calculations.netOperatingIncome)}
              </span>
            </div>
          </div>

          {/* Donut Chart / Progress Bar breakdown */}
          <div className="w-full mt-6 pt-6 border-t border-gray-150 dark:border-gray-850 space-y-3.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1 text-center">
              Desglose de Ingresos Brutos Anuales
            </span>

            {/* Stacked Progress Bar */}
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-900 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${calculations.chart.netPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Retorno Neto: ${calculations.chart.netPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${calculations.chart.adminPct}%` }}
                className="bg-primary-500 h-full transition-all duration-300"
                title={`Administración: ${calculations.chart.adminPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${calculations.chart.taxesPct}%` }}
                className="bg-purple-500 h-full transition-all duration-300"
                title={`Contribuciones: ${calculations.chart.taxesPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${calculations.chart.maintPct}%` }}
                className="bg-amber-500 h-full transition-all duration-300"
                title={`Mantenimiento: ${calculations.chart.maintPct.toFixed(1)}%`}
              />
              <div
                style={{ width: `${calculations.chart.vacancyPct}%` }}
                className="bg-red-500 h-full transition-all duration-300"
                title={`Pérdida por Vacancia: ${calculations.chart.vacancyPct.toFixed(1)}%`}
              />
            </div>

            {/* Legend grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 dark:text-gray-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block flex-shrink-0" />
                <span>Ingreso Neto ({calculations.chart.netPct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary-500 inline-block flex-shrink-0" />
                <span>Administración ({calculations.chart.adminPct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block flex-shrink-0" />
                <span>Contribuciones ({calculations.chart.taxesPct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block flex-shrink-0" />
                <span>Mantenimiento ({calculations.chart.maintPct.toFixed(0)}%)</span>
              </div>
              {mode === 'tradicional' && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block flex-shrink-0" />
                  <span>Vacancia Estimada ({calculations.chart.vacancyPct.toFixed(0)}%)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
