export const OFFERS = [
  { 
    id: 1,  
    titulo: 'SSD NVMe Kingston 1TB NV2 M.2 2280', 
    preco: 369.90,  
    precoOriginal: 479.00,  
    desconto: 23, 
    categoria: 'Storage',    
    foto: 'https://http2.mlstatic.com/D_NQ_NP_960534-MLA52538161555_112022-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB19914434' 
  },
  { 
    id: 2,  
    titulo: 'Placa de Vídeo RX 6600 8GB GDDR6', 
    preco: 1399.00, 
    precoOriginal: 1899.00, 
    desconto: 26, 
    categoria: 'GPU',        
    foto: 'https://http2.mlstatic.com/D_NQ_NP_608147-MLA51445778107_092022-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB18544831' 
  },
  { 
    id: 3,  
    titulo: 'Memória RAM Kingston Fury Beast 16GB 3200MHz', 
    preco: 299.90,  
    precoOriginal: 389.00,  
    desconto: 23, 
    categoria: 'Memória',    
    foto: 'https://http2.mlstatic.com/D_NQ_NP_657930-MLA47101851214_082021-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB18197171' 
  },
  { 
    id: 4,  
    titulo: 'Processador AMD Ryzen 5 5600G AM4', 
    preco: 849.00,  
    precoOriginal: 1149.00, 
    desconto: 26, 
    categoria: 'CPU',        
    foto: 'https://http2.mlstatic.com/D_NQ_NP_612261-MLA46777651030_072021-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB17845341' 
  },
  { 
    id: 5,  
    titulo: 'Monitor Gamer LG UltraGear 24" 144Hz IPS', 
    preco: 899.00,  
    precoOriginal: 1199.00, 
    desconto: 25, 
    categoria: 'Monitor',   
    foto: 'https://http2.mlstatic.com/D_NQ_NP_725656-MLA52086326164_102022-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB19574495' 
  },
  { 
    id: 6,  
    titulo: 'Fonte Corsair CV650 650W 80 Plus Bronze', 
    preco: 389.00,  
    precoOriginal: 499.00,  
    desconto: 22, 
    categoria: 'Fonte',     
    foto: 'https://http2.mlstatic.com/D_NQ_NP_900669-MLA43403310317_092020-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB16139943' 
  },
  { 
    id: 7,  
    titulo: 'Air Cooler DeepCool AK400 Zero Dark', 
    preco: 169.00,  
    precoOriginal: 229.00,  
    desconto: 26, 
    categoria: 'Cooling',   
    foto: 'https://http2.mlstatic.com/D_NQ_NP_931932-MLA51479860438_092022-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB19515901' 
  },
  { 
    id: 8,  
    titulo: 'Gabinete Cooler Master MasterBox Q300L', 
    preco: 299.00,  
    precoOriginal: 399.00,  
    desconto: 25, 
    categoria: 'Gabinete',  
    foto: 'https://http2.mlstatic.com/D_NQ_NP_600868-MLA31121303831_062019-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB11612411' 
  },
  { 
    id: 9,  
    titulo: 'Teclado Mecânico Redragon Kumara K552 RGB', 
    preco: 229.00,  
    precoOriginal: 299.00,  
    desconto: 23, 
    categoria: 'Periférico',
    foto: 'https://http2.mlstatic.com/D_NQ_NP_787595-MLA41443621437_042020-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB15512211' 
  },
  { 
    id: 10, 
    titulo: 'Mouse Gamer Logitech G305 LIGHTSPEED', 
    preco: 249.00,  
    precoOriginal: 349.00,  
    desconto: 28, 
    categoria: 'Periférico',
    foto: 'https://http2.mlstatic.com/D_NQ_NP_612711-MLA41443421447_042020-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB15494211' 
  },
  { 
    id: 11, 
    titulo: 'Headset Gamer HyperX Cloud Alpha S 7.1', 
    preco: 599.00,  
    precoOriginal: 849.00,  
    desconto: 29, 
    categoria: 'Periférico',
    foto: 'https://http2.mlstatic.com/D_NQ_NP_638363-MLA41443121511_042020-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB15474211' 
  },
  { 
    id: 12, 
    titulo: 'Placa-Mãe MSI B550M Pro-VDH WIFI', 
    preco: 799.00,  
    precoOriginal: 999.00,  
    desconto: 20, 
    categoria: 'Motherboard',
    foto:'https://http2.mlstatic.com/D_NQ_NP_824141-MLA46610311025_072021-O.webp', 
    link: 'https://www.mercadolivre.com.br/p/MLB17781441' 
  },
];

export const CATEGORIAS = ['Todos', ...new Set(OFFERS.map(o => o.categoria))];