// src/pages/Sellers.js
import React from 'react';
import './Sellers.css';

const sellers = [
  {
    name: "Ravi Chary",
    story: `In the dusty lanes of Warangal, Ravi Chary learned the intricate art of brass engraving from his grandfather, who was once the royal artisan for temple ceremonies. As a child, Ravi would spend countless hours watching flames melt brass and his grandfather’s hands etch sacred scripts and motifs with divine patience. With time, Ravi turned the skill into a passion-driven profession. Today, his creations depict not only Telangana’s dynasties and temple tales but also modern reinterpretations of tradition, blending history with contemporary aesthetics. He now mentors village youth, ensuring that this age-old craft never fades.`,
  },
  {
    name: "Meenakshi Devi",
    story: `In the peaceful village of Pochampally, surrounded by paddy fields and humming looms, young Meenakshi Devi wove her first saree at just 12. Raised in a family of master weavers, every warp and weft carried generational wisdom. Her fingers danced to rhythmical patterns passed down by her mother, who sang while spinning yarn dyed with turmeric, indigo, and marigold. Now, Meenakshi is a cultural ambassador of the famed Ikkat tradition. Her sarees aren’t just garments — they are layered memoirs of village life, lullabies, and sunsets reflected in silken threads. With every weave, she strengthens the identity of Telangana's textile heartland.`,
  },
  {
    name: "Gopal Naik",
    story: `In the heart of Bidar, where centuries-old secrets lie buried in blackened soil, Gopal Naik holds a legacy that traces back to the Bahmani sultans. His ancestors pioneered the rare silver inlay work known as Bidriware — a mystical art passed orally and guarded within families. Gopal, despite modern challenges, continues to revive this ancient craft using traditional tools and pure silver. His hands can narrate Islamic geometry and temple murals alike, revealing their essence on vases, plates, and jewellery boxes. He often says, "I don’t create art, I awaken memories in metal." Through his workshops, he rekindles dying traditions in young hands.`,
  },
  {
    name: "Lakshmi Bai",
    story: `In a tiny courtyard in Srikalahasti, Lakshmi Bai sits cross-legged with bamboo pens, homemade dyes, and age-old stories. As the temple bell chimes, she begins her Kalamkari art — painting mythologies, epics, and folklore with fluid elegance. Her style was honed under mango trees, learning from temple priests and watching her mother stir dyes made of cow dung, jaggery, and pomegranate peels. Every swirl, every shade holds spiritual reverence and cultural truth. Her art today is sought globally, yet she insists on preserving its sanctity by hand-painting every inch. Through her brush, forgotten gods and goddesses find new life.`,
  },
  {
    name: "Dinesh Rao",
    story: `By the serene banks of the Godavari, Dinesh Rao crafts clay into heritage. A potter from Nirmal, Dinesh belongs to a family that has created terracotta oil lamps for centuries. At the age of 8, he molded his first diya during Kartika Purnima, lighting both his home and his destiny. His hands shape more than pottery — they shape festivals, ancestral memories, and community prayers. Now, his work blends traditional symbolism with innovative designs. Whether it's Ganesha idols or modern planters, each piece carries the essence of earth, water, and fire. Dinesh trains tribal youth, ensuring the wheel of tradition keeps spinning.`,
  },
  {
    name: "Farzana Begum",
    story: `In the bustling alleys of Old Hyderabad, under latticed balconies and echoing azaans, Farzana Begum weaves stories into silks. Raised by a lineage of needle artisans, she learned to stitch Nizami elegance into every thread. Her grandmother would narrate tales of court dances, royal trousseaus, and secret love stories as Farzana practiced zardozi and mirror work under flickering chandeliers. Today, her creations are a blend of heritage and modern elegance — sought after by designers and heritage lovers alike. Farzana's workshop employs dozens of women from marginalized backgrounds, giving them financial freedom and pride in their legacy.`,
  },
  {
    name: "Ramulu",
    story: `Ramulu belongs to the tribal heartland of Adilabad, where the forests speak in winds and legends. As a child, he would follow his father deep into the forest to collect beeswax, rice husks, and river clay — the sacred ingredients of Dokra craft. Inspired by nature and spirit, Ramulu creates raw, untouched bronze figures — gods, animals, and tribal myths forged in fire and belief. Each artifact takes weeks to complete, molded in clay and cast using the lost-wax method. His art isn't polished — it is primal, spiritual, and honest, much like his people. Ramulu’s work now resides in museums, yet he lives simply, teaching art to Adivasi children by moonlight.`,
  },
  {
    name: "Priya Reddy",
    story: `Born in a village where every celebration was stitched into fabric, Priya Reddy grew up surrounded by silk threads, thimbles, and her grandmother’s stories. From the vibrant chaos of wedding rituals to the tranquil beauty of harvest festivals, every memory was immortalized through Phulkari and mirror embroidery. Priya transformed her hobby into a heartfelt mission — to revive Telangana’s needlework culture. Her embroidery is not just decorative but poetic — each motif inspired by local flora, folk songs, and family blessings. Today, her garments tell tales of love, strength, and rural grace, stitched carefully into timeless fabric.`,
  },
  {
    name: "Venkat Yadav",
    story: `Nestled in the green hills of Bhadrachalam, Venkat Yadav grew up listening to forest chants and temple hymns. His fingers quickly learned to weave bamboo into utilitarian poetry. With precision and respect for nature, he crafts baskets, furniture, and art pieces that narrate tribal myths, stories of Lord Rama, and ancient hunting rituals. His ancestors believed that every bamboo cane holds a spirit — and Venkat honours that belief with every creation. He now leads a cooperative of tribal artisans, ensuring sustainable harvesting and fair trade. His vision is clear: to put Telangana’s tribal craft on the global map while preserving its sacred roots.`,
  },
  {
    name: "Sunita Sharma",
    story: `Sunita Sharma, a bangle-maker from Karimnagar, transforms molten resin into sparkling dreams. Under her mother’s watchful eye, she began her journey by kneading the lac and adding crushed glass pieces that would shimmer like stars. Inspired by tales of Kakatiya queens and their palace rituals, Sunita designs bangles that are both traditional and trendy. Her fingers work with rhythm — twisting, pressing, setting — breathing life into color. From bridal collections to minimalist styles, her bangles are worn by women across India. Sunita also runs a workshop training young girls, helping them earn with pride while keeping tradition alive.`,
  },
];

const Sellers = () => {
  return (
    <div className="sellers-container">
      <h1 className="title">Our Honoured Artisans</h1>
      {sellers.map((seller, index) => (
        <div className="seller-card" key={index}>
          <div className="seller-info">
            <h2>{seller.name}</h2>
            <p>{seller.story}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sellers;
