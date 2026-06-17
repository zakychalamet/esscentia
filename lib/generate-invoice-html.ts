/**
 * Generates a standalone HTML string for an invoice, using only inline styles
 * with standard hex/rgb colors. This bypasses Tailwind CSS v4's lab()/oklch()
 * color functions that html2canvas cannot parse.
 */

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface InvoiceOrder {
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
  items: InvoiceItem[];
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusStyle(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'border: 1px solid #a7f3d0; color: #047857; background-color: rgba(236, 253, 245, 0.5);';
    case 'pending':
      return 'border: 1px solid #fde68a; color: #b45309; background-color: rgba(255, 251, 235, 0.5);';
    default:
      return 'border: 1px solid #d6d3d1; color: #57534e; background-color: #fafaf9;';
  }
}

export function generateInvoiceHTML(order: InvoiceOrder): string {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 12px 14px 0; font-family: Georgia, 'Times New Roman', serif; font-weight: 600; color: #4A3728;">
          ${item.productName}
        </td>
        <td style="padding: 14px 0; text-align: right; font-family: 'Courier New', monospace; color: #57534e;">
          ${formatPrice(item.price)}
        </td>
        <td style="padding: 14px 0; text-align: center; color: #57534e;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 0; text-align: right; font-family: 'Courier New', monospace; font-weight: 600; color: #4A3728;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const notesSection = order.notes
    ? `
      <div>
        <h4 style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 700; margin: 0 0 8px 0; font-family: -apple-system, sans-serif;">
          Catatan Tambahan
        </h4>
        <p style="color: #78716c; background-color: #fafaf9; border: 1px solid rgba(231, 229, 224, 0.6); padding: 12px; border-radius: 2px; line-height: 1.6; font-style: italic; margin: 0; font-family: -apple-system, sans-serif; font-size: 12px;">
          \u201C${order.notes}\u201D
        </p>
      </div>`
    : '<div></div>';

  return `
    <div style="background-color: #ffffff; max-width: 720px; margin: 0 auto; padding: 40px 48px; font-family: Georgia, 'Times New Roman', serif; color: #4A3728; box-sizing: border-box;">
      <!-- Invoice Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #d6d3d1; padding-bottom: 32px; margin-bottom: 32px;">
        <div>
          <h1 style="font-size: 28px; font-weight: 700; letter-spacing: 0.15em; color: #4A3728; text-transform: uppercase; margin: 0; font-family: Georgia, 'Times New Roman', serif;">
            ESSCENTIA
          </h1>
          <p style="color: #78716c; font-size: 12px; font-style: italic; letter-spacing: 0.05em; font-family: -apple-system, sans-serif; margin: 4px 0 0 0;">
            Artisanal Botanical Fragrances
          </p>
          <div style="color: #a8a29e; font-size: 10px; margin-top: 16px; line-height: 1.8; font-family: -apple-system, sans-serif; font-style: normal;">
            <p style="margin: 0;">Jakarta, Indonesia</p>
            <p style="margin: 0;">Email: concierge@esscentia.com</p>
            <p style="margin: 0;">Web: www.esscentia.com</p>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 20px; font-weight: 700; letter-spacing: 0.15em; color: #8C7355; text-transform: uppercase; margin: 0 0 8px 0; font-family: Georgia, 'Times New Roman', serif;">
            INVOICE
          </h2>
          <div style="font-size: 12px; line-height: 1.8; font-family: -apple-system, sans-serif; color: #57534e;">
            <p style="margin: 0;">No. Pesanan: <span style="font-family: 'Courier New', monospace; font-weight: 600; color: #4A3728;">${order.orderNumber}</span></p>
            <p style="margin: 0;">Tanggal: ${invoiceDate}</p>
            <p style="margin: 0;">Metode Bayar: <span style="text-transform: uppercase;">${order.paymentMethod}</span></p>
            <p style="margin: 4px 0 0 0;">
              Status: <span style="display: inline-block; padding: 2px 8px; border-radius: 2px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; ${getStatusStyle(order.status)}">${order.status}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Customer & Shipping Details -->
      <div style="display: flex; gap: 32px; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid #f5f5f4; font-family: -apple-system, sans-serif;">
        <div style="flex: 1;">
          <h3 style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 700; margin: 0 0 12px 0;">
            Tujuan Pengiriman
          </h3>
          <div style="font-size: 12px; line-height: 1.8; color: #57534e;">
            <p style="font-weight: 600; color: #4A3728; font-size: 14px; margin: 0;">${order.shippingName}</p>
            <p style="margin: 0;">Email: ${order.shippingEmail}</p>
            <p style="margin: 0;">Telp: ${order.shippingPhone}</p>
          </div>
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 700; margin: 0 0 12px 0;">
            Alamat Pengiriman
          </h3>
          <div style="font-size: 12px; line-height: 1.8; color: #57534e;">
            <p style="margin: 0;">${order.shippingAddress}</p>
            <p style="margin: 0;">${order.shippingCity}, ${order.shippingProvince} ${order.shippingPostalCode}</p>
            <p style="color: #a8a29e; font-style: italic; font-size: 10px; margin: 4px 0 0 0;">
              Kurir: <span style="text-transform: uppercase; font-weight: 600;">${order.shipMethod}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Order Items Table -->
      <div style="margin-bottom: 32px;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: -apple-system, sans-serif; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid #d6d3d1;">
              <th style="padding: 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 600;">Nama Item</th>
              <th style="padding: 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 600; text-align: right;">Harga Satuan</th>
              <th style="padding: 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 600; text-align: center;">Jumlah</th>
              <th style="padding: 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #8C7355; font-weight: 600; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody style="color: #44403c;">
            ${itemRows}
          </tbody>
        </table>
      </div>

      <!-- Notes & Summary -->
      <div style="display: flex; gap: 32px; padding-top: 16px;">
        ${notesSection}
        <div style="flex: 1;">
          <div style="border-top: 2px solid #d6d3d1; padding-top: 16px; font-family: -apple-system, sans-serif; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; color: #57534e; margin-bottom: 12px;">
              <span>Subtotal</span>
              <span style="font-family: 'Courier New', monospace;">${formatPrice(order.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #57534e; margin-bottom: 12px;">
              <span>Biaya Pengiriman</span>
              <span style="font-family: 'Courier New', monospace;">${formatPrice(order.shippingCost)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #4A3728; font-weight: 700; font-size: 14px; border-top: 1px solid #f5f5f4; padding-top: 12px;">
              <span style="font-family: Georgia, 'Times New Roman', serif;">Total Transaksi</span>
              <span style="font-family: 'Courier New', monospace; color: #8D4F38;">${formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Footer -->
      <div style="border-top: 1px solid #d6d3d1; margin-top: 64px; padding-top: 32px; text-align: center; font-family: -apple-system, sans-serif; line-height: 1.8;">
        <p style="font-family: Georgia, 'Times New Roman', serif; color: #78716c; font-style: italic; letter-spacing: 0.02em; margin: 0 0 8px 0; font-size: 12px;">
          Terima kasih atas pembelian Anda di Esscentia. Wewangian Anda diramu dengan penuh dedikasi.
        </p>
        <p style="color: #a8a29e; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
          &copy; 2026 Esscentia. All rights reserved.
        </p>
      </div>
    </div>
  `;
}
