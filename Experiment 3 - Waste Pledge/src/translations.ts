export type Language = 'fi' | 'en';

type FoodMessage = {
  title: string;
  description: string;
};

type Messages = {
  [key in 'tomato' | 'bread' | 'pizza']: {
    fi: FoodMessage;
    en: FoodMessage;
  };
};

const messages: Messages = {
  tomato: {
    fi: {
      title: 'Flavoriassa heitettiin 79 kg ruokaa roskiin viime viikolla.',
      description: 'Ota vain sen verran kuin jaksat syödä. Vähennetään ruokahävikkiä yhdessä.'
    },
    en: {
      title: '79 kg of food was wasted in Flavoria last week.',
      description: 'Take only what you can eat. Let\'s reduce food waste together.'
    }
  },
  bread: {
    fi: {
      title: 'Viime viikolla Flavorian ruokailijoiden lautasilta päätyi roskiin yli 79 kiloa ruokaa.',
      description: 'Pienetkin teot vaikuttavat. Valitse viisaasti.'
    },
    en: {
      title: 'Diners at Flavoria wasted over 79 kg of food last week.',
      description: 'Your small actions can make a big impact. Choose mindfully.'
    }
  },
  pizza: {
    fi: {
      title: 'Lautasellasi olevat valinnat muokkaavat planeettaamme.',
      description: 'Viime viikolla 79 kg ruokaa päätyi jätteeksi Flavoriassa. Pystymme parempaan.'
    },
    en: {
      title: 'What\'s on your plate shapes our planet.',
      description: 'Last week, 79 kg of food went to waste in Flavoria. Let\'s do better.'
    }
  }
};

export const translations = {
  fi: {
    title: 'Jokainen siivu merkitsee.',
    subtitle: 'Haluatko auttaa? Pyyhkäise alas leikataksesi ja katso miten',
    participantsText: 'ihmistä on sitoutunut vähentämään ruokahävikkiä. Liitytkö mukaan?',
    thankYou: 'Kiitos!',
    dialogDescription: 'Ystävällinen tekosi tekee maailmasta paremman paikan. Yhdessä voimme luoda reseptin positiiviselle muutokselle!',
    sliceAnother: 'Leikkaa uudestaan!',
    switchLanguage: 'Switch to English',
    takePledge: 'Sitoudun ottamaan vain sen verran ruokaa kuin jaksan syödä ja autan vähentämään ruokahävikkiä Flavoriassa.',
    pledgeButton: 'Sitoudun tähän',
    pledgeThankYou: 'Kiitos, että välität! 🙏',
    slideDown: 'Pyyhkäise alas',
    facts: [
      "1/3 kaikesta leivästä menee maailmanlaajuisesti hukkaan",
      "Ruokahävikin vähentäminen voisi säästää jopa 8% maailmanlaajuisista päästöistä",
      "Keskivertoperhe tuhlaa 1 500 € ruokaan vuosittain",
      "40% kaikesta tuotetusta ruoasta menee hukkaan"
    ]
  },
  en: {
    title: 'Every slice counts.',
    subtitle: 'Want to help? Swipe down to cut and see how',
    participantsText: 'people have pledged to reduce food waste. Will you?',
    thankYou: 'Thank You!',
    dialogDescription: 'Your generous slice of kindness makes the world a better place. Together, we can create a recipe for positive change!',
    sliceAnother: 'Slice Another!',
    switchLanguage: 'Vaihda suomeksi',
    takePledge: 'I commit to taking only what I can finish and helping reduce food waste at Flavoria.',
    pledgeButton: 'Take the Pledge',
    pledgeThankYou: 'Thanks for caring! 🙏',
    slideDown: 'Slide Down',
    facts: [
      "1 in 3 loaves of bread is wasted globally",
      "Reducing food waste could save up to 8% of global emissions",
      "The average family wastes $1,500 in food annually",
      "40% of all food produced goes to waste"
    ]
  }
} as const;

export { messages };