const Planner = require("../models/Planner");
const ClothingItem = require("../models/ClothingItem");

// Helper to get Monday of the current week
const getMonday = (d) => {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const getPlanner = async (req, res) => {
  try {
    const today = new Date();
    const weekStartDate = getMonday(today);

    let planner = await Planner.findOne({ user: req.user._id, weekStartDate });

    if (!planner) {
      // Create empty week
      const days = [];
      const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let currentDate = new Date(weekStartDate);
      
      for (let i = 0; i < 7; i++) {
        days.push({
          date: currentDate.toISOString().split('T')[0],
          dayOfWeek: dayNames[i],
          status: 'Planned'
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      planner = await Planner.create({
        user: req.user._id,
        weekStartDate,
        days
      });
    }

    res.json(planner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePlannerDay = async (req, res) => {
  try {
    const { date, status, occasion, weather, notes, outfit } = req.body;
    const planner = await Planner.findOne({ user: req.user._id, "days.date": date });

    if (!planner) {
      return res.status(404).json({ message: "Planner day not found" });
    }

    const day = planner.days.find(d => d.date === date);
    if (day) {
      if (status !== undefined) day.status = status;
      if (occasion !== undefined) day.occasion = occasion;
      if (weather !== undefined) day.weather = weather;
      if (notes !== undefined) day.notes = notes;
      if (outfit !== undefined) day.outfit = outfit;
    }

    await planner.save();
    res.json(planner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearPlannerDay = async (req, res) => {
  try {
    const { date } = req.body;
    const planner = await Planner.findOne({ user: req.user._id, "days.date": date });

    if (planner) {
      const day = planner.days.find(d => d.date === date);
      if (day) {
        day.outfit = null;
        day.status = 'Planned';
      }
      await planner.save();
    }

    res.json(planner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateWeek = async (req, res) => {
  try {
    const { weatherForecast } = req.body; // array of 7 weather strings (e.g. ['22°C Sunny', ...])
    const weekStartDate = getMonday(new Date());

    let planner = await Planner.findOne({ user: req.user._id, weekStartDate });
    if (!planner) {
      return res.status(404).json({ message: "Planner not initialized." });
    }

    const clothes = await ClothingItem.find({ user: req.user._id });
    if (clothes.length === 0) {
      return res.status(400).json({ message: "Wardrobe is empty." });
    }

    const usedItemIds = new Set();
    const categories = {
      top: ['top', 'shirt', 't-shirt', 'kurta', 'dress'],
      bottom: ['bottom', 'pant', 'jean', 'short', 'trouser', 'skirt'],
      shoes: ['shoe', 'footwear', 'sneaker', 'heel', 'boot'],
      accessory: ['accessor', 'watch', 'belt', 'bag'],
      outerwear: ['outerwear', 'jacket', 'coat', 'blazer', 'hoodie']
    };

    const getBestItem = (catPrefixes, dayWeather, dayOccasion) => {
      let filtered = clothes.filter(c => {
        const cat = (c.category || '').toLowerCase();
        return catPrefixes.some(p => cat.includes(p));
      });
      if (filtered.length === 0) return null;

      const isHot = (dayWeather || '').toLowerCase().includes('hot') || dayWeather?.includes('30°');
      const isCold = (dayWeather || '').toLowerCase().includes('cold') || dayWeather?.includes('10°');
      
      const scored = filtered.map(item => {
        let score = 50;
        
        // Penalize if already used this week!
        if (usedItemIds.has(item._id.toString())) {
          score -= 40; // Heavy penalty to encourage rotation
        }

        const category = (item.category || '').toLowerCase();
        const fabric = (item.fabric || '').toLowerCase();
        
        if (isHot) {
          if (fabric.includes('cotton') || fabric.includes('linen') || category.includes('short')) score += 20;
          if (fabric.includes('wool') || category.includes('jacket')) score -= 30;
        }
        if (isCold) {
          if (fabric.includes('wool') || category.includes('jacket') || category.includes('sweater')) score += 20;
          if (category.includes('short')) score -= 30;
        }

        return { item, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const best = scored[0].item;
      usedItemIds.add(best._id.toString());
      return best;
    };

    // Generate for each day
    planner.days.forEach((day, idx) => {
      // Don't overwrite if Worn (unless requested, but for now we generate for whole week except worn)
      if (day.status !== 'Worn') {
        const dayWeather = weatherForecast?.[idx] || day.weather || '22°C Cloudy';
        const dayOccasion = day.occasion || 'Casual';
        
        day.weather = dayWeather;
        day.outfit = {
          top: getBestItem(categories.top, dayWeather, dayOccasion),
          bottom: getBestItem(categories.bottom, dayWeather, dayOccasion),
          shoes: getBestItem(categories.shoes, dayWeather, dayOccasion),
          accessory: getBestItem(categories.accessory, dayWeather, dayOccasion),
          outerwear: getBestItem(categories.outerwear, dayWeather, dayOccasion),
          overallScore: 90 + Math.floor(Math.random() * 10), // mock high score for AI
          explanations: ['AI selected based on weather and rotation rules.']
        };
        day.status = 'Planned';
      }
    });

    await planner.save();
    res.json(planner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlanner,
  updatePlannerDay,
  clearPlannerDay,
  generateWeek
};
