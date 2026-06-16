'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Eye, Download, RefreshCw, AlertCircle, X, FileText } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  price: number;
  productImage?: string | null;
}

interface OrderRecord {
  id: string;
  userId: string | null;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  shipMethod: string;
  paymentMethod: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusUpdateVal, setStatusUpdateVal] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch admin orders');
      }
    } catch (e) {
      console.error('Error fetching admin orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderId || !statusUpdateVal) return;
    setUpdating(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusUpdateVal }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Status pesanan berhasil diperbarui' });
        // Refresh orders
        const updatedRes = await fetch('/api/admin/orders');
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setOrders(data);
        }
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.error || 'Gagal memperbarui status' });
      }
    } catch (e) {
      console.error('Error updating status:', e);
      setMessage({ type: 'error', text: 'Gagal memperbarui status' });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200/50';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border border-blue-200/50';
      case 'processing':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200/50';
      default:
        return 'bg-stone-50 text-stone-700 border border-stone-200/50';
    }
  };

  const statuses = ['All', 'pending', 'processing', 'shipped', 'completed'];

  const filtered = orders
    .filter((o) =>
      filterStatus === 'All' ? true : o.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .filter((o) =>
      o.shippingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toString().includes(searchTerm)
    );

  const selectedOrderData = orders.find((o) => o.id === selectedOrderId);

  // Set default update status option when selecting an order
  useEffect(() => {
    if (selectedOrderData) {
      setStatusUpdateVal(selectedOrderData.status.toLowerCase());
    }
  }, [selectedOrderId, selectedOrderData]);

  const formatPrice = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Header */}
      <div className="flex justify-between items-center bg-white border border-stone-200/80 p-6 rounded-lg shadow-xs">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3728] mb-1">Manajemen Pesanan</h1>
          <p className="text-stone-500 text-sm font-light">Kelola dan pantau seluruh pesanan pelanggan Esscentia</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2.5 border border-stone-200 rounded-md hover:bg-stone-50 transition text-stone-500 flex items-center justify-center gap-2 text-xs font-medium"
          title="Refresh Data"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-stone-200/80 rounded-lg shadow-xs space-y-1">
          <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Total Pesanan</p>
          <p className="text-3xl font-serif font-bold text-[#4A3728]">{orders.length}</p>
        </div>
        <div className="bg-white p-6 border border-stone-200/80 rounded-lg shadow-xs space-y-1">
          <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Total Pendapatan</p>
          <p className="text-3xl font-serif font-bold text-[#4A3728]">
            {formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
          </p>
        </div>
        <div className="bg-white p-6 border border-stone-200/80 rounded-lg shadow-xs space-y-1">
          <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Pesanan Pending</p>
          <p className="text-3xl font-serif font-bold text-[#8C7355]">
            {orders.filter((o) => o.status.toLowerCase() === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 border border-stone-200/80 rounded-lg shadow-xs space-y-1">
          <p className="text-stone-500 text-xs uppercase tracking-widest font-medium">Pesanan Selesai</p>
          <p className="text-3xl font-serif font-bold text-emerald-700">
            {orders.filter((o) => o.status.toLowerCase() === 'completed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white border border-stone-200/80 p-5 rounded-lg shadow-xs items-stretch lg:items-center justify-between">
        <div className="flex-1">
          <Input
            placeholder="Cari berdasarkan nama, email, nomor order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="w-full"
          />
        </div>
        <div className="flex gap-2 shrink-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 border rounded font-medium text-xs uppercase tracking-wider transition whitespace-nowrap ${
                filterStatus.toLowerCase() === status.toLowerCase()
                  ? 'bg-[#4A3728] text-[#F9F7F2] border-[#4A3728] font-bold shadow-xs'
                  : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
              }`}
            >
              {status === 'All' ? 'Semua' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className={`col-span-1 ${selectedOrderId && selectedOrderData ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white rounded-lg shadow-xs border border-stone-200/80 overflow-hidden`}>
          <div className="overflow-x-auto">
            {loading && orders.length === 0 ? (
              <div className="py-20 text-center text-stone-500">
                <div className="w-8 h-8 border-2 border-[#8C7355] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Memuat data pesanan…
              </div>
            ) : filtered.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr className="text-stone-500 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="text-left py-4 px-5">ID / No. Order</th>
                    <th className="text-left py-4 px-5">Pelanggan</th>
                    <th className="text-left py-4 px-5">Total</th>
                    <th className="text-left py-4 px-5">Status</th>
                    <th className="text-left py-4 px-5">Tanggal</th>
                    <th className="text-center py-4 px-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-stone-50/50 cursor-pointer transition ${
                        selectedOrderId === order.id ? 'bg-[#EDEAE4]/40 font-medium' : ''
                      }`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-semibold text-[#4A3728] font-mono">#{order.id}</p>
                          <p className="text-[10px] text-stone-400 font-mono tracking-tight">{order.orderNumber}</p>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div>
                          <p className="text-[#4A3728]">{order.shippingName}</p>
                          <p className="text-xs text-stone-500 font-light">{order.shippingEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-[#4A3728] font-semibold">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-stone-500 font-light text-xs">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button 
                          className={`p-1.5 rounded transition ${
                            selectedOrderId === order.id ? 'bg-[#4A3728] text-white' : 'hover:bg-stone-100 text-[#8C7355]'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.id);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-stone-400 font-light">
                Tidak ada pesanan yang sesuai dengan filter pencarian Anda.
              </div>
            )}
          </div>
        </div>

        {/* Order Details Panel */}
        {selectedOrderId && selectedOrderData && (
          <div className="col-span-1 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-xs border border-stone-200/80 sticky top-24 space-y-6">
              <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#4A3728]">Detail Pesanan</h2>
                  <p className="text-xs font-mono text-[#8C7355] mt-1">{selectedOrderData.orderNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest ${getStatusColor(selectedOrderData.status)}`}>
                    {selectedOrderData.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-750 transition cursor-pointer border-0 bg-transparent flex items-center justify-center"
                    aria-label="Tutup detail"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded text-xs flex gap-2 items-start ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                  }`}
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{message.text}</span>
                </div>
              )}

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <p className="text-stone-400 uppercase tracking-widest text-[9px] mb-1 font-semibold">Pelanggan</p>
                  <p className="font-semibold text-sm text-[#4A3728]">{selectedOrderData.shippingName}</p>
                  <p className="text-stone-500">{selectedOrderData.shippingEmail}</p>
                  <p className="text-stone-500">{selectedOrderData.shippingPhone}</p>
                </div>

                <div className="border-t border-stone-100 pt-3">
                  <p className="text-stone-400 uppercase tracking-widest text-[9px] mb-1 font-semibold">Alamat Pengiriman</p>
                  <p className="text-[#4A3728]">{selectedOrderData.shippingAddress}</p>
                  <p className="text-stone-500">
                    {selectedOrderData.shippingCity}, {selectedOrderData.shippingProvince} {selectedOrderData.shippingPostalCode}
                  </p>
                  <p className="text-stone-400 text-[10px] mt-1 font-medium">Metode: {selectedOrderData.shipMethod.toUpperCase()}</p>
                </div>

                {selectedOrderData.notes && (
                  <div className="border-t border-stone-100 pt-3">
                    <p className="text-stone-400 uppercase tracking-widest text-[9px] mb-1 font-semibold">Catatan dari Pelanggan</p>
                    <p className="text-stone-600 italic bg-amber-50/40 p-2.5 border border-amber-100/50 rounded">
                      "{selectedOrderData.notes}"
                    </p>
                  </div>
                )}

                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <p className="text-stone-400 uppercase tracking-widest text-[9px] font-semibold">Item Pesanan</p>
                  <div className="bg-stone-50/60 p-3 rounded border border-stone-100 space-y-2">
                    {selectedOrderData.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-4 pb-2 border-b border-stone-200/30 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2.5">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded bg-[#EDEAE4] border border-stone-200/40"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-[#EDEAE4] border border-stone-200/40 flex items-center justify-center text-stone-400">
                              <RefreshCw size={14} className="opacity-40 animate-pulse" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#4A3728]">{item.productName}</p>
                            <p className="text-[10px] text-stone-400">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <span className="font-mono text-stone-600 text-[11px] font-semibold shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3 space-y-1">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(selectedOrderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Biaya Pengiriman</span>
                    <span className="font-mono">{formatPrice(selectedOrderData.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-[#4A3728] font-bold text-sm pt-1.5 border-t border-stone-150">
                    <span>Total Pembayaran</span>
                    <span className="font-mono">{formatPrice(selectedOrderData.totalAmount)}</span>
                  </div>
                </div>

                {/* Status Update Control */}
                <div className="border-t border-stone-100 pt-4 space-y-3">
                  <p className="text-stone-400 uppercase tracking-widest text-[9px] font-semibold">Perbarui Status Pesanan</p>
                  <div className="flex gap-2">
                    <select
                      value={statusUpdateVal}
                      onChange={(e) => setStatusUpdateVal(e.target.value)}
                      className="flex-1 px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-[#8C7355] text-xs bg-white text-[#4A3728] font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={updating || selectedOrderData.status.toLowerCase() === statusUpdateVal}
                      className="px-4 bg-[#4A3728] text-white hover:bg-[#8C7355] text-xs uppercase tracking-wider font-semibold disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </div>

                <Link
                  href={`/admin/orders/${selectedOrderData.id}/invoice`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4A3728] hover:bg-[#8C7355] text-white text-xs uppercase tracking-wider font-semibold transition rounded-sm text-center mt-4 font-sans"
                >
                  <FileText size={14} /> Lihat Invoice
                </Link>

                <Button
                  variant="outline"
                  onClick={() => {}}
                  className="w-full flex items-center justify-center gap-2 border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-[#4A3728] text-xs py-2.5 mt-2 font-sans cursor-pointer"
                >
                  <Download size={14} /> Unduh Invoice
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
