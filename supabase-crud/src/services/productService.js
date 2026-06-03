function productImageUrl(seed) {
  return `https://picsum.photos/seed/${seed}/400/400`;
}

let products = [
  {
    id: '1',
    name: 'Notebook Dell',
    description: 'Notebook para demonstração do CRUD.',
    price: 3500,
    quantity: 4,
    image: productImageUrl('notebook-dell'),
  },
  {
    id: '2',
    name: 'Mouse Logitech',
    description: 'Mouse sem fio para escritório.',
    price: 120,
    quantity: 15,
    image: productImageUrl('mouse-logitech'),
  },
  {
    id: '3',
    name: 'Teclado Mecânico',
    description: 'Teclado compacto com switches azuis.',
    price: 280,
    quantity: 8,
    image: productImageUrl('teclado-mecanico'),
  },
  {
    id: '4',
    name: 'Monitor LG 24"',
    description: 'Monitor Full HD para estação de trabalho.',
    price: 899.9,
    quantity: 6,
    image: productImageUrl('monitor-lg'),
  },
  {
    id: '5',
    name: 'Cadeira Ergonômica',
    description: 'Cadeira com apoio lombar e ajuste de altura.',
    price: 749.9,
    quantity: 5,
    image: productImageUrl('cadeira-ergonomica'),
  },
  {
    id: '6',
    name: 'Headset Gamer',
    description: 'Headset com microfone e som estéreo.',
    price: 199.9,
    quantity: 12,
    image: productImageUrl('headset-gamer'),
  },
  {
    id: '7',
    name: 'Webcam HD',
    description: 'Webcam para aulas, reuniões e gravações.',
    price: 159.9,
    quantity: 10,
    image: productImageUrl('webcam-hd'),
  },
  {
    id: '8',
    name: 'Hub USB-C',
    description: 'Adaptador com HDMI, USB e leitor de cartão.',
    price: 139.9,
    quantity: 18,
    image: productImageUrl('hub-usb-c'),
  },
  {
    id: '9',
    name: 'SSD 1TB',
    description: 'Armazenamento rápido para notebooks e desktops.',
    price: 429.9,
    quantity: 9,
    image: productImageUrl('ssd-1tb'),
  },
  {
    id: '10',
    name: 'Roteador Wi-Fi',
    description: 'Roteador dual band para redes domésticas.',
    price: 249.9,
    quantity: 7,
    image: productImageUrl('roteador-wifi'),
  },
  {
    id: '11',
    name: 'Impressora HP',
    description: 'Impressora multifuncional para escritório.',
    price: 699.9,
    quantity: 3,
    image: productImageUrl('impressora-hp'),
  },
  {
    id: '12',
    name: 'Tablet Samsung',
    description: 'Tablet para estudos, leitura e apresentações.',
    price: 1199.9,
    quantity: 4,
    image: productImageUrl('tablet-samsung'),
  },
  {
    id: '13',
    name: 'Suporte para Notebook',
    description: 'Suporte ajustável de alumínio para mesa.',
    price: 89.9,
    quantity: 20,
    image: productImageUrl('suporte-notebook'),
  },
  {
    id: '14',
    name: 'Microfone USB',
    description: 'Microfone condensador para aulas e podcasts.',
    price: 329.9,
    quantity: 6,
    image: productImageUrl('microfone-usb'),
  },
  {
    id: '15',
    name: 'Projetor Epson',
    description: 'Projetor portátil para sala de aula.',
    price: 2199.9,
    quantity: 2,
    image: productImageUrl('projetor-epson'),
  },
  {
    id: '16',
    name: 'Carregador USB-C',
    description: 'Carregador rápido de 65W para notebook.',
    price: 169.9,
    quantity: 14,
    image: productImageUrl('carregador-usb-c'),
  },
  {
    id: '17',
    name: 'Cabo HDMI',
    description: 'Cabo HDMI 2 metros para monitor e projetor.',
    price: 39.9,
    quantity: 25,
    image: productImageUrl('cabo-hdmi'),
  },
  {
    id: '18',
    name: 'Mousepad Grande',
    description: 'Mousepad estendido para teclado e mouse.',
    price: 59.9,
    quantity: 16,
    image: productImageUrl('mousepad-grande'),
  },
];

function parseCurrency(value) {
  if (typeof value === 'number') {
    return value;
  }

  const textValue = String(value).trim();

  if (textValue.includes(',')) {
    return Number(textValue.replace(/\./g, '').replace(',', '.'));
  }

  return Number(textValue);
}

export async function getProducts() {
  return products;
}

export async function getProductById(id) {
  return products.find((product) => product.id === id);
}

export async function createProduct(productData) {
  const product = {
    id: String(Date.now()),
    name: productData.name,
    description: productData.description,
    price: parseCurrency(productData.price),
    quantity: Number(productData.quantity),
    image: productData.image,
  };

  products = [product, ...products];
  return product;
}

export async function updateProduct(id, productData) {
  products = products.map((product) => {
    if (product.id !== id) {
      return product;
    }

    return {
      ...product,
      name: productData.name,
      description: productData.description,
      price: parseCurrency(productData.price),
      quantity: Number(productData.quantity),
      image: productData.image,
    };
  });

  return getProductById(id);
}

export async function deleteProduct(id) {
  products = products.filter((product) => product.id !== id);
  return true;
}
