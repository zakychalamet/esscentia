import Link from 'next/link';
import { Product } from '@/lib/products';
import { Star } from 'lucide-react';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden h-80 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Bestseller Badge */}
          {product.isBestseller && (
            <div className="absolute top-4 right-4 bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded">
              BESTSELLER
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Family Tag */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {product.family}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 flex-1">
            {product.name}
          </h3>

          {/* Intensity */}
          <p className="text-sm text-gray-600 mb-3">
            {product.intensity === 'EDT' && 'Eau de Toilette'}
            {product.intensity === 'EDP' && 'Eau de Parfum'}
            {product.intensity === 'EXTRAIT' && 'Extrait de Parfum'}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Harga</p>
            <p className="text-xl font-bold text-gray-900">Rp {product.price.toLocaleString('id-ID')}</p>
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
            >
              Tambah ke Keranjang
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
