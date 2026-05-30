'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Eye, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const orders = [
    {
      id: 1001,
      customer: 'Budi Santoso',
      email: 'budi@example.com',
      total: 1500000,
      status: 'Completed',
      date: '2024-01-15',
      items: 3,
      address: 'Jl. Ahmad Yani No. 123, Jakarta',
    },
    {
      id: 1002,
      customer: 'Siti Nurhaliza',
      email: 'siti@example.com',
      total: 890000,
      status: 'Pending',
      date: '2024-01-14',
      items: 2,
      address: 'Jl. Gatot Subroto No. 456, Bandung',
    },
    {
      id: 1003,
      customer: 'Ari Wijaya',
      email: 'ari@example.com',
      total: 2100000,
      status: 'Shipped',
      date: '2024-01-13',
      items: 4,
      address: 'Jl. Sudirman No. 789, Surabaya',
    },
    {
      id: 1004,
      customer: 'Diana Kusuma',
      email: 'diana@example.com',
      total: 650000,
      status: 'Completed',
      date: '2024-01-12',
      items: 1,
      address: 'Jl. MT Haryono No. 321, Medan',
    },
    {
      id: 1005,
      customer: 'Rony Pratama',
      email: 'rony@example.com',
      total: 1200000,
      status: 'Processing',
      date: '2024-01-11',
      items: 2,
      address: 'Jl. Permata No. 654, Yogyakarta',
    },
    {
      id: 1006,
      customer: 'Vera Handini',
      email: 'vera@example.com',
      total: 3200000,
      status: 'Completed',
      date: '2024-01-10',
      items: 5,
      address: 'Jl. Gatot Kaca No. 987, Bali',
    },
  ];

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Completed'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filtered = orders
    .filter((o) =>
      filterStatus === 'All' ? true : o.status === filterStatus
    )
    .filter((o) =>
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toString().includes(searchTerm)
    );

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Manajemen Pesanan</h1>
        <p className="text-slate-500 text-sm">Kelola dan pantau semua pesanan pelanggan</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Cari pesanan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Pelanggan</th>
                  <th className="text-left py-3 px-4 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                        selectedOrder === order.id ? 'bg-purple-50' : ''
                      }`}
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <td className="py-3 px-4 font-semibold">#{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        Rp {order.total.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.date}</td>
                      <td className="py-3 px-4">
                        <button className="p-1 hover:bg-blue-100 rounded text-blue-600">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center text-gray-600">
                      Tidak ada pesanan yang sesuai
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details */}
        <div className="col-span-1">
          {selectedOrderData ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24 space-y-6">
              <h2 className="text-2xl font-bold">Detail Pesanan</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">ID Pesanan</p>
                  <p className="font-bold text-lg">#{selectedOrderData.id}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Pelanggan</p>
                  <p className="font-semibold">{selectedOrderData.customer}</p>
                  <p className="text-gray-600">{selectedOrderData.email}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Alamat Pengiriman</p>
                  <p className="font-semibold">{selectedOrderData.address}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Tanggal Pesanan</p>
                  <p className="font-semibold">{selectedOrderData.date}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Jumlah Item</p>
                  <p className="font-semibold">{selectedOrderData.items} item</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    Rp {selectedOrderData.total.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm mb-2">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrderData.status)}`}>
                    {selectedOrderData.status}
                  </span>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600">
                    <option>Pilih status baru...</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Completed</option>
                  </select>
                  <Button className="w-full">Update Status</Button>
                </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Download size={18} /> Download Invoice
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-600">
              <p>Pilih pesanan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Total Pesanan</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Total Penjualan</p>
          <p className="text-3xl font-bold">
            Rp {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Pesanan Pending</p>
          <p className="text-3xl font-bold">{orders.filter((o) => o.status === 'Pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Pesanan Selesai</p>
          <p className="text-3xl font-bold">{orders.filter((o) => o.status === 'Completed').length}</p>
        </div>
      </div>
    </div>
  );
}
