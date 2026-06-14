import type { Lang } from './types'

export interface Translations {
  title: string
  subtitle: string
  widgetSize: string
  xlSize: string
  profiles: string
  contentAdjustments: string
  colorAdjustments: string
  pageStructure: string
  structureHeadings: string
  structureLandmarks: string
  structureLinks: string
  noStructureItems: string
  untitledHeading: string
  untitledLink: string
  resetAll: string
  close: string
  // Profiles
  seizureSafe: string
  visionImpaired: string
  adhdFriendly: string
  cognitiveDisability: string
  keyboardNavigation: string
  colorBlind: string
  dyslexia: string
  // Content
  legibleFonts: string
  dyslexiaFriendly: string
  highlightTitles: string
  fontSize: string
  textMagnifier: string
  readingLens: string
  bigCursor: string
  readingMask: string
  readingGuide: string
  highlightLinks: string
  lineHeight: string
  letterSpacing: string
  textAlign: string
  // Color
  darkContrast: string
  lightContrast: string
  highContrast: string
  monochrome: string
  invertColors: string
  hideImages: string
  offAnimations: string
  // Stepper
  default: string
  decrease: string
  increase: string
  // Align
  alignLeft: string
  alignCenter: string
  alignRight: string
}

const en: Translations = {
  title: 'React Accessibility Widget',
  subtitle: 'Accessibility Settings',
  widgetSize: 'Widget Size',
  xlSize: 'XL Size',
  profiles: 'Accessibility Profiles',
  contentAdjustments: 'Content Adjustments',
  colorAdjustments: 'Visual Adjustments',
  pageStructure: 'Page Structure',
  structureHeadings: 'Headings',
  structureLandmarks: 'Landmarks',
  structureLinks: 'Links',
  noStructureItems: 'No items found.',
  untitledHeading: 'Untitled heading',
  untitledLink: 'Untitled link',
  resetAll: 'Reset all settings',
  close: 'Close accessibility menu',
  seizureSafe: 'Seizure Safe',
  visionImpaired: 'Vision Impaired',
  adhdFriendly: 'ADHD Friendly',
  cognitiveDisability: 'Cognitive Disability',
  keyboardNavigation: 'Keyboard Navigation',
  colorBlind: 'Color Blind',
  dyslexia: 'Dyslexia',
  legibleFonts: 'Legible Fonts',
  dyslexiaFriendly: 'Dyslexia Friendly',
  highlightTitles: 'Highlight Titles',
  fontSize: 'Font Size',
  textMagnifier: 'Text Magnifier',
  readingLens: 'Reading Lens',
  bigCursor: 'Big Cursor',
  readingMask: 'Reading Mask',
  readingGuide: 'Reading Guide',
  highlightLinks: 'Highlight Links',
  lineHeight: 'Line Height',
  letterSpacing: 'Letter Spacing',
  textAlign: 'Text Align',
  darkContrast: 'Dark Contrast',
  lightContrast: 'Light Contrast',
  highContrast: 'High Contrast',
  monochrome: 'Monochrome',
  invertColors: 'Invert Colors',
  hideImages: 'Hide Images',
  offAnimations: 'Reduce Animations',
  default: 'Default',
  decrease: 'Decrease',
  increase: 'Increase',
  alignLeft: 'Align left',
  alignCenter: 'Align center',
  alignRight: 'Align right',
}

const es: Translations = {
  title: 'React Accessibility Widget',
  subtitle: 'Configuración de Accesibilidad',
  widgetSize: 'Tamaño del Widget',
  xlSize: 'Tamaño XL',
  profiles: 'Perfiles de Accesibilidad',
  contentAdjustments: 'Ajustes de Contenido',
  colorAdjustments: 'Ajustes Visuales',
  pageStructure: 'Estructura de Página',
  structureHeadings: 'Encabezados',
  structureLandmarks: 'Puntos de Referencia',
  structureLinks: 'Enlaces',
  noStructureItems: 'No se encontraron elementos.',
  untitledHeading: 'Encabezado sin título',
  untitledLink: 'Enlace sin título',
  resetAll: 'Restablecer configuración',
  close: 'Cerrar menú de accesibilidad',
  seizureSafe: 'Seguro para Convulsiones',
  visionImpaired: 'Visión Reducida',
  adhdFriendly: 'TDAH Amigable',
  cognitiveDisability: 'Discapacidad Cognitiva',
  keyboardNavigation: 'Navegación por Teclado',
  colorBlind: 'Daltonismo',
  dyslexia: 'Dislexia',
  legibleFonts: 'Fuentes Legibles',
  dyslexiaFriendly: 'Amigable para Dislexia',
  highlightTitles: 'Resaltar Títulos',
  fontSize: 'Tamaño de Fuente',
  textMagnifier: 'Lupa de Texto',
  readingLens: 'Lente de Lectura',
  bigCursor: 'Cursor Grande',
  readingMask: 'Máscara de Lectura',
  readingGuide: 'Guía de Lectura',
  highlightLinks: 'Resaltar Enlaces',
  lineHeight: 'Altura de Línea',
  letterSpacing: 'Espaciado de Letras',
  textAlign: 'Alineación de Texto',
  darkContrast: 'Contraste Oscuro',
  lightContrast: 'Contraste Claro',
  highContrast: 'Alto Contraste',
  monochrome: 'Monocromático',
  invertColors: 'Invertir Colores',
  hideImages: 'Ocultar Imágenes',
  offAnimations: 'Reducir Animaciones',
  default: 'Predeterminado',
  decrease: 'Disminuir',
  increase: 'Aumentar',
  alignLeft: 'Alinear izquierda',
  alignCenter: 'Centrar',
  alignRight: 'Alinear derecha',
}

const fr: Translations = {
  title: 'React Accessibility Widget',
  subtitle: "Paramètres d'Accessibilité",
  widgetSize: 'Taille du Widget',
  xlSize: 'Taille XL',
  profiles: "Profils d'Accessibilité",
  contentAdjustments: 'Ajustements du Contenu',
  colorAdjustments: 'Ajustements Visuels',
  pageStructure: 'Structure de Page',
  structureHeadings: 'Titres',
  structureLandmarks: 'Repères',
  structureLinks: 'Liens',
  noStructureItems: 'Aucun élément trouvé.',
  untitledHeading: 'Titre sans nom',
  untitledLink: 'Lien sans nom',
  resetAll: 'Réinitialiser les paramètres',
  close: "Fermer le menu d'accessibilité",
  seizureSafe: 'Sûr pour Épilepsie',
  visionImpaired: 'Déficience Visuelle',
  adhdFriendly: 'TDAH Adapté',
  cognitiveDisability: 'Handicap Cognitif',
  keyboardNavigation: 'Navigation Clavier',
  colorBlind: 'Daltonisme',
  dyslexia: 'Dyslexie',
  legibleFonts: 'Polices Lisibles',
  dyslexiaFriendly: 'Adapté à la Dyslexie',
  highlightTitles: 'Surligner les Titres',
  fontSize: 'Taille de Police',
  textMagnifier: 'Loupe de Texte',
  readingLens: 'Loupe de Lecture',
  bigCursor: 'Grand Curseur',
  readingMask: 'Masque de Lecture',
  readingGuide: 'Guide de Lecture',
  highlightLinks: 'Surligner les Liens',
  lineHeight: 'Hauteur de Ligne',
  letterSpacing: 'Espacement des Lettres',
  textAlign: 'Alignement du Texte',
  darkContrast: 'Contraste Sombre',
  lightContrast: 'Contraste Clair',
  highContrast: 'Contraste Élevé',
  monochrome: 'Monochrome',
  invertColors: 'Inverser les Couleurs',
  hideImages: 'Masquer les Images',
  offAnimations: 'Réduire les Animations',
  default: 'Défaut',
  decrease: 'Diminuer',
  increase: 'Augmenter',
  alignLeft: 'Aligner à gauche',
  alignCenter: 'Centrer',
  alignRight: 'Aligner à droite',
}

const de: Translations = {
  title: 'React Accessibility Widget',
  subtitle: 'Barrierefreiheitseinstellungen',
  widgetSize: 'Widget-Größe',
  xlSize: 'XL-Größe',
  profiles: 'Barrierefreiheitsprofile',
  contentAdjustments: 'Inhaltsanpassungen',
  colorAdjustments: 'Visuelle Anpassungen',
  pageStructure: 'Seitenstruktur',
  structureHeadings: 'Überschriften',
  structureLandmarks: 'Landmarken',
  structureLinks: 'Links',
  noStructureItems: 'Keine Elemente gefunden.',
  untitledHeading: 'Unbenannte Überschrift',
  untitledLink: 'Unbenannter Link',
  resetAll: 'Alle Einstellungen zurücksetzen',
  close: 'Barrierefreiheitsmenü schließen',
  seizureSafe: 'Anfallssicher',
  visionImpaired: 'Sehbehinderung',
  adhdFriendly: 'ADHS-freundlich',
  cognitiveDisability: 'Kognitive Behinderung',
  keyboardNavigation: 'Tastaturnavigation',
  colorBlind: 'Farbenblindheit',
  dyslexia: 'Legasthenie',
  legibleFonts: 'Lesbare Schriften',
  dyslexiaFriendly: 'Legasthenie-freundlich',
  highlightTitles: 'Überschriften hervorheben',
  fontSize: 'Schriftgröße',
  textMagnifier: 'Textlupe',
  readingLens: 'Leselupe',
  bigCursor: 'Großer Cursor',
  readingMask: 'Lesemaske',
  readingGuide: 'Lesehilfe',
  highlightLinks: 'Links hervorheben',
  lineHeight: 'Zeilenhöhe',
  letterSpacing: 'Zeichenabstand',
  textAlign: 'Textausrichtung',
  darkContrast: 'Dunkler Kontrast',
  lightContrast: 'Heller Kontrast',
  highContrast: 'Hoher Kontrast',
  monochrome: 'Monochrom',
  invertColors: 'Farben invertieren',
  hideImages: 'Bilder ausblenden',
  offAnimations: 'Animationen reduzieren',
  default: 'Standard',
  decrease: 'Verringern',
  increase: 'Erhöhen',
  alignLeft: 'Linksbündig',
  alignCenter: 'Zentriert',
  alignRight: 'Rechtsbündig',
}

const pt: Translations = {
  title: 'React Accessibility Widget',
  subtitle: 'Configurações de Acessibilidade',
  widgetSize: 'Tamanho do Widget',
  xlSize: 'Tamanho XL',
  profiles: 'Perfis de Acessibilidade',
  contentAdjustments: 'Ajustes de Conteúdo',
  colorAdjustments: 'Ajustes Visuais',
  pageStructure: 'Estrutura da Página',
  structureHeadings: 'Títulos',
  structureLandmarks: 'Marcos',
  structureLinks: 'Links',
  noStructureItems: 'Nenhum item encontrado.',
  untitledHeading: 'Título sem nome',
  untitledLink: 'Link sem nome',
  resetAll: 'Redefinir todas as configurações',
  close: 'Fechar menu de acessibilidade',
  seizureSafe: 'Seguro para Convulsões',
  visionImpaired: 'Deficiência Visual',
  adhdFriendly: 'Amigável para TDAH',
  cognitiveDisability: 'Deficiência Cognitiva',
  keyboardNavigation: 'Navegação por Teclado',
  colorBlind: 'Daltonismo',
  dyslexia: 'Dislexia',
  legibleFonts: 'Fontes Legíveis',
  dyslexiaFriendly: 'Amigável para Dislexia',
  highlightTitles: 'Destacar Títulos',
  fontSize: 'Tamanho da Fonte',
  textMagnifier: 'Lupa de Texto',
  readingLens: 'Lupa de Leitura',
  bigCursor: 'Cursor Grande',
  readingMask: 'Máscara de Leitura',
  readingGuide: 'Guia de Leitura',
  highlightLinks: 'Destacar Links',
  lineHeight: 'Altura da Linha',
  letterSpacing: 'Espaçamento de Letras',
  textAlign: 'Alinhamento de Texto',
  darkContrast: 'Contraste Escuro',
  lightContrast: 'Contraste Claro',
  highContrast: 'Alto Contraste',
  monochrome: 'Monocromático',
  invertColors: 'Inverter Cores',
  hideImages: 'Ocultar Imagens',
  offAnimations: 'Reduzir Animações',
  default: 'Padrão',
  decrease: 'Diminuir',
  increase: 'Aumentar',
  alignLeft: 'Alinhar à esquerda',
  alignCenter: 'Centralizar',
  alignRight: 'Alinhar à direita',
}

const ar: Translations = {
  title: 'React Accessibility Widget',
  subtitle: 'إعدادات إمكانية الوصول',
  widgetSize: 'حجم الأداة',
  xlSize: 'حجم XL',
  profiles: 'ملفات إمكانية الوصول',
  contentAdjustments: 'تعديلات المحتوى',
  colorAdjustments: 'تعديلات مرئية',
  pageStructure: 'بنية الصفحة',
  structureHeadings: 'العناوين',
  structureLandmarks: 'المعالم',
  structureLinks: 'الروابط',
  noStructureItems: 'لم يتم العثور على عناصر.',
  untitledHeading: 'عنوان بدون اسم',
  untitledLink: 'رابط بدون اسم',
  resetAll: 'إعادة تعيين جميع الإعدادات',
  close: 'إغلاق قائمة إمكانية الوصول',
  seizureSafe: 'آمن للصرع',
  visionImpaired: 'ضعف البصر',
  adhdFriendly: 'مناسب لـ ADHD',
  cognitiveDisability: 'إعاقة معرفية',
  keyboardNavigation: 'التنقل بلوحة المفاتيح',
  colorBlind: 'عمى الألوان',
  dyslexia: 'عسر القراءة',
  legibleFonts: 'خطوط مقروءة',
  dyslexiaFriendly: 'مناسب لعسر القراءة',
  highlightTitles: 'تمييز العناوين',
  fontSize: 'حجم الخط',
  textMagnifier: 'مكبر النص',
  readingLens: 'عدسة القراءة',
  bigCursor: 'مؤشر كبير',
  readingMask: 'قناع القراءة',
  readingGuide: 'دليل القراءة',
  highlightLinks: 'تمييز الروابط',
  lineHeight: 'ارتفاع السطر',
  letterSpacing: 'تباعد الحروف',
  textAlign: 'محاذاة النص',
  darkContrast: 'تباين داكن',
  lightContrast: 'تباين فاتح',
  highContrast: 'تباين عالٍ',
  monochrome: 'أحادي اللون',
  invertColors: 'عكس الألوان',
  hideImages: 'إخفاء الصور',
  offAnimations: 'تقليل الحركات',
  default: 'افتراضي',
  decrease: 'تقليل',
  increase: 'زيادة',
  alignLeft: 'محاذاة يسار',
  alignCenter: 'توسيط',
  alignRight: 'محاذاة يمين',
}

const TRANSLATIONS: Record<Lang, Translations> = { en, es, fr, de, pt, ar }

export function getTranslations(lang: Lang = 'en'): Translations {
  return TRANSLATIONS[lang] ?? en
}
