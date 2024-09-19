// scripts/populateCards.js

const pokemon = require('pokemontcgsdk');
const axios = require('axios');
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Set the API key for the Pokémon TCG SDK
pokemon.configure({ apiKey: process.env.POKEMON_API_KEY });

// Function to fetch the most recent 20 pages of Pokémon cards
async function fetchRecentPokemonCards() {
  let allCards = [];
  const pageSize = 250;
  const maxPages = 20; // Fetch only the first 20 pages
  const orderBy = '-set.releaseDate'; // Sort by release date descending

  for (let page = 1; page <= maxPages; page++) {
    try {
      console.log(`Fetching Pokémon cards - Page ${page}`);
      const result = await pokemon.card.where({ pageSize, page, orderBy });
      const cards = result.data;

      if (cards && cards.length > 0) {
        allCards = allCards.concat(cards);
      } else {
        console.log(`No more cards found on page ${page}.`);
        break;
      }
    } catch (error) {
      console.error(`Error fetching Pokémon cards on page ${page}:`, error);
      break;
    }
  }

  console.log(`Total Pokémon cards fetched: ${allCards.length}`);
  return allCards;
}

// Function to fetch and store Pokémon cards in the database
async function fetchAndStorePokemonCards() {
  try {
    // Fetch recent Pokémon cards
    const cards = await fetchRecentPokemonCards();

    // Loop through each card and insert it into the database
    for (const card of cards) {
      const { id, name, images, tcgplayer } = card;
      const imageUrl = images?.small || '';
      const price =
        tcgplayer?.prices?.normal?.high ||
        tcgplayer?.prices?.holofoil?.high ||
        tcgplayer?.prices?.reverseHolofoil?.high ||
        tcgplayer?.prices?.firstEditionHolofoil?.high ||
        0;
      const stats = {
        hp: card.hp,
        types: card.types,
        attacks: card.attacks,
        weaknesses: card.weaknesses,
        resistances: card.resistances,
      };
      const description = card.flavorText || card.text || '';

      await pool.query(
        `INSERT INTO cards (id, name, image_url, price, stats, description, last_updated, brand)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
         ON CONFLICT (id) DO UPDATE
         SET name = $2, image_url = $3, price = $4, stats = $5, description = $6, last_updated = NOW(), brand = $7`,
        [id, name, imageUrl, price, JSON.stringify(stats), description, 'pokemon']
      );
    }

    console.log('Pokémon cards populated successfully.');
  } catch (error) {
    console.error('Error populating Pokémon cards:', error);
  }
}

// Function to fetch and store Yu-Gi-Oh! cards in the database
async function fetchAndStoreYugiohCards() {
  try {
    const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    const response = await axios.get(apiUrl);

    const cards = response.data.data;

    for (const card of cards) {
      const { id, name, card_images, card_prices } = card;
      const imageUrl = card_images?.[0]?.image_url_small || '';
      const price = parseFloat(card_prices?.[0]?.tcgplayer_price || 0);
      const stats = {
        atk: card.atk,
        def: card.def,
        type: card.type,
        level: card.level,
        race: card.race,
        archetype: card.archetype,
      };
      const description = card.desc || '';

      await pool.query(
        `INSERT INTO cards (id, name, image_url, price, stats, description, last_updated, brand)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
         ON CONFLICT (id) DO UPDATE
         SET name = $2, image_url = $3, price = $4, stats = $5, description = $6, last_updated = NOW(), brand = $7`,
        [id.toString(), name, imageUrl, price, JSON.stringify(stats), description, 'yugioh']
      );
    }

    console.log('Yu-Gi-Oh! cards populated successfully.');
  } catch (error) {
    console.error('Error populating Yu-Gi-Oh! cards:', error);
  }
}

// Main function to execute card imports
async function main() {
  await fetchAndStorePokemonCards();
  await fetchAndStoreYugiohCards();
  await pool.end();
}

// Execute the main function
main();
