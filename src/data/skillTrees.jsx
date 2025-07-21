// Skill Tree Data for Multiple Cooking Domains
// Each tree has both compact and full versions for different detail levels

// === KNIFE SKILLS TREE ===
export const knifeSkillsCompact = [
  { id: "grip", name: "Grip", max: 3, tier: 0, prereq: [], path: "meta", description: "Hold the knife safely with control." },
  { id: "knifeTypes", name: "Knife Types", max: 2, tier: 0, prereq: [], path: "meta", description: "Understand types of knives and their use." },
  { id: "sharpen", name: "Sharpening", max: 2, tier: 0, prereq: [], path: "meta", description: "Basic sharpening and honing." },
  { id: "slice", name: "Slice", max: 3, tier: 1, prereq: [], path: "basic", description: "Fundamental slicing techniques." },
  { id: "dice", name: "Dice", max: 3, tier: 2, prereq: [{ id: "slice", points: 1 }], path: "vegetable", description: "General dicing from large to small." },
  { id: "julienne", name: "Julienne", max: 2, tier: 2, prereq: [{ id: "slice", points: 1 }], path: "vegetable", description: "Matchstick style cuts." },
  { id: "mince", name: "Mince", max: 1, tier: 3, prereq: [{ id: "dice", points: 2 }], path: "basic", description: "Very fine chopping." },
  { id: "decor", name: "Decorative", max: 2, tier: 4, prereq: [{ id: "julienne", points: 1 }], path: "decorative", description: "Garnishing and decoration cuts." },
  { id: "protein", name: "Protein Prep", max: 3, tier: 3, prereq: [{ id: "knifeTypes", points: 1 }], path: "protein", description: "Deboning, trimming, filleting." },
];

export const knifeSkillsFull = [ 
  { id: "grip", name: "Grip", max: 3, tier: 0, prereq: [], path: "meta", description: "Fundamental skill to hold the knife safely with a pinch grip for control and power." },
  { id: "knifeTypes", name: "Knife Types", max: 3, tier: 0, prereq: [], path: "meta", description: "Identify, handle, and select different types of knives (chef's, boning, paring, serrated, etc.)." },
  { id: "sharpen", name: "Sharpen", max: 3, tier: 0, prereq: [], path: "meta", description: "Learn honing and sharpening using rods, stones, and pull-through sharpeners." },
  { id: "speed", name: "Speed", max: 5, tier: 0, prereq: [{ id: "grip", points: 1 }], path: "meta", description: "Develop rhythm, efficiency, and safe fast movement through repetitive tasks." },
  { id: "slice", name: "Slice", max: 3, tier: 1, prereq: [], path: "basic", description: "Basic push-pull cut for consistent thickness across ingredients." },
  { id: "peel", name: "Peel", max: 1, tier: 1, prereq: [], path: "basic", description: "Use a paring knife or peeler for fruit and vegetable skin removal." },
  { id: "coins", name: "Coins", max: 1, tier: 1, prereq: [{ id: "slice", points: 1 }], path: "basic", description: "Even circular slices from cylindrical items like cucumbers or carrots." },
  { id: "baton", name: "Baton", max: 1, tier: 1, prereq: [{ id: "slice", points: 1 }], path: "basic", description: "Thick rectangular sticks (e.g. for crudités)." },
  { id: "chop", name: "Chop", max: 2, tier: 2, prereq: [{ id: "slice", points: 1 }], path: "basic", description: "Rapid downward cut, often for herbs and vegetables." },
  { id: "diceLarge", name: "Dice Large", max: 1, tier: 2, prereq: [{ id: "slice", points: 1 }], path: "vegetable", description: "Cut into large uniform cubes (typically ~20 mm)." },
  { id: "core", name: "Core", max: 1, tier: 2, prereq: [{ id: "peel", points: 1 }], path: "vegetable", description: "Remove seeds, stems, or internal cores of fruits and vegetables." },
  { id: "deboning", name: "Deboning", max: 2, tier: 2, prereq: [{ id: "knifeTypes", points: 1 }], path: "protein", description: "Extract bones cleanly from meat, fish, and poultry." },
  { id: "diceMedium", name: "Dice Medium", max: 1, tier: 3, prereq: [{ id: "diceLarge", points: 1 }], path: "vegetable", description: "Cut into medium cubes (~12 mm)." },
  { id: "batonnet", name: "Batonnet", max: 1, tier: 3, prereq: [{ id: "baton", points: 1 }], path: "vegetable", description: "Medium rectangular sticks (6 mm x 6 mm x 5 cm)." },
  { id: "filleting", name: "Filleting", max: 2, tier: 3, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Separate meat or fish from bones with precision." },
  { id: "oblique", name: "Oblique/Roll-Cut", max: 1, tier: 3, prereq: [{ id: "coins", points: 1 }], path: "vegetable", description: "Cut on alternating angles for decorative irregular wedges." },
  { id: "diceSmall", name: "Dice Small", max: 1, tier: 4, prereq: [{ id: "diceMedium", points: 1 }], path: "vegetable", description: "Small uniform cubes (~6 mm), often for mirepoix." },
  { id: "julienne", name: "Julienne", max: 3, tier: 4, prereq: [{ id: "batonnet", points: 1 }], path: "vegetable", description: "Thin matchstick cuts (3 mm x 3 mm x 5 cm)." },
  { id: "pinBoning", name: "Pin Boning", max: 1, tier: 4, prereq: [{ id: "filleting", points: 1 }], path: "protein", description: "Remove tiny bones left in fillets using tweezers or fingers." },
  { id: "tourné", name: "Tourné", max: 1, tier: 4, prereq: [{ id: "oblique", points: 1 }], path: "vegetable", description: "Football-shaped cut with 7 sides, often for presentation." },
  { id: "paysanne", name: "Paysanne", max: 1, tier: 4, prereq: [{ id: "diceMedium", points: 1 }], path: "vegetable", description: "Thin square, triangle, or round slices for quick cooking." },
  { id: "mince", name: "Mince", max: 1, tier: 5, prereq: [{ id: "diceSmall", points: 1 }, { id: "chop", points: 1 }], path: "basic", description: "Very fine chopping into small particles (e.g. garlic)." },
  { id: "chiffonade", name: "Chiffonade", max: 1, tier: 5, prereq: [{ id: "julienne", points: 2 }], path: "vegetable", description: "Ribbon-like strips of leafy herbs or greens." },
  { id: "brunoise", name: "Brunoise", max: 1, tier: 5, prereq: [{ id: "julienne", points: 1 }, { id: "diceSmall", points: 1 }], path: "vegetable", description: "1–2 mm precision cubes, often derived from julienne." },
  { id: "scoring", name: "Scoring Dough", max: 1, tier: 5, prereq: [{ id: "slice", points: 1 }], path: "pastry", description: "Slash dough to control expansion during baking." },
  { id: "supreme", name: "Supreme Segments", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "vegetable", description: "Segment citrus cleanly, removing all membranes." },
  { id: "butterfly", name: "Butterfly Cut", max: 1, tier: 5, prereq: [{ id: "filleting", points: 1 }], path: "protein", description: "Slice meat or fish almost in half and open it like a book." },
  { id: "spatchcock", name: "Spatchcock", max: 1, tier: 5, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Split and flatten poultry for even grilling or roasting." },
  { id: "frenching", name: "Frenching Bones", max: 1, tier: 5, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Scrape meat from bones for a clean presentation." },
  { id: "trimming", name: "Trimming Fat/Skin", max: 1, tier: 5, prereq: [{ id: "deboning", points: 1 }], path: "protein", description: "Remove excess fat or connective tissue from meats." },
  { id: "bias", name: "Bias Slice", max: 1, tier: 5, prereq: [{ id: "slice", points: 1 }], path: "pastry", description: "Angled slicing for larger surface area and elegant shape." },
  { id: "scalloping", name: "Scalloping", max: 1, tier: 5, prereq: [{ id: "slice", points: 1 }], path: "pastry", description: "Wavy decorative cuts along the edge of dough or fruit." },
  { id: "fluting", name: "Fluting Mushrooms", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "decorative", description: "Decorative grooves cut into mushroom caps." },
  { id: "channel", name: "Channel Cuts", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "decorative", description: "Striped peel patterns using a channel knife." },
  { id: "twist", name: "Citrus Twist", max: 1, tier: 5, prereq: [{ id: "peel", points: 1 }], path: "decorative", description: "Spiral garnish from citrus peel, often for drinks." },
];

// === BAKING SKILLS TREE ===
export const bakingSkillsCompact = [
  { id: "measuring", name: "Measuring", max: 2, tier: 0, prereq: [], path: "fundamentals", description: "Accurate measuring by weight and volume." },
  { id: "mixing", name: "Mixing", max: 3, tier: 0, prereq: [], path: "fundamentals", description: "Basic mixing techniques and equipment." },
  { id: "temperature", name: "Temperature", max: 2, tier: 0, prereq: [], path: "fundamentals", description: "Understanding ingredient and oven temperatures." },
  { id: "dough", name: "Basic Dough", max: 3, tier: 1, prereq: [{ id: "mixing", points: 1 }], path: "dough", description: "Simple bread and pastry doughs." },
  { id: "leavening", name: "Leavening", max: 2, tier: 1, prereq: [{ id: "measuring", points: 1 }], path: "fundamentals", description: "Yeast, baking powder, and baking soda." },
  { id: "shaping", name: "Shaping", max: 2, tier: 2, prereq: [{ id: "dough", points: 1 }], path: "dough", description: "Form dough into loaves, rolls, and shapes." },
  { id: "proofing", name: "Proofing", max: 2, tier: 2, prereq: [{ id: "leavening", points: 1 }, { id: "temperature", points: 1 }], path: "fermentation", description: "Control fermentation timing." },
  { id: "baking", name: "Baking", max: 3, tier: 3, prereq: [{ id: "shaping", points: 1 }, { id: "proofing", points: 1 }], path: "fundamentals", description: "Master oven techniques and timing." },
  { id: "decoration", name: "Decoration", max: 2, tier: 4, prereq: [{ id: "baking", points: 2 }], path: "decoration", description: "Icing, glazing, and finishing touches." },
];

export const bakingSkillsFull = [
  { id: "measuring", name: "Precision Measuring", max: 3, tier: 0, prereq: [], path: "fundamentals", description: "Master measuring by weight, volume, and baker's percentages for consistent results." },
  { id: "mixing", name: "Mixing Methods", max: 4, tier: 0, prereq: [], path: "fundamentals", description: "Creaming, folding, kneading, and understanding gluten development." },
  { id: "temperature", name: "Temperature Control", max: 3, tier: 0, prereq: [], path: "fundamentals", description: "Managing ingredient temps, room temp, and oven calibration." },
  { id: "ingredients", name: "Ingredient Knowledge", max: 2, tier: 0, prereq: [], path: "fundamentals", description: "Understanding flour types, fats, sugars, and their functions." },
  { id: "quickBreads", name: "Quick Breads", max: 2, tier: 1, prereq: [{ id: "mixing", points: 1 }, { id: "measuring", points: 1 }], path: "quick", description: "Muffins, biscuits, and chemically leavened breads." },
  { id: "yeastDough", name: "Yeast Dough", max: 3, tier: 1, prereq: [{ id: "mixing", points: 2 }, { id: "temperature", points: 1 }], path: "yeast", description: "Basic bread dough development and handling." },
  { id: "pastryDough", name: "Pastry Dough", max: 3, tier: 1, prereq: [{ id: "mixing", points: 1 }, { id: "ingredients", points: 1 }], path: "pastry", description: "Pie crust, tart dough, and laminated pastries." },
  { id: "custards", name: "Custards & Creams", max: 2, tier: 1, prereq: [{ id: "temperature", points: 1 }], path: "custard", description: "Pastry cream, crème anglaise, and egg-based preparations." },
  { id: "shaping", name: "Shaping Techniques", max: 3, tier: 2, prereq: [{ id: "yeastDough", points: 1 }], path: "yeast", description: "Form loaves, rolls, braids, and specialty shapes." },
  { id: "lamination", name: "Lamination", max: 2, tier: 2, prereq: [{ id: "pastryDough", points: 2 }], path: "pastry", description: "Create flaky layers in croissants and puff pastry." },
  { id: "fermentation", name: "Fermentation Control", max: 3, tier: 2, prereq: [{ id: "yeastDough", points: 1 }, { id: "temperature", points: 2 }], path: "yeast", description: "Bulk fermentation, proofing, and timing management." },
  { id: "fillings", name: "Fillings & Creams", max: 2, tier: 2, prereq: [{ id: "custards", points: 1 }], path: "custard", description: "Fruit fillings, buttercreams, and mousse preparations." },
  { id: "scoring", name: "Scoring & Slashing", max: 1, tier: 3, prereq: [{ id: "shaping", points: 1 }], path: "yeast", description: "Control oven spring with decorative and functional cuts." },
  { id: "ovens", name: "Oven Management", max: 3, tier: 3, prereq: [{ id: "fermentation", points: 1 }], path: "fundamentals", description: "Steam injection, stone baking, and heat management." },
  { id: "assembly", name: "Cake Assembly", max: 2, tier: 3, prereq: [{ id: "fillings", points: 1 }], path: "custard", description: "Layer cakes, torting, and structural techniques." },
  { id: "rolling", name: "Rolling & Sheeting", max: 2, tier: 3, prereq: [{ id: "lamination", points: 1 }], path: "pastry", description: "Consistent thickness for pastries and cookie dough." },
  { id: "glazing", name: "Glazing & Finishing", max: 2, tier: 4, prereq: [{ id: "ovens", points: 1 }], path: "decoration", description: "Egg wash, sugar glazes, and final touches." },
  { id: "piping", name: "Piping Techniques", max: 3, tier: 4, prereq: [{ id: "assembly", points: 1 }], path: "decoration", description: "Buttercream roses, writing, and decorative borders." },
  { id: "chocolate", name: "Chocolate Work", max: 2, tier: 4, prereq: [{ id: "temperature", points: 2 }], path: "decoration", description: "Tempering, molding, and chocolate decorations." },
  { id: "sugarWork", name: "Sugar Work", max: 2, tier: 5, prereq: [{ id: "chocolate", points: 1 }], path: "decoration", description: "Caramel, pulled sugar, and advanced decorative techniques." },
  { id: "artisan", name: "Artisan Breads", max: 3, tier: 5, prereq: [{ id: "scoring", points: 1 }, { id: "ovens", points: 2 }], path: "yeast", description: "Sourdough, specialty grains, and traditional techniques." },
];

// === SAUCE MAKING TREE ===
export const sauceSkillsCompact = [
  { id: "roux", name: "Roux", max: 2, tier: 0, prereq: [], path: "mother", description: "Basic flour and fat thickening agent." },
  { id: "stocks", name: "Stocks", max: 3, tier: 0, prereq: [], path: "base", description: "Fundamental broths and stocks." },
  { id: "emulsion", name: "Emulsion", max: 2, tier: 0, prereq: [], path: "technique", description: "Combining oil and water-based ingredients." },
  { id: "bechamel", name: "Béchamel", max: 2, tier: 1, prereq: [{ id: "roux", points: 1 }], path: "mother", description: "White sauce base with milk." },
  { id: "veloute", name: "Velouté", max: 2, tier: 1, prereq: [{ id: "roux", points: 1 }, { id: "stocks", points: 1 }], path: "mother", description: "Light stock-based sauce." },
  { id: "hollandaise", name: "Hollandaise", max: 2, tier: 1, prereq: [{ id: "emulsion", points: 1 }], path: "emulsion", description: "Warm butter emulsion sauce." },
  { id: "derivatives", name: "Derivatives", max: 3, tier: 2, prereq: [{ id: "bechamel", points: 1 }], path: "mother", description: "Cheese, mustard, and herb variations." },
  { id: "buerre", name: "Beurre Blanc", max: 2, tier: 2, prereq: [{ id: "emulsion", points: 2 }], path: "emulsion", description: "Butter emulsion with wine reduction." },
  { id: "gastrique", name: "Gastrique", max: 1, tier: 3, prereq: [{ id: "stocks", points: 2 }], path: "sweet", description: "Sweet and sour sauce base." },
];

export const sauceSkillsFull = [
  { id: "stocks", name: "Stock Making", max: 4, tier: 0, prereq: [], path: "base", description: "Master white, brown, vegetable, and fish stocks with proper technique." },
  { id: "roux", name: "Roux Techniques", max: 3, tier: 0, prereq: [], path: "thickening", description: "White, blonde, and brown roux for different sauce applications." },
  { id: "reduction", name: "Reduction Methods", max: 3, tier: 0, prereq: [], path: "concentration", description: "Concentrate flavors through proper reduction techniques." },
  { id: "emulsification", name: "Emulsification", max: 3, tier: 0, prereq: [], path: "emulsion", description: "Stable combining of oil and water-based ingredients." },
  { id: "seasoning", name: "Seasoning Balance", max: 2, tier: 0, prereq: [], path: "fundamentals", description: "Salt, acid, heat, and aromatics balance." },
  { id: "bechamel", name: "Béchamel", max: 2, tier: 1, prereq: [{ id: "roux", points: 1 }], path: "mother", description: "Classic white sauce with milk, one of the five mother sauces." },
  { id: "veloute", name: "Velouté", max: 2, tier: 1, prereq: [{ id: "roux", points: 1 }, { id: "stocks", points: 1 }], path: "mother", description: "Light stock-based mother sauce." },
  { id: "espagnole", name: "Espagnole", max: 2, tier: 1, prereq: [{ id: "roux", points: 2 }, { id: "stocks", points: 2 }], path: "mother", description: "Brown sauce made with brown stock and brown roux." },
  { id: "hollandaise", name: "Hollandaise", max: 3, tier: 1, prereq: [{ id: "emulsification", points: 1 }], path: "emulsion", description: "Warm butter emulsion sauce, temperature-sensitive mother sauce." },
  { id: "tomato", name: "Tomato Sauce", max: 2, tier: 1, prereq: [{ id: "seasoning", points: 1 }], path: "mother", description: "Fresh and canned tomato-based mother sauce." },
  { id: "allemande", name: "Allemande", max: 1, tier: 2, prereq: [{ id: "veloute", points: 1 }], path: "derivative", description: "Velouté enriched with egg yolk and cream." },
  { id: "mornay", name: "Mornay", max: 1, tier: 2, prereq: [{ id: "bechamel", points: 1 }], path: "derivative", description: "Béchamel with cheese, perfect for gratins." },
  { id: "demiglace", name: "Demi-Glace", max: 2, tier: 2, prereq: [{ id: "espagnole", points: 1 }, { id: "reduction", points: 1 }], path: "mother", description: "Reduced espagnole with stock, intense brown sauce." },
  { id: "bearnaise", name: "Béarnaise", max: 2, tier: 2, prereq: [{ id: "hollandaise", points: 2 }], path: "derivative", description: "Hollandaise variation with tarragon and shallots." },
  { id: "buerre", name: "Beurre Blanc", max: 2, tier: 2, prereq: [{ id: "emulsification", points: 2 }, { id: "reduction", points: 1 }], path: "emulsion", description: "Butter emulsion with white wine reduction." },
  { id: "coulis", name: "Coulis", max: 2, tier: 2, prereq: [{ id: "tomato", points: 1 }], path: "puree", description: "Smooth fruit or vegetable purée sauces." },
  { id: "soubise", name: "Soubise", max: 1, tier: 3, prereq: [{ id: "bechamel", points: 1 }], path: "derivative", description: "Onion-enriched béchamel sauce." },
  { id: "chasseur", name: "Chasseur", max: 1, tier: 3, prereq: [{ id: "demiglace", points: 1 }], path: "derivative", description: "Hunter's sauce with mushrooms and herbs." },
  { id: "gastrique", name: "Gastrique", max: 2, tier: 3, prereq: [{ id: "reduction", points: 2 }], path: "sweet", description: "Sweet and sour sauce base with caramel and vinegar." },
  { id: "chutney", name: "Chutney", max: 2, tier: 3, prereq: [{ id: "coulis", points: 1 }], path: "condiment", description: "Fruit and vegetable relishes with spices." },
  { id: "aïoli", name: "Aïoli & Mayonnaise", max: 2, tier: 3, prereq: [{ id: "emulsification", points: 2 }], path: "emulsion", description: "Cold emulsion sauces with egg yolk base." },
  { id: "vinaigrette", name: "Vinaigrettes", max: 2, tier: 3, prereq: [{ id: "emulsification", points: 1 }], path: "emulsion", description: "Oil and acid emulsions for salads and finishing." },
  { id: "compound", name: "Compound Butters", max: 2, tier: 4, prereq: [{ id: "seasoning", points: 2 }], path: "finishing", description: "Herb and spice-infused butter for finishing dishes." },
  { id: "foam", name: "Foams & Airs", max: 2, tier: 4, prereq: [{ id: "emulsification", points: 3 }], path: "modern", description: "Modern light sauce textures using lecithin and immersion blending." },
  { id: "molecular", name: "Molecular Techniques", max: 2, tier: 5, prereq: [{ id: "foam", points: 1 }], path: "modern", description: "Spherification, gelification, and modernist sauce techniques." },
];

// === SKILL TREE REGISTRY ===
export const skillTrees = {
  'knife-skills': {
    name: 'Knife Skills',
    description: 'Master the fundamental cutting techniques that form the foundation of all cooking',
    icon: '🔪',
    compactData: knifeSkillsCompact,
    fullData: knifeSkillsFull,
    paths: ["meta", "basic", "vegetable", "protein", "decorative", "pastry"]
  },
  'baking': {
    name: 'Baking & Pastry',
    description: 'Learn the precise art of baking from basic breads to advanced pastry techniques',
    icon: '🥖',
    compactData: bakingSkillsCompact,
    fullData: bakingSkillsFull,
    paths: ["fundamentals", "dough", "yeast", "pastry", "custard", "fermentation", "decoration", "quick"]
  },
  'sauces': {
    name: 'Sauce Making',
    description: 'Master the five mother sauces and their derivatives, plus modern sauce techniques',
    icon: '🥄',
    compactData: sauceSkillsCompact,
    fullData: sauceSkillsFull,
    paths: ["base", "mother", "derivative", "emulsion", "thickening", "concentration", "fundamentals", "puree", "sweet", "condiment", "finishing", "modern"]
  }
};

// === LEARNING PATHS ===
export const learningPaths = {
  'beginner-cook': {
    name: 'Beginner Cook',
    description: 'Essential skills for anyone starting their culinary journey',
    icon: '👶',
    skills: [
      { treeId: 'knife-skills', skillId: 'grip', targetPoints: 2 },
      { treeId: 'knife-skills', skillId: 'slice', targetPoints: 2 },
      { treeId: 'knife-skills', skillId: 'dice', targetPoints: 1 },
      { treeId: 'baking', skillId: 'measuring', targetPoints: 1 },
      { treeId: 'sauces', skillId: 'stocks', targetPoints: 1 },
      { treeId: 'sauces', skillId: 'seasoning', targetPoints: 1 },
    ]
  },
  'vegetarian-prep': {
    name: 'Vegetarian Prep Master',
    description: 'Perfect your vegetable preparation and plant-based cooking techniques',
    icon: '🥕',
    skills: [
      { treeId: 'knife-skills', skillId: 'slice', targetPoints: 3 },
      { treeId: 'knife-skills', skillId: 'dice', targetPoints: 3 },
      { treeId: 'knife-skills', skillId: 'julienne', targetPoints: 2 },
      { treeId: 'knife-skills', skillId: 'chiffonade', targetPoints: 1 },
      { treeId: 'knife-skills', skillId: 'brunoise', targetPoints: 1 },
      { treeId: 'sauces', skillId: 'coulis', targetPoints: 2 },
      { treeId: 'sauces', skillId: 'vinaigrette', targetPoints: 2 },
    ]
  },
  'protein-mastery': {
    name: 'Protein Mastery',
    description: 'Advanced techniques for preparing meat, fish, and poultry',
    icon: '🥩',
    skills: [
      { treeId: 'knife-skills', skillId: 'knifeTypes', targetPoints: 3 },
      { treeId: 'knife-skills', skillId: 'deboning', targetPoints: 2 },
      { treeId: 'knife-skills', skillId: 'filleting', targetPoints: 2 },
      { treeId: 'knife-skills', skillId: 'butterfly', targetPoints: 1 },
      { treeId: 'knife-skills', skillId: 'spatchcock', targetPoints: 1 },
      { treeId: 'knife-skills', skillId: 'frenching', targetPoints: 1 },
      { treeId: 'sauces', skillId: 'stocks', targetPoints: 3 },
      { treeId: 'sauces', skillId: 'demiglace', targetPoints: 2 },
    ]
  },
  'pastry-chef': {
    name: 'Pastry Chef Path',
    description: 'Professional-level baking and pastry techniques',
    icon: '🎂',
    skills: [
      { treeId: 'baking', skillId: 'measuring', targetPoints: 3 },
      { treeId: 'baking', skillId: 'mixing', targetPoints: 4 },
      { treeId: 'baking', skillId: 'pastryDough', targetPoints: 3 },
      { treeId: 'baking', skillId: 'lamination', targetPoints: 2 },
      { treeId: 'baking', skillId: 'custards', targetPoints: 2 },
      { treeId: 'baking', skillId: 'piping', targetPoints: 3 },
      { treeId: 'baking', skillId: 'chocolate', targetPoints: 2 },
      { treeId: 'baking', skillId: 'sugarWork', targetPoints: 2 },
    ]
  },
  'sauce-master': {
    name: 'Sauce Master',
    description: 'Complete mastery of classical and modern sauce techniques',
    icon: '🥄',
    skills: [
      { treeId: 'sauces', skillId: 'stocks', targetPoints: 4 },
      { treeId: 'sauces', skillId: 'roux', targetPoints: 3 },
      { treeId: 'sauces', skillId: 'bechamel', targetPoints: 2 },
      { treeId: 'sauces', skillId: 'veloute', targetPoints: 2 },
      { treeId: 'sauces', skillId: 'espagnole', targetPoints: 2 },
      { treeId: 'sauces', skillId: 'hollandaise', targetPoints: 3 },
      { treeId: 'sauces', skillId: 'demiglace', targetPoints: 2 },
      { treeId: 'sauces', skillId: 'molecular', targetPoints: 2 },
    ]
  }
};

// Helper function to get skills for current tree
export function getSkillsForTree(treeId, compactMode = false) {
  const tree = skillTrees[treeId];
  if (!tree) return [];
  return compactMode ? tree.compactData : tree.fullData;
}

// Helper function to get available tree IDs
export function getAvailableTreeIds() {
  return Object.keys(skillTrees);
}

// Helper function to get tree info
export function getTreeInfo(treeId) {
  return skillTrees[treeId] || null;
}