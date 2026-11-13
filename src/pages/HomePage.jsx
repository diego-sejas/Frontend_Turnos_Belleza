import { Box } from '@mui/material';
import HeroSection from '../components/home/HeroSection';
import FeaturedServices from '../components/home/FeaturedServices';
import FeaturedProfessionals from '../components/home/FeaturedProfessionals';
import WorksGallery from '../components/home/WorksGallery';
import BookingCta from '../components/home/BookingCta';
import { useHomeCatalog } from '../hooks/useHomeCatalog';

const HomePage = () => {
  const { services, professionals, loading, servicesError, professionalsError, refetch } =
    useHomeCatalog();

  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <HeroSection />
      <FeaturedServices
        services={services}
        loading={loading}
        error={servicesError}
        onRetry={refetch}
      />
      <FeaturedProfessionals
        professionals={professionals}
        loading={loading}
        error={professionalsError}
        onRetry={refetch}
      />
      <WorksGallery />
      <BookingCta />
    </Box>
  );
};

export default HomePage;
