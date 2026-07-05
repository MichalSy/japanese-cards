-- Fix German A1 "er" audio with the approved short ElevenLabs cut.

begin;

update language_cards_cards
set audio_url = 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-people-er-elevenlabs-slow-cut-20260705/de-a1-people-er.mp3'
where slug = 'de-a1-people-er';

commit;
