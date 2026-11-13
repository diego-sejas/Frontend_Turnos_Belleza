import { imageUrl } from '../../services/images';

const CATEGORIES = [
  {
    key: 'barba',
    image: '/images/services/barba.jpg',
    alt: 'Barba y arreglo de barbería',
    match: ['barba', 'barber', 'afeit', 'bigote', 'beard'],
  },
  {
    key: 'tratamiento',
    image: '/images/services/tratamiento.jpg',
    alt: 'Tratamiento capilar realizado por una profesional',
    match: ['tratamiento', 'capilar', 'keratina', 'hidrat', 'nutri', 'alisad', 'botox', 'spa capilar'],
  },
  {
    key: 'color',
    image: '/images/services/color.jpg',
    alt: 'Aplicación de color y tintura en el cabello',
    match: ['color', 'tint', 'balayage', 'mecha', 'rubio', 'reflejo', 'decolor', 'ombr', 'highligh'],
  },
  {
    key: 'corte',
    image: '/images/services/corte.jpg',
    alt: 'Corte de cabello en salón',
    match: ['corte', 'cortar', 'flequillo', 'bob', 'pixie', 'shag', 'pelo', 'cabello'],
  },
];

export const getServiceImage = (service = {}) => {
  if (service.imageUrl) {
    return {
      src: imageUrl(service.imageUrl),
      alt: service.name ? `Imagen de ${service.name}` : 'Imagen del servicio',
      category: 'propia',
    };
  }

  const haystack = `${service.name || ''} ${service.description || ''}`.toLowerCase();

  const category = CATEGORIES.find((entry) =>
    entry.match.some((keyword) => haystack.includes(keyword)),
  );

  if (category) {
    return { src: category.image, alt: category.alt, category: category.key };
  }

  return { src: null, alt: '', category: 'generico' };
};
