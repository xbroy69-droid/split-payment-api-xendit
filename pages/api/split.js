// pages/api/split.js
import Xendit from 'xendit-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, email, description } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ message: 'amount dan email wajib diisi' });
    }

    // Init Xendit dengan API Key dari .env.local
    const x = new Xendit({ secretKey: process.env.XENDIT_API_KEY });
    const { Invoice } = x;
    const invoiceSpecificOptions = {};
    const i = new Invoice(invoiceSpecificOptions);

    // Buat invoice
    const invoice = await i.createInvoice({
      externalID: `invoice-${Date.now()}`,
      payerEmail: email,
      description: description || 'Pembayaran dengan split',
      amount: amount,
      // Contoh split payment
      // disini bisa diatur pembagian fee / share
      // misalnya 90% ke merchant, 10% ke platform (kamu)
      paymentMethods: ['BANK_TRANSFER'],
      successRedirectURL: 'https://your-frontend-success.com',
      failureRedirectURL: 'https://your-frontend-failed.com',
      fees: [
        {
          type: 'Platform Fee',
          value: Math.floor(amount * 0.1), // 10% fee
        },
      ],
    });

    return res.status(200).json({ invoice });
  } catch (error) {
    console.error('Error buat invoice:', error);
    return res.status(500).json({ message: 'Gagal buat invoice', error: error.message });
  }
}
