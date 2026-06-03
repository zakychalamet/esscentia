'use client';

import { CatalogNav, CatalogFooter } from '@/components/CatalogChrome';
import { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, MessageSquare } from 'lucide-react';

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

  const contactInfos = [
    {
      icon: <MapPin className="text-[#8C7355] shrink-0" size={20} strokeWidth={1.5} />,
      title: 'Butik Utama',
      lines: ['Jl. Kemang Raya No. 123', 'Jakarta Selatan 12560', 'Indonesia'],
    },
    {
      icon: <Mail className="text-[#8C7355] shrink-0" size={20} strokeWidth={1.5} />,
      title: 'Korespondensi Email',
      lines: ['support@esscentia.com', 'admin@esscentia.com'],
    },
    {
      icon: <Phone className="text-[#8C7355] shrink-0" size={20} strokeWidth={1.5} />,
      title: 'Telepon & WhatsApp',
      lines: ['WhatsApp: +62 812-3456-7890', 'Kantor: +62 21-5555-1234'],
    },
    {
      icon: <Clock className="text-[#8C7355] shrink-0" size={20} strokeWidth={1.5} />,
      title: 'Jam Operasional',
      lines: ['Senin - Jumat: 09:00 - 18:00 WIB', 'Sabtu: 10:00 - 16:00 WIB', 'Minggu: Tutup'],
    },
  ];

  return (
    <>
      <CatalogNav />
      <div className="flex-1 bg-[#F9F7F2] min-h-screen">
        {/* Header Hero */}
        <div className="bg-[#EDEAE4]/50 border-b border-[#E7E5E0] py-16 md:py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8C7355] font-bold mb-2">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3728]">Hubungi Kami</h1>
            <div className="h-0.5 w-12 bg-[#8C7355] mx-auto my-6"></div>
            <p className="text-stone-500 text-sm font-light max-w-md mx-auto leading-relaxed">
              Hubungi penasihat wewangian kami untuk bantuan pesanan, pertanyaan produk, atau kolaborasi eksklusif.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white border border-[#E7E5E0] p-8 md:p-10 rounded-lg shadow-xs transition duration-300 hover:border-[#8C7355]/30">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <MessageSquare className="text-[#8C7355]" size={22} strokeWidth={1.5} />
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4A3728]">Kirim Pesan</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-500 mb-2">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap Anda"
                      className="w-full px-4 py-3 border border-[#E7E5E0] bg-[#F9F7F2]/30 text-sm font-sans focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 text-[#4A3728] placeholder-stone-400 rounded transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-500 mb-2">
                      Surel (Email)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nama@contoh.com"
                      className="w-full px-4 py-3 border border-[#E7E5E0] bg-[#F9F7F2]/30 text-sm font-sans focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 text-[#4A3728] placeholder-stone-400 rounded transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-500 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Keperluan Anda"
                    className="w-full px-4 py-3 border border-[#E7E5E0] bg-[#F9F7F2]/30 text-sm font-sans focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 text-[#4A3728] placeholder-stone-400 rounded transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] font-semibold text-stone-500 mb-2">
                    Pesan
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Tuliskan pesan Anda di sini..."
                    className="w-full px-4 py-3 border border-[#E7E5E0] bg-[#F9F7F2]/30 text-sm font-sans focus:outline-none focus:border-[#8C7355] focus:ring-1 focus:ring-[#8C7355]/20 text-[#4A3728] placeholder-stone-400 rounded transition duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#8D4F38] text-[#F9F7F2] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#7a4532] transition hover:shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={12} />
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4A3728] mb-6 pl-1 border-l-2 border-[#8C7355]">
                Informasi Kontak
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactInfos.map((info, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E7E5E0] p-6 rounded-lg shadow-xs flex gap-4 transition duration-300 hover:border-[#8C7355]/30"
                  >
                    <div className="p-3 bg-[#EDEAE4]/40 rounded-full h-fit">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#4A3728] mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.lines.map((line, lIdx) => (
                          <p key={lIdx} className="text-xs text-stone-500 font-light leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CatalogFooter />
    </>
  );
}
