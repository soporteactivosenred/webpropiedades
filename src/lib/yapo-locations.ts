// Diccionario oficial de Regiones y Comunas de Chile para Yapo.cl / Encuentra24
export const YAPO_CHILE_LOCATIONS: Record<string, string> = {
  // Regiones generales
  'chile': '5247',
  'metropolitana': '5480',
  'coquimbo': '5566',
  'valparaíso': '5441',
  'valparaiso': '5441',
  'antofagasta': '5592',
  'atacama': '5582',
  'tarapacá': '5602',
  'tarapaca': '5602',
  'arica & parinacota': '5270',
  'arica y parinacota': '5270',
  'o\'higgins': '5407',
  'maule': '5376',
  'ñuble': '5248',
  'nuble': '5248',
  'biobío': '5342',
  'biobio': '5342',
  'araucanía': '5533',
  'araucania': '5533',
  'los ríos': '5275',
  'los rios': '5275',
  'los lagos': '5311',
  'aysén': '5300',
  'aysen': '5300',
  'magallanes': '5288',

  // Comunas Región Metropolitana
  'san miguel': '5488',
  'santiago': '5485',
  'providencia': '5498',
  'las condes': '5512',
  'vitacura': '5482',
  'ñuñoa': '5481',
  'nunoa': '5481',
  'la reina': '5514',
  'lo barnechea': '5511',
  'macul': '5508',
  'peñalolén': '5500',
  'penalolen': '5500',
  'la florida': '5517',
  'maipú': '5507',
  'maipu': '5507',
  'estación central': '5522',
  'estacion central': '5522',
  'huechuraba': '5521',
  'independencia': '5520',
  'recoleta': '5493',
  'quinta normal': '5494',
  'quilicura': '5495',
  'pudahuel': '5497',
  'puente alto': '5496',
  'san bernardo': '5491',
  'san joaquín': '5490',
  'san joaquin': '5490',
  'la cisterna': '5518',
  'la granja': '5516',
  'la pintana': '5515',
  'lo espejo': '5510',
  'lo prado': '5509',
  'cerrillos': '5529',
  'cerro navia': '5528',
  'conchalí': '5526',
  'conchali': '5526',
  'renca': '5492',
  'colina': '5527',
  'lampa': '5513',
  'tiltil': '5483',
  'pirque': '5499',
  'san josé de maipo': '5489',
  'san jose de maipo': '5489',
  'buin': '5531',
  'calera de tango': '5530',
  'paine': '5503',
  'melipilla': '5505',
  'curacaví': '5525',
  'curacavi': '5525',
  'maría pinto': '5506',
  'maria pinto': '5506',
  'san pedro': '5487',
  'alhué': '5532',
  'alhue': '5532',
  'talagante': '5484',
  'el monte': '5523',
  'isla de maipo': '5519',
  'padre hurtado': '5504',
  'peñaflor': '5501',
  'penaflor': '5501',

  // Comunas Región de Coquimbo
  'la serena': '5575',
  'coquimbo': '5578',
  'ovalle': '5572',
  'andacollo': '5581',
  'canela': '5580',
  'combarbalá': '5579',
  'combarbala': '5579',
  'illapel': '5577',
  'la higuera': '5576',
  'los vilos': '5574',
  'monte patria': '5573',
  'paiguano': '5571',
  'paihuano': '5571',
  'punitaqui': '5570',
  'río hurtado': '5569',
  'rio hurtado': '5569',
  'salamanca': '5568',
  'vicuña': '5567',
  'vicuna': '5567',

  // Comunas Región de Valparaíso
  'viña del mar': '5443',
  'vina del mar': '5443',
  'valparaíso': '5445',
  'valparaiso': '5445',
  'concón': '5472',
  'concon': '5472',
  'quilpué': '5453',
  'quilpue': '5453',
  'villa alemana': '5444',
  'quillota': '5454',
  'limache': '5464',
  'olmué': '5460',
  'olmue': '5460',
  'algarrobo': '5479',
  'el quisco': '5471',
  'el tabo': '5470',
  'cartagena': '5475',
  'san antonio': '5450',
  'santo domingo': '5446',
  'zapallar': '5442',
  'papudo': '5458',
  'puchuncaví': '5456',
  'puchuncavi': '5456',
  'maitencillo': '5456',
  'los andes': '5462',
  'san felipe': '5448',
};

export function getRegionId(cityOrCommune?: string | null, regionName?: string | null): string {
  const norm = (str?: string | null) => (str || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const communeNorm = norm(cityOrCommune);
  const regionNorm = norm(regionName);

  // Buscar por comuna primero
  for (const [key, id] of Object.entries(YAPO_CHILE_LOCATIONS)) {
    if (communeNorm && norm(key) === communeNorm) {
      return id;
    }
  }

  // Buscar por región
  for (const [key, id] of Object.entries(YAPO_CHILE_LOCATIONS)) {
    if (regionNorm && norm(key) === regionNorm) {
      return id;
    }
  }

  // Fallback si contiene palabras clave
  if (communeNorm.includes('serena')) return '5575';
  if (communeNorm.includes('ovalle')) return '5572';
  if (communeNorm.includes('coquimbo')) return '5578';
  if (communeNorm.includes('san miguel')) return '5488';
  if (communeNorm.includes('santiago') || regionNorm.includes('metropolitana')) return '5480';

  return '5566'; // Default Coquimbo
}
