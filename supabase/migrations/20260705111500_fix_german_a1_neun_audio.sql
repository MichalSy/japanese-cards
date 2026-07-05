-- Fix German A1 "neun" audio with a clean ElevenLabs generation.

begin;

update language_cards_cards
set audio_url = 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-numbers-time-neun-elevenlabs-fix-20260705/de-a1-numbers-time-neun.mp3'
where slug = 'de-a1-numbers-time-neun';

commit;
