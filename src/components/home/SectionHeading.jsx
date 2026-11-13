import { Box, Typography } from '@mui/material';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <Box
    sx={{
      textAlign: align,
      maxWidth: 680,
      mx: align === 'center' ? 'auto' : 0,
      mb: { xs: 3, md: 4.5 },
    }}
  >
    {eyebrow && (
      <Typography
        variant="overline"
        component="p"
        sx={{
          color: 'primary.main',
          letterSpacing: '0.18em',
          fontWeight: 600,
          fontSize: '0.6875rem',
          mb: 0.5,
        }}
      >
        {eyebrow}
      </Typography>
    )}
    <Typography
      variant="h3"
      component="h2"
      sx={{ fontSize: { xs: '1.4rem', md: '1.55rem' }, fontWeight: 600, lineHeight: 1.15, color: 'text.primary' }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mt: 1,
          maxWidth: 560,
          mx: align === 'center' ? 'auto' : 0,
        }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default SectionHeading;
