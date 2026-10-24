import { LegalPage } from '@/features/legal/LegalPage';

export default function TermsScreen() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="24 Oct 2026"
      intro="FITMXO use karke aap in sharton ko maante hain."
      sections={[
        {
          heading: 'Account',
          body: [
            'Account banane ke liye aapki umar kam se kam 13 saal honi chahiye aur di gayi jaankari sahi honi chahiye.',
            'Apna password surakshit rakhna aapki zimmedari hai.',
          ],
        },
        {
          heading: 'Health aur safety',
          body: [
            'Workouts aur nutrition tips general jaankari hain, medical advice nahi. Koi injury, bimari ya pregnancy ho toh exercise ya diet shuru karne se pehle doctor se salah lein.',
            'Dard, chakkar ya saans phoolne par turant exercise rok dein.',
            'Apni capacity ke hisaab se exercise karein. Kisi bhi injury ki zimmedari user ki hogi.',
          ],
        },
        {
          heading: 'Sahi use',
          body: [
            'App ka galat use, doosre users ke data tak pahunchne ki koshish, ya service ko nuksaan pahunchana mana hai.',
          ],
        },
        {
          heading: 'Service mein badlaav',
          body: [
            'Hum app ke features badal ya sudhaar sakte hain. Zaroori badlaav hone par app mein bataya jayega.',
          ],
        },
        {
          heading: 'Account band karna',
          body: ['Aap kabhi bhi account band karke data delete karwa sakte hain (Privacy Policy dekhein).'],
        },
        {
          heading: 'Contact',
          body: ['Sawaalon ke liye: [owner ka support email yahan aayega].'],
        },
      ]}
    />
  );
}
