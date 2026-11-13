import { createTheme } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Design tokens - Sistema Belleza
// Dos identidades:
//   - Editorial Spa (claro):  marfil, beige cálido, champagne y dorado.
//   - Luxury Noir (oscuro):   espresso profundo, negro suave, champagne y oro antiguo.
// ---------------------------------------------------------------------------
const shared = {
  gold: '#B98A4B',
  goldLight: '#D2AC72',
  goldDark: '#9A7139',
  goldDeep: '#7E5A2B',
  champagne: '#E8D5B5',
  espresso: '#2A2622',
  espressoLight: '#4A423A',
  espressoDark: '#1C1916',
  sage: '#4F7A55',
  amber: '#B07A2A',
  terracotta: '#A64B3C',
};

const serifDisplay = '"Cormorant Garamond", Georgia, "Times New Roman", serif';
const sansUi = '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';

const baseShadows = [
  'none',
  '0 1px 2px rgba(42, 38, 32, 0.05)',
  '0 2px 6px -1px rgba(42, 38, 32, 0.08)',
  '0 6px 14px -4px rgba(42, 38, 32, 0.10)',
  '0 12px 24px -8px rgba(42, 38, 32, 0.12)',
  '0 20px 40px -12px rgba(42, 38, 32, 0.14)',
  '0 28px 56px -16px rgba(42, 38, 32, 0.16)',
];
const shadows = [...baseShadows, ...Array(25 - baseShadows.length).fill(baseShadows[6])];

// --- Paletas por modo -------------------------------------------------------
const lightPalette = {
  mode: 'light',
  primary: {
    main: shared.gold,
    light: shared.goldLight,
    dark: shared.goldDark,
    contrastText: shared.espresso,
  },
  secondary: {
    main: shared.espresso,
    light: shared.espressoLight,
    dark: shared.espressoDark,
    contrastText: '#FBF7F0',
  },
  background: { default: '#FBF7F0', paper: '#FFFFFF' },
  text: { primary: shared.espresso, secondary: '#6E655B', disabled: '#9A9086' },
  divider: 'rgba(42, 38, 32, 0.10)',
  success: { main: shared.sage, light: '#6B9A70', dark: '#3C5F41' },
  warning: { main: shared.amber, light: '#D19A45', dark: '#8A5E1E' },
  error: { main: shared.terracotta, light: '#C56B5C', dark: '#823729' },
  info: { main: '#6E655B', light: '#A79A88', dark: shared.espressoLight },
  custom: {
    surfaceAlt: '#F1E8DA',
    surfaceBadge: '#E7DBC8',
    border: 'rgba(42, 38, 32, 0.08)',
    borderStrong: 'rgba(42, 38, 32, 0.16)',
    borderGold: 'rgba(185, 138, 75, 0.24)',
    link: shared.goldDeep,
    footerBg: '#2A2622',
    footerText: 'rgba(255, 255, 255, 0.8)',
    appBarBg: '#FFFFFF',
    drawerBg1: '#FFFFFF',
    drawerBg2: '#FBF7F0',
    tableHeadBg: '#F1E8DA',
    rowHover: 'rgba(241, 232, 218, 0.55)',
    menuHover: 'rgba(241, 232, 218, 0.7)',
    selectedBg: 'rgba(232, 213, 181, 0.5)',
    selectedHover: 'rgba(232, 213, 181, 0.7)',
    inputBg: '#FBF7F0',
    inputFocusBg: '#FFFFFF',
    scrollTrack: '#F1E8DA',
    scrollThumb: 'rgba(154, 113, 57, 0.35)',
    scrollThumbHover: 'rgba(154, 113, 57, 0.55)',
    selection: 'rgba(185, 138, 75, 0.28)',
    focusRing: shared.goldDark,
    alertSuccessBg: '#EFF5EC',
    alertSuccessFg: '#3C5F41',
    alertErrorBg: '#F8ECEA',
    alertErrorFg: '#823729',
    alertWarningBg: '#FAF2E3',
    alertWarningFg: '#8A5E1E',
    alertInfoBg: '#F1E8DA',
    alertInfoFg: '#4A423A',
    iconMuted: '#9A9086',
    cardBorder: 'rgba(42, 38, 32, 0.07)',
    cardShadow: '0 10px 30px -18px rgba(42, 38, 32, 0.28)',
    dialogShadow: '0 30px 60px -24px rgba(42, 38, 32, 0.45)',
    menuShadow: '0 18px 40px -20px rgba(42, 38, 32, 0.4)',
    buttonShadow: '0 6px 16px -8px rgba(154, 113, 57, 0.55)',
    buttonShadowHover: '0 10px 22px -8px rgba(154, 113, 57, 0.6)',
    gradientGold: 'linear-gradient(135deg, #C79A57 0%, #A87A3C 100%)',
    gradientGoldHover: 'linear-gradient(135deg, #B98A4B 0%, #8F652D 100%)',
    gradientEspresso: 'linear-gradient(135deg, #2A2622 0%, #4A423A 100%)',
    heroGradient: 'linear-gradient(135deg, #2A2622 0%, #4A423A 50%, #1C1916 100%)',
    glow: 'radial-gradient(1100px 460px at 50% -8%, rgba(232, 213, 181, 0.55) 0%, rgba(251, 247, 240, 0) 62%)',
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#D2AC72',
    light: '#E8D5B5',
    dark: '#B98A4B',
    contrastText: '#1C1916',
  },
  secondary: {
    main: shared.champagne,
    light: '#F3EBDD',
    dark: '#C79A57',
    contrastText: '#1C1916',
  },
  background: { default: '#12100E', paper: '#1C1916' },
  text: { primary: '#F2E9DB', secondary: '#B6AC9D', disabled: '#7E766A' },
  divider: 'rgba(232, 213, 181, 0.14)',
  success: { main: '#7FB98A', light: '#9ECBA6', dark: '#5F9A6A' },
  warning: { main: '#D9A24E', light: '#E7C07E', dark: '#B07A2A' },
  error: { main: '#DB8A7C', light: '#E6A99E', dark: '#A64B3C' },
  info: { main: '#B6AC9D', light: '#D2C7B5', dark: '#8A8175' },
  custom: {
    surfaceAlt: '#241F19',
    surfaceBadge: '#2E2822',
    border: 'rgba(232, 213, 181, 0.10)',
    borderStrong: 'rgba(232, 213, 181, 0.22)',
    borderGold: 'rgba(210, 172, 114, 0.30)',
    link: '#D2AC72',
    footerBg: '#0E0C0A',
    footerText: 'rgba(242, 233, 219, 0.72)',
    appBarBg: '#1C1916',
    drawerBg1: '#1C1916',
    drawerBg2: '#141210',
    tableHeadBg: '#241F19',
    rowHover: 'rgba(210, 172, 114, 0.06)',
    menuHover: 'rgba(210, 172, 114, 0.10)',
    selectedBg: 'rgba(210, 172, 114, 0.14)',
    selectedHover: 'rgba(210, 172, 114, 0.20)',
    inputBg: '#1C1916',
    inputFocusBg: '#241F19',
    scrollTrack: '#141210',
    scrollThumb: 'rgba(210, 172, 114, 0.30)',
    scrollThumbHover: 'rgba(210, 172, 114, 0.5)',
    selection: 'rgba(210, 172, 114, 0.30)',
    focusRing: '#D2AC72',
    alertSuccessBg: 'rgba(79, 122, 85, 0.18)',
    alertSuccessFg: '#A9D3B0',
    alertErrorBg: 'rgba(164, 75, 60, 0.20)',
    alertErrorFg: '#E6A99E',
    alertWarningBg: 'rgba(176, 122, 42, 0.20)',
    alertWarningFg: '#E7C07E',
    alertInfoBg: 'rgba(210, 172, 114, 0.12)',
    alertInfoFg: '#E0CFB0',
    iconMuted: '#8A8175',
    cardBorder: 'rgba(232, 213, 181, 0.10)',
    cardShadow: '0 10px 30px -18px rgba(0, 0, 0, 0.6)',
    dialogShadow: '0 30px 60px -24px rgba(0, 0, 0, 0.7)',
    menuShadow: '0 18px 40px -20px rgba(0, 0, 0, 0.65)',
    buttonShadow: '0 6px 16px -8px rgba(210, 172, 114, 0.45)',
    buttonShadowHover: '0 10px 22px -8px rgba(210, 172, 114, 0.55)',
    gradientGold: 'linear-gradient(135deg, #D2AC72 0%, #B98A4B 100%)',
    gradientGoldHover: 'linear-gradient(135deg, #E0C089 0%, #C79A57 100%)',
    gradientEspresso: 'linear-gradient(135deg, #1C1916 0%, #2A2622 100%)',
    heroGradient: 'linear-gradient(135deg, #1C1916 0%, #2A2622 50%, #0E0C0A 100%)',
    glow: 'radial-gradient(1100px 460px at 50% -8%, rgba(210, 172, 114, 0.16) 0%, rgba(18, 16, 14, 0) 62%)',
  },
};

const typography = {
  fontFamily: sansUi,
  h1: { fontFamily: serifDisplay, fontSize: '2.75rem', fontWeight: 600, lineHeight: 1.15, letterSpacing: '0.005em' },
  h2: { fontFamily: serifDisplay, fontSize: '2.25rem', fontWeight: 600, lineHeight: 1.2, letterSpacing: '0.005em' },
  h3: { fontFamily: serifDisplay, fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.25 },
  h4: { fontFamily: serifDisplay, fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
  h5: { fontFamily: serifDisplay, fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },
  h6: { fontFamily: serifDisplay, fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  subtitle1: { fontFamily: sansUi, fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontFamily: sansUi, fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.5 },
  body1: { fontFamily: sansUi, fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontFamily: sansUi, fontSize: '0.875rem', lineHeight: 1.6 },
  button: { fontFamily: sansUi, textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  caption: { fontFamily: sansUi, fontSize: '0.75rem', lineHeight: 1.5 },
  overline: { fontFamily: sansUi, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 },
};

function buildComponents(p) {
  const c = p.custom;
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: p.background.default,
          color: p.text.primary,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': { backgroundColor: c.selection },
        ':focus-visible': { outline: `2px solid ${c.focusRing}`, outlineOffset: 2 },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-track': { backgroundColor: c.scrollTrack },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: c.scrollThumb,
          borderRadius: 8,
          border: `2px solid ${c.scrollTrack}`,
        },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: c.scrollThumbHover },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12, padding: '11px 24px', fontSize: '0.9375rem', fontWeight: 600 },
        contained: {
          boxShadow: c.buttonShadow,
          '&:hover': { boxShadow: c.buttonShadowHover, transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: c.gradientGold,
          color: p.primary.contrastText,
          '&:hover': { background: c.gradientGoldHover },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: c.borderGold,
          color: p.text.primary,
          '&:hover': {
            borderWidth: 1.5,
            borderColor: p.primary.dark,
            backgroundColor: c.menuHover,
          },
        },
        text: {
          color: c.link,
          '&:hover': { backgroundColor: c.menuHover },
        },
        sizeLarge: { padding: '14px 30px', fontSize: '1rem' },
        sizeSmall: { padding: '7px 16px', fontSize: '0.8125rem' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover': { backgroundColor: c.menuHover },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: `1px solid ${c.cardBorder}`,
          boxShadow: c.cardShadow,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 32, '&:last-child': { paddingBottom: 32 } },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: c.appBarBg,
          color: p.text.primary,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          borderBottom: `1px solid ${p.divider}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${p.divider}`,
          backgroundImage: `linear-gradient(180deg, ${c.drawerBg1} 0%, ${c.drawerBg2} 100%)`,
          boxShadow: c.menuShadow,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: c.inputBg,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: c.borderStrong },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: p.text.disabled },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: p.primary.dark,
          },
          '&.Mui-focused': {
            backgroundColor: c.inputFocusBg,
            boxShadow: `0 0 0 3px ${c.selection}`,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: p.error.main },
        },
        input: { padding: '14px 14px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: p.text.secondary,
          '&.Mui-focused': { color: p.primary.dark },
        },
      },
    },
    MuiTableContainer: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiTable: { styleOverrides: { root: { borderCollapse: 'separate' } } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: c.tableHeadBg,
            color: p.text.primary,
            fontWeight: 600,
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            borderBottom: `1px solid ${p.divider}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${p.divider}`, padding: '14px 16px' },
        body: { color: p.text.secondary },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: c.rowHover },
          '&:last-child .MuiTableCell-root': { borderBottom: 'none' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        outlined: { borderColor: c.borderGold },
      },
    },
    MuiAlert: {
      defaultProps: { variant: 'standard' },
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: c.cardShadow },
        standardSuccess: { backgroundColor: c.alertSuccessBg, color: c.alertSuccessFg },
        standardError: { backgroundColor: c.alertErrorBg, color: c.alertErrorFg },
        standardWarning: { backgroundColor: c.alertWarningBg, color: c.alertWarningFg },
        standardInfo: { backgroundColor: c.alertInfoBg, color: c.alertInfoFg },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: c.link,
          fontWeight: 600,
          textDecorationColor: c.borderGold,
          '&:hover': { color: p.primary.dark },
        },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: p.divider } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${c.border}`,
          boxShadow: c.menuShadow,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: c.menuHover },
          '&.Mui-selected': {
            backgroundColor: c.selectedBg,
            '&:hover': { backgroundColor: c.selectedHover },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 0',
          color: p.text.secondary,
          '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 },
          '&:hover': { backgroundColor: c.menuHover, color: p.text.primary },
          '&.Mui-selected': {
            backgroundColor: c.selectedBg,
            color: p.text.primary,
            '& .MuiListItemIcon-root': { color: p.primary.dark },
            '&:hover': { backgroundColor: c.selectedHover },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: p.text.primary,
          color: p.background.paper,
          fontSize: '0.75rem',
          borderRadius: 8,
          padding: '6px 10px',
        },
        arrow: { color: p.text.primary },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, boxShadow: c.dialogShadow },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontFamily: serifDisplay, fontSize: '1.5rem', fontWeight: 600, color: p.text.primary },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: c.borderStrong,
          '&.Mui-checked': { color: p.primary.dark },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { color: p.text.secondary, borderBottom: 'none' },
        selectIcon: { color: p.text.secondary },
      },
    },
  };
}

export function createAppTheme(mode = 'light') {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  return createTheme({
    palette,
    typography,
    shape: { borderRadius: 12 },
    shadows,
    components: buildComponents(palette),
  });
}

export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');
export default lightTheme;
