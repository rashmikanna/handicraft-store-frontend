// src/pages/ExploreCollections.js
import React from 'react';
import './ExploreCollections.css';

const categories = [
  {
    title: "Silver Crafts",
    description: `Handcrafted using pure silver, these creations are forged using traditional casting and engraving techniques passed down through generations. Each piece is meticulously shaped and hammered by artisans who treat silver not just as a metal but as a canvas of cultural expression. The designs often depict mythological tales, tribal symbols, or nature-inspired motifs. Polishing and intricate filigree work bring life and shine to these masterpieces.`,
  },
  {
    title: "Handlooms & Textiles",
    description: `Woven in the rhythmic beats of looms, Telangana’s handlooms embody the spirit of its weavers. Using natural dyes and eco-friendly yarns like cotton and silk, these textiles tell stories through motifs, colors, and patterns. From Pochampally’s famous Ikkat to the fine Muslin of Gadwal, every weave carries tradition, love, and patience. These fabrics are breathable, sustainable, and timeless in their beauty.`,
  },
  {
    title: "Metal Crafts",
    description: `From the ancient Bidriware of Bidar to tribal Dokra art, Telangana's metal crafts are a fusion of fire, tradition, and intricate detailing. These items are molded using the lost-wax method or forged with chisels and hammers. Pure silver, brass, and zinc are commonly used, adorned with geometric or religious carvings. These pieces often serve both aesthetic and spiritual purposes in homes and temples.`,
  },
  {
    title: "Textiles & Embroidery",
    description: `Threaded with stories, each fabric is a storyteller. Phulkari, mirror work, and Zardozi are more than decorations — they are reflections of festivals, rituals, and generational memories. Artisans use silks, chiffons, and cottons, embedding each with motifs of flora, fauna, and folklore using traditional needles, beads, and mirrors. The final product is vibrant, layered with texture, and full of emotion.`,
  },
  {
    title: "Paintings & Art",
    description: `Inspired by mythology, village life, and temple murals, Telangana's art is both spiritual and expressive. Styles like Kalamkari are made using natural dyes, hand-painted with bamboo pens and brushes. These artworks depict scenes from epics, everyday rural life, and cultural celebrations. Every brushstroke is rooted in reverence, and the colors are created from plants, minerals, and organic extracts.`,
  },
  {
    title: "Home Decor",
    description: `From terracotta pottery to bamboo furniture, Telangana’s home decor items merge tradition with utility. Crafted by hand with eco-friendly materials like clay, jute, and cane, these pieces celebrate rural ingenuity. Each artifact — be it a diya, wall hanging, or handcrafted lamp — holds a story, a legacy, and a spirit of sustainability. They infuse homes with warmth, culture, and authenticity.`,
  },
];

const ExploreCollections = () => {
  return (
    <div className="collections-container">
      <h1 className="title">How Our Collections are Made</h1>
      {categories.map((category, index) => (
        <div className="category-card" key={index}>
          <h2>{category.title}</h2>
          <p>{category.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ExploreCollections;
