import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(300);
  return [...productsData];
};

export const getById = async (id) => {
  await delay(250);
  const product = productsData.find(p => p.Id === parseInt(id));
  if (!product) {
    throw new Error(`Product with ID ${id} not found`);
  }
  return { ...product };
};

export const getByCategory = async (category) => {
  await delay(350);
  const filteredProducts = productsData.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  return [...filteredProducts];
};

export const getFilteredProducts = async (filters = {}) => {
  await delay(400);
  let filtered = [...productsData];

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => 
      filters.categories.some(cat => 
        p.category.toLowerCase().includes(cat.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(cat.toLowerCase())
      )
    );
  }

  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(p => 
      filters.brands.includes(p.brand)
    );
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter(p => 
      filters.sizes.some(size => p.sizes.includes(size))
    );
  }

  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter(p => 
      filters.colors.some(color => p.colors.includes(color))
    );
  }

  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    filtered = filtered.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= min && price <= max;
    });
  }

  // Sort products
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => b.Id - a.Id);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = a.discountPercent || 0;
          const discountB = b.discountPercent || 0;
          return discountB - discountA;
        });
        break;
      default:
        break;
    }
  }

  return filtered;
};

export const searchProducts = async (query) => {
  await delay(300);
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return [];

  const filtered = productsData.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.brand.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    p.subcategory.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm)
  );

  return [...filtered];
};

export const getFeaturedProducts = async () => {
  await delay(250);
  const featured = productsData
    .filter(p => p.rating >= 4.5)
    .slice(0, 8);
  return [...featured];
};

export const getSimilarProducts = async (productId, category) => {
  await delay(300);
  const similar = productsData
    .filter(p => p.Id !== parseInt(productId) && p.category === category)
    .slice(0, 4);
  return [...similar];
};

export const getAllBrands = async () => {
  await delay(200);
  const brands = [...new Set(productsData.map(p => p.brand))].sort();
  return brands;
};

export const getAllCategories = async () => {
  await delay(200);
  const categories = [...new Set(productsData.map(p => p.category))];
  const subcategories = [...new Set(productsData.map(p => p.subcategory))];
  return [...categories, ...subcategories].sort();
};