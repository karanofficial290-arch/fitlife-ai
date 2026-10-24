import { LegalPage } from '@/features/legal/LegalPage';

export default function PrivacyPolicyScreen() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="24 Oct 2026"
      intro="Ye policy batati hai ki FITMXO app aapka kaunsa data leti hai, kyun leti hai, kahan rakhti hai aur aap use kaise delete kar sakte hain."
      sections={[
        {
          heading: 'Hum kaunsa data lete hain',
          body: [
            'Account: naam, email address, password (encrypted form mein, hum use padh nahi sakte).',
            'Profile: janam tithi, gender, aur agar aap dein toh mobile number.',
            'Fitness data jo aap app mein daalte hain: workouts, paani, khana (calories aur macros), weight aur goals.',
            'Hum aapki location, contacts, photos, microphone ya camera access nahi karte.',
          ],
        },
        {
          heading: 'Data ka use',
          body: [
            'Sirf app chalane ke liye: aapki progress dikhana, workout aur meal history save karna, aur aapke data par based tips dena.',
            'Hum aapka data bechte nahi hain aur advertising ke liye use nahi karte.',
          ],
        },
        {
          heading: 'Data kahan rakha jata hai',
          body: [
            'Data Supabase (cloud database) par surakshit rakha jata hai. Har user sirf apna data dekh aur badal sakta hai — ye database ke security rules (Row Level Security) se lagu hota hai.',
            'App aur server ke beech saara traffic HTTPS se encrypted hota hai.',
          ],
        },
        {
          heading: 'Aapke adhikaar',
          body: [
            'Aap apna data app mein dekh aur badal sakte hain.',
            'Account aur saara data delete karne ka option Profile screen mein aa raha hai. Tab tak delete request ke liye humein contact karein.',
          ],
        },
        {
          heading: 'Umar',
          body: ['FITMXO 13 saal se kam umar ke logon ke liye nahi hai.'],
        },
        {
          heading: 'Health disclaimer',
          body: [
            'FITMXO general fitness jaankari deta hai, medical advice nahi. Koi health problem ho toh doctor se salah lein.',
          ],
        },
        {
          heading: 'Contact',
          body: ['Privacy se jude sawaalon ke liye: [owner ka support email yahan aayega].'],
        },
      ]}
    />
  );
}
