const { analyzeClothingImage } = require("../services/ai/vision.service");
const ClothingItem = require("../models/ClothingItem");

const analyzeClothing = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const data = await analyzeClothingImage(req.file.path);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateOutfit = async (req, res) => {
  try {
    const { occasion, weather, temperature, preferences, regenerateItem, existingOutfit } = req.body;
    
    // Fetch user's wardrobe
    const clothes = await ClothingItem.find({ user: req.user._id });
    
    // We allow generation even if some categories are empty, but total must > 0
    if (clothes.length === 0) {
      return res.status(400).json({ success: false, message: "Wardrobe is empty" });
    }

    // 1. CONTEXT EXTRACTION
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0-6 (Sun-Sat)
    const month = now.getMonth(); // 0-11
    
    let timeOfDay = 'Evening';
    if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
    else if (hour >= 20 || hour < 5) timeOfDay = 'Night';

    const isWeekend = day === 0 || day === 6;
    const dayContext = isWeekend ? 'Weekend' : 'Weekday';

    // Simple season check (Northern Hemisphere assumed for demo)
    let season = 'Spring';
    if (month >= 2 && month <= 4) season = 'Spring';
    else if (month >= 5 && month <= 7) season = 'Summer';
    else if (month >= 8 && month <= 10) season = 'Autumn';
    else season = 'Winter';
    
    const isHot = (weather || '').toLowerCase().includes('hot') || (temperature && temperature > 25);
    const isCold = (weather || '').toLowerCase().includes('cold') || (temperature && temperature < 15);
    const isRainy = (weather || '').toLowerCase().includes('rain');

    // 2. SCORING ENGINE
    const scoreItem = (item) => {
      let score = 50; // Base score
      let reasons = [];
      
      const category = (item.category || '').toLowerCase();
      const color = (item.color || '').toLowerCase();
      const style = (item.style || '').toLowerCase();
      const fabric = (item.fabric || '').toLowerCase();

      // Weather Rules
      if (isHot) {
        if (fabric.includes('cotton') || fabric.includes('linen') || category.includes('short') || category.includes('t-shirt')) { score += 20; reasons.push('Light material keeps you cool in hot weather.'); }
        if (fabric.includes('wool') || category.includes('jacket') || category.includes('hoodie')) { score -= 40; }
      }
      if (isCold) {
        if (fabric.includes('wool') || category.includes('jacket') || category.includes('hoodie') || category.includes('sweater')) { score += 25; reasons.push('Warm layer for the cold.'); }
        if (category.includes('short') || fabric.includes('linen')) { score -= 40; }
      }
      if (isRainy) {
        if (fabric.includes('leather') || fabric.includes('suede')) { score -= 25; }
        if (fabric.includes('waterproof') || category.includes('jacket')) { score += 20; reasons.push('Good protection for the rain.'); }
      }

      // Time Rules
      if (timeOfDay === 'Morning' || timeOfDay === 'Afternoon') {
        if (color.includes('white') || color.includes('yellow') || color.includes('light') || color.includes('pastel')) { score += 10; reasons.push('Bright colors fit the daytime vibe.'); }
      } else {
        if (color.includes('black') || color.includes('dark') || color.includes('navy')) { score += 10; reasons.push('Darker colors suit the evening/night.'); }
      }

      // Occasion Rules
      const occasionLower = (occasion || '').toLowerCase();
      if (occasionLower.includes('office') || occasionLower.includes('formal')) {
        if (category.includes('shirt') || category.includes('trouser') || style.includes('formal') || category.includes('blazer')) { score += 25; reasons.push('Perfect for professional settings.'); }
        if (category.includes('t-shirt') || category.includes('short') || category.includes('sneaker')) { score -= 30; }
      } else if (occasionLower.includes('party') || occasionLower.includes('wedding')) {
        if (style.includes('party') || style.includes('formal') || category.includes('dress') || category.includes('suit') || category.includes('kurta')) { score += 30; reasons.push(`Ideal for a ${occasionLower}.`); }
        if (category.includes('jean') || category.includes('t-shirt')) { score -= 30; }
      } else {
        // Casual / Default
        if (category.includes('t-shirt') || category.includes('jean') || category.includes('sneaker')) { score += 15; reasons.push('Comfortable for a casual look.'); }
      }
      
      // Preference Match
      if (preferences && preferences.toLowerCase().includes(color)) {
        score += 15; reasons.push('Matches your color preference.');
      }

      // Cap bounds
      score = Math.max(0, Math.min(100, score));

      if (reasons.length === 0) reasons.push(`Versatile piece for ${season}.`);

      return { item, score, reasons };
    };

    const getBestItem = (categoryPrefixes) => {
      let filtered = clothes.filter(c => {
        const cat = (c.category || '').toLowerCase();
        return categoryPrefixes.some(p => cat.includes(p));
      });
      if (filtered.length === 0) return null;
      
      const scored = filtered.map(scoreItem);
      scored.sort((a, b) => b.score - a.score); // Highest first
      
      const best = scored[0];
      return {
        clothingItem: best.item,
        matchScore: best.score,
        explanation: best.reasons.join(' ')
      };
    };

    let outfit = existingOutfit || {};

    const categories = {
      top: ['top', 'shirt', 't-shirt', 'kurta', 'dress'],
      bottom: ['bottom', 'pant', 'jean', 'short', 'trouser', 'skirt'],
      shoes: ['shoe', 'footwear', 'sneaker', 'heel', 'boot'],
      accessories: ['accessor', 'watch', 'belt', 'bag'],
      outerwear: ['outerwear', 'jacket', 'coat', 'blazer', 'hoodie']
    };

    if (regenerateItem) {
      if (categories[regenerateItem]) {
        // Exclude currently selected item to prevent picking the same one
        const currentId = existingOutfit[regenerateItem]?.clothingItem?._id?.toString();
        // temporarily filter out
        const originalClothes = [...clothes];
        if (currentId) {
           for (let i = 0; i < clothes.length; i++) {
             if (clothes[i]._id.toString() === currentId) {
               clothes.splice(i, 1);
               break;
             }
           }
        }
        outfit[regenerateItem] = getBestItem(categories[regenerateItem]);
        // restore
        clothes.length = 0;
        clothes.push(...originalClothes);
      }
    } else {
      outfit.top = getBestItem(categories.top);
      outfit.bottom = getBestItem(categories.bottom);
      outfit.shoes = getBestItem(categories.shoes);
      outfit.accessories = getBestItem(categories.accessories);
      outfit.outerwear = getBestItem(categories.outerwear);
    }

    // 3. WARDROBE RECOMMENDATIONS
    let recommendations = [];
    if (!outfit.top) recommendations.push("You don't have any tops in your wardrobe.");
    if (!outfit.bottom) recommendations.push("You don't have any bottoms.");
    if (!outfit.shoes) recommendations.push("You don't have any footwear.");
    if (isRainy && !clothes.some(c => (c.fabric||'').toLowerCase().includes('waterproof'))) {
      recommendations.push("You do not own any rain-friendly gear.");
    }
    if (occasion && occasion.toLowerCase().includes('office') && !clothes.some(c => (c.style||'').toLowerCase().includes('formal'))) {
      recommendations.push("You have no formal clothing for the office.");
    }

    // Overall Score Breakdown calculation
    const scores = [outfit.top, outfit.bottom, outfit.shoes, outfit.accessories, outfit.outerwear]
      .filter(x => x)
      .map(x => x.matchScore);
    
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b,0) / scores.length) : 0;
    
    const analysis = {
      overallScore: avgScore,
      breakdown: {
        Weather: Math.min(100, avgScore + (isHot||isCold ? 5 : 0)),
        Color: Math.min(100, avgScore + 2),
        Occasion: Math.min(100, avgScore + 4),
        Comfort: Math.min(100, avgScore - 1),
        Style: Math.min(100, avgScore + 1)
      },
      summary: `Outfit customized for ${timeOfDay} ${dayContext} in ${season}.`,
      recommendations
    };

    setTimeout(() => {
      res.status(200).json({
        success: true,
        data: { outfit, analysis }
      });
    }, 800); // reduced simulated delay to 800ms for better UX

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  analyzeClothing,
  generateOutfit,
};