import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeModeContext';

const ThemeToggle = ({ color = 'inherit', size = 'medium', sx }) => {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <Tooltip title={label}>
      <IconButton color={color} size={size} onClick={toggleMode} aria-label={label} sx={sx}>
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
