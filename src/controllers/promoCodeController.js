import PromoCode from '../models/PromoCode.js';

// Create Promo Code
export const createPromoCode = async (req, res) => {
  const { code, discountPercentage, expirationDate, maxUsage } = req.body;

  try {
    const promoCode = await PromoCode.create({
      code,
      discountPercentage,
      expirationDate,
      maxUsage,
    });
    res.status(201).json({ message: 'Promo code created successfully', promoCode });
  } catch (error) {
    console.error(`Error creating promo code: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply Promo Code
export const applyPromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    if (promoCode.expirationDate < new Date()) {
      return res.status(400).json({ message: 'Promo code expired' });
    }

    if (promoCode.currentUsage >= promoCode.maxUsage) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    res.status(200).json({ message: 'Promo code applied successfully', discountPercentage: promoCode.discountPercentage });
  } catch (error) {
    console.error(`Error applying promo code: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};
