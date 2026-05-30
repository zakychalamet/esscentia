'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pesan Anda telah dikirim! Kami akan menghubungi Anda segera.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Hubungi Kami</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Subjek"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Kirim Pesan
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-lg mb-2">📍 Lokasi</h3>
                  <p className="text-gray-700">
                    Jl. Kemang Raya No. 123<br />
                    Jakarta Selatan 12560<br />
                    Indonesia
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">📧 Email</h3>
                  <p className="text-gray-700">support@esscentia.com</p>
                  <p className="text-gray-700">admin@esscentia.com</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">📱 Telepon</h3>
                  <p className="text-gray-700">
                    WhatsApp: +62 812-3456-7890<br />
                    Telepon: +62 21-5555-1234
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">🕙 Jam Operasional</h3>
                  <p className="text-gray-700">
                    Senin - Jumat: 09:00 - 18:00 WIB<br />
                    Sabtu: 10:00 - 16:00 WIB<br />
                    Minggu: Tutup
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">🌐 Media Sosial</h3>
                  <p className="text-gray-700">
                    Instagram: @esscentia_parfum<br />
                    Facebook: Esscentia Parfum<br />
                    TikTok: @esscentia_oficial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
