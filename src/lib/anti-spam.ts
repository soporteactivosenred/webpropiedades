/**
 * Módulo de seguridad y protección anti-spam para formularios y envío de leads
 */

// Registro en memoria para Rate Limiting por IP (IP -> timestamps[])
const ipRequestHistory = new Map<string, number[]>();

// Lista de dominios de correos temporales / desechables comunes usados por bots
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 'guerrillamail.net',
  '10minutemail.com', '10minutemail.net', 'mailinator.com', 'yopmail.com',
  'sharklasers.com', 'dispostable.com', 'throwawaymail.com', 'trashmail.com',
  'fakeinbox.com', 'getairmail.com', 'mohmal.com', 'mytemp.email', 'dropmail.me'
]);

// Palabras clave típicas de spam en formularios
const SPAM_KEYWORDS = [
  'seo ranking', 'first page of google', 'increase your sales', 'backlinks',
  'guest post', 'crypto', 'cryptocurrency', 'bitcoin', 'forex trading',
  'whatsapp marketing', 'telegram bot', 'dating site', 'meet singles',
  'viagra', 'cialis', 'casino online', 'free bonus', 'porn', 'xxx',
  'make money fast', 'financial freedom', 'investment opportunity 100%'
];

/**
 * 1. Verifica si el campo trampa (Honeypot) fue completado.
 * Los bots completan automáticamente todos los inputs que encuentran.
 */
export function isHoneypotTriggered(data: Record<string, any>): boolean {
  const honeypotKeys = ['b_website', 'website', 'honeypot', 'address_line2', 'company_url'];
  for (const key of honeypotKeys) {
    if (data[key] && typeof data[key] === 'string' && data[key].trim().length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * 2. Verifica si el formulario fue enviado demasiado rápido (< 2 segundos).
 * Los humanos tardan al menos 3 a 10 segundos en escribir nombre, correo y mensaje.
 */
export function isSubmittedTooFast(formLoadedAt?: number | string, minSeconds = 2.0): boolean {
  if (!formLoadedAt) return false; // Si no viene timestamp, se evalúan otros filtros
  const loadedTime = typeof formLoadedAt === 'string' ? parseInt(formLoadedAt, 10) : formLoadedAt;
  if (isNaN(loadedTime) || loadedTime <= 0) return false;
  
  const elapsedMs = Date.now() - loadedTime;
  return elapsedMs < (minSeconds * 1000);
}

/**
 * 3. Detector heurístico de nombres generados por bots (como cQTKNttFO, pBAMFPzH, BNPGWHn)
 */
export function isBotName(name: string): boolean {
  if (!name || typeof name !== 'string') return true;
  const trimmed = name.trim();
  
  // Nombres extremadamente cortos (< 2 caracteres)
  if (trimmed.length < 2) return true;
  
  // Contiene URLs, emails o caracteres sospechosos en el nombre
  if (/https?:\/\/|\.com|\.ru|\.cn|\.xyz|@|<|>|\[|\]/i.test(trimmed)) {
    return true;
  }

  // Nombres que son una sola palabra larga (>= 7 caracteres) sin espacios
  if (!trimmed.includes(' ') && trimmed.length >= 7) {
    // a) 5 o más consonantes seguidas sin vocales (ej: BNPGWHn, cQTKNtt)
    if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/.test(trimmed)) {
      return true;
    }
    
    // b) Mezcla caótica de mayúsculas y minúsculas sin espacios (ej: cQTKNttFO, pBAMFPzH)
    // Contamos cambios de caso (mayúscula a minúscula o viceversa)
    let caseSwitches = 0;
    for (let i = 1; i < trimmed.length; i++) {
      const prevUpper = trimmed[i - 1] === trimmed[i - 1].toUpperCase() && /[a-zA-Z]/.test(trimmed[i - 1]);
      const currUpper = trimmed[i] === trimmed[i].toUpperCase() && /[a-zA-Z]/.test(trimmed[i]);
      if (prevUpper !== currUpper) {
        caseSwitches++;
      }
    }
    // En nombres reales comunes (ej: "Alejandro", "McCartney") hay 0 a 2 cambios de mayúscula/minúscula.
    // Los strings aleatorios de bots tienen 4 o más transiciones caóticas.
    if (caseSwitches >= 3) {
      return true;
    }
  }

  return false;
}

/**
 * 4. Validador de contenido del mensaje contra texto spam o caracteres cirílicos
 */
export function isSpamContent(message: string): boolean {
  if (!message || typeof message !== 'string') return false;
  const lower = message.toLowerCase();

  // a) Caracteres cirílicos (rusos) o alfabetos no latinos típicos de spam masivo
  if (/[а-яА-ЯёЁ]/.test(message)) {
    return true;
  }

  // b) Múltiples enlaces web en el mensaje (>= 2 enlaces)
  const linkMatches = message.match(/https?:\/\//gi);
  if (linkMatches && linkMatches.length >= 2) {
    return true;
  }

  // c) Palabras clave explícitas de spam comercial
  for (const keyword of SPAM_KEYWORDS) {
    if (lower.includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * 5. Validador de correo contra dominios desechables
 */
export function isSpamEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return true;
  const trimmed = email.trim().toLowerCase();
  
  // Formato básico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return true;
  }

  const domain = trimmed.split('@')[1];
  if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true;
  }

  return false;
}

/**
 * 6. Rate Limiter en memoria por IP (máx 4 envíos por IP cada 10 minutos)
 */
export function checkRateLimit(ip: string, maxRequests = 4, windowMs = 10 * 60 * 1000): { allowed: boolean; remaining: number } {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1') {
    return { allowed: true, remaining: maxRequests };
  }

  const now = Date.now();
  const timestamps = (ipRequestHistory.get(ip) || []).filter(t => now - t < windowMs);

  if (timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  ipRequestHistory.set(ip, timestamps);

  // Limpieza periódica de IPs antiguas para evitar consumo de memoria
  if (ipRequestHistory.size > 2000) {
    for (const [key, times] of ipRequestHistory.entries()) {
      if (times.every(t => now - t >= windowMs)) {
        ipRequestHistory.delete(key);
      }
    }
  }

  return { allowed: true, remaining: maxRequests - timestamps.length };
}

/**
 * Función integradora que analiza todo el paquete de la solicitud
 */
export function evaluateFormSecurity(data: Record<string, any>, clientIp: string): { isSpam: boolean; reason?: string } {
  // 1. Honeypot
  if (isHoneypotTriggered(data)) {
    return { isSpam: true, reason: 'Honeypot field was filled' };
  }

  // 2. Velocidad de envío
  if (data._form_time && isSubmittedTooFast(data._form_time)) {
    return { isSpam: true, reason: 'Form submitted unnaturally fast (bot)' };
  }

  // 3. Patrón de nombre bot
  if (data.name && isBotName(data.name)) {
    return { isSpam: true, reason: 'Name matches bot pattern' };
  }

  // 4. Correo electrónico
  if (data.email && isSpamEmail(data.email)) {
    return { isSpam: true, reason: 'Email is invalid or disposable' };
  }

  // 5. Mensaje
  if (data.message && isSpamContent(data.message)) {
    return { isSpam: true, reason: 'Message contains spam patterns' };
  }

  // 6. Rate Limit por IP
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return { isSpam: true, reason: 'Too many requests from this IP' };
  }

  return { isSpam: false };
}
