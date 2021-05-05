const items = [
  {
    name: 'Adamantine Armor',
    description: 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you\'re wearing it, any critical hit against you becomes a normal hit.',
    type: 'Armor (medium or heavy)',
    rarity: 'uncommon',
    requiresAttunement: false
  },
  {
    name: 'Amulet of Health',
    description: 'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
    type: 'Wondrous item',
    rarity: 'rare',
    requiresAttunement: true
  },
  {
    name: 'Amulet of Proof against Detection and Location',
    description: 'While wearing this amulet, you are hidden from divination magic. You can\'t be targeted by such magic or perceived through magical scrying sensors.',
    type: 'Wondrous item',
    rarity: 'uncommon',
    requiresAttunement: true
  },
  {
    name: 'Amulet of the Planes',
    description: 'While wearing this amulet, you can use an action toname a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the _plane shift_ spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1-60, you travel to a random location on the plane youname . On a 61-100, you travel to a randomly determined plane of existence.',
    type: 'Wondrous iem', 'rarity': 'very rare',
    requiresAttunement: true
  },
  {
    name: 'Animated Shield',
    description: 'While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.',
    type: 'Armor (shield)',
    rarity: 'very rare',
    requiresAttunement: true
  },
];

export default items;