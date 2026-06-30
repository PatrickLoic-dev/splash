'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'fr'

const T = {
  en: {
    /* ── Navbar ── */
    nav_learn:          'Learn',
    nav_start:          'Start learning',
    nav_beta:           'Beta',
    /* ── Home hero ── */
    home_badge:         'React · Next.js · Vue · React Native · Flutter',
    home_h1_line1:      'Learn animations',
    home_h1_that:       'that ',
    home_h1_line2:      'that ship.',
    home_sub:           'Ten fundamental animation patterns — each explained in depth and implemented for every major platform. No fluff. Production-grade code.',
    home_cta:           'Start learning',
    home_github:        'GitHub',
    /* ── Home patterns section ── */
    home_count_label:   '10 patterns',
    home_section_h2:    'The animations every app needs',
    /* ── Home footer ── */
    home_license:       'Open source — MIT License',
    home_star:          'Star on GitHub',
    /* ── Learn selector ── */
    sel_eyebrow:        'Choose your platform',
    sel_h1:             'What are you building?',
    sel_sub:            "Pick a platform and we'll show you exactly how to implement each animation pattern.",
    sel_web:            'Web',
    sel_mobile:         'Mobile',
    /* ── Learn filtered ── */
    filt_back:          '← All platforms',
    filt_patterns:      'patterns',
    filt_cta:           'View pattern →',
    filt_filter_label:  'Filters',
    filt_category:      'Category',
    filt_difficulty:    'Difficulty',
    filt_clear:         'Clear filters',
    filt_empty:         'No animations match the selected filters.',
    filt_of:            'of',
    /* ── Categories ── */
    cat_Entrance:       'Entrance',
    cat_Navigation:     'Navigation',
    cat_Scroll:         'Scroll',
    cat_Feedback:       'Feedback',
    cat_Loading:        'Loading',
    cat_List:           'List',
    cat_Carousel:       'Carousel',
    /* ── Mobile nav ── */
    nav_home:           'Home',
    /* ── Detail top bar ── */
    det_back:           '← Patterns',
    det_tab_preview:    'Preview',
    det_tab_learn:      'Learn',
    det_web:            'Web',
    det_mobile:         'Mobile',
    /* ── Detail sections ── */
    det_how:            'How it works',
    det_impl:           'Implementation',
    det_cases:          'Real-world examples',
    det_tips:           'Tips',
    det_deps:           'DEPS',
    det_replay:         '↺ Replay',
    det_copy:           'copy',
    det_copied:         '✓ copied',
    det_share:          'Share',
    det_shared:         '✓ Copied!',
    det_playground:     'Playground',
    det_no_impl:        'No implementation for this platform yet.',
    /* ── Favorites ── */
    fav_title:          'Favorites',
    /* ── Difficulty ── */
    diff_Beginner:      'Beginner',
    diff_Intermediate:  'Intermediate',
    diff_Advanced:      'Advanced',
  },
  fr: {
    /* ── Navbar ── */
    nav_learn:          'Apprendre',
    nav_start:          'Commencer',
    nav_beta:           'Bêta',
    /* ── Home hero ── */
    home_badge:         'React · Next.js · Vue · React Native · Flutter',
    home_h1_line1:      'Apprenez les animations',
    home_h1_that:       'qui ',
    home_h1_line2:      'qui passent en prod.',
    home_sub:           "Dix patterns d'animation fondamentaux — expliqués en profondeur et implémentés pour chaque plateforme majeure. Pas de bla-bla. Du code prêt pour la production.",
    home_cta:           'Commencer',
    home_github:        'GitHub',
    /* ── Home patterns section ── */
    home_count_label:   '10 patterns',
    home_section_h2:    'Les animations que chaque app doit avoir',
    /* ── Home footer ── */
    home_license:       'Open source — Licence MIT',
    home_star:          'Étoiler sur GitHub',
    /* ── Learn selector ── */
    sel_eyebrow:        'Choisissez votre plateforme',
    sel_h1:             'Qu\'est-ce que vous construisez ?',
    sel_sub:            "Choisissez une plateforme et nous vous montrerons exactement comment implémenter chaque pattern d'animation.",
    sel_web:            'Web',
    sel_mobile:         'Mobile',
    /* ── Learn filtered ── */
    filt_back:          '← Toutes les plateformes',
    filt_patterns:      'patterns',
    filt_cta:           'Voir le pattern →',
    filt_filter_label:  'Filtres',
    filt_category:      'Catégorie',
    filt_difficulty:    'Difficulté',
    filt_clear:         'Effacer les filtres',
    filt_empty:         'Aucune animation ne correspond aux filtres sélectionnés.',
    filt_of:            'sur',
    /* ── Categories ── */
    cat_Entrance:       'Entrée',
    cat_Navigation:     'Navigation',
    cat_Scroll:         'Défilement',
    cat_Feedback:       'Retour',
    cat_Loading:        'Chargement',
    cat_List:           'Liste',
    cat_Carousel:       'Carrousel',
    /* ── Mobile nav ── */
    nav_home:           'Accueil',
    /* ── Detail top bar ── */
    det_back:           '← Patterns',
    det_tab_preview:    'Aperçu',
    det_tab_learn:      'Apprendre',
    det_web:            'Web',
    det_mobile:         'Mobile',
    /* ── Detail sections ── */
    det_how:            'Comment ça fonctionne',
    det_impl:           'Implémentation',
    det_cases:          'Exemples réels',
    det_tips:           'Conseils',
    det_deps:           'DÉPENDANCES',
    det_replay:         '↺ Rejouer',
    det_copy:           'copier',
    det_copied:         '✓ copié',
    det_share:          'Partager',
    det_shared:         '✓ Copié !',
    det_playground:     'Playground',
    det_no_impl:        "Pas encore d'implémentation pour cette plateforme.",
    /* ── Favorites ── */
    fav_title:          'Favoris',
    /* ── Difficulty ── */
    diff_Beginner:      'Débutant',
    diff_Intermediate:  'Intermédiaire',
    diff_Advanced:      'Avancé',
  },
} as const

type TranslationKey = keyof typeof T.en

const I18nContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}>({
  lang:    'en',
  setLang: () => {},
  t:       (k) => T.en[k],
})

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem('splash-lang') as Lang | null
  if (saved === 'en' || saved === 'fr') return saved
  const browser = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase()
  return browser.startsWith('fr') ? 'fr' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    setLang(detectLang())
  }, [])

  const setLangPersisted = (l: Lang) => {
    localStorage.setItem('splash-lang', l)
    setLang(l)
  }

  const t = (key: TranslationKey): string => T[lang][key]
  return (
    <I18nContext.Provider value={{ lang, setLang: setLangPersisted, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
