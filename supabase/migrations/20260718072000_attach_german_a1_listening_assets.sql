-- Persist generated image and audio assignments for German listening lesson 8.
begin;

with assets(slug, image_id, audio_url) as (
  values
  ('de-a1-listen-ich-esse-brot', 'efdcf644-d0a8-4fa8-b602-3c8833994d72', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-ich-esse-brot.mp3'),
  ('de-a1-listen-du-trinkst-tee', 'b3c86ea0-ed11-45d4-985b-09778c065e4f', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-du-trinkst-tee.mp3'),
  ('de-a1-listen-er-liest-die-zeitung', 'c920a465-76dc-432d-b540-5d4935cfc744', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-er-liest-die-zeitung.mp3'),
  ('de-a1-listen-sie-schreibt-eine-e-mail', '194e1ec8-0472-412d-a804-c77663f3f69f', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-sie-schreibt-eine-e-mail.mp3'),
  ('de-a1-listen-wir-lernen-zusammen', '6bb92c75-fd04-44ab-88db-fdac3b93028e', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-wir-lernen-zusammen.mp3'),
  ('de-a1-listen-ihr-spielt-fussball', '9d195bb2-dbfb-48c3-aa20-0ad2f7a5388e', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-ihr-spielt-fussball.mp3'),
  ('de-a1-listen-das-baby-schlaeft', '1ef5da88-4404-469a-9d53-05be3d91b834', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-das-baby-schlaeft.mp3'),
  ('de-a1-listen-mein-bruder-kocht-suppe', '61dfcb33-734f-461b-a012-3b63f1e1828e', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-mein-bruder-kocht-suppe.mp3'),
  ('de-a1-listen-meine-schwester-kauft-milch', '0df86f83-4cd7-494b-b977-95ffb27b4474', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-meine-schwester-kauft-milch.mp3'),
  ('de-a1-listen-der-lehrer-oeffnet-das-fenster', 'b8a24dd2-6ce8-4be4-93f6-b7521d67a0fd', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-der-lehrer-oeffnet-das-fenster.mp3'),
  ('de-a1-listen-die-frau-schliesst-die-tuer', '248711c3-0cc5-409d-8dc8-64600122cfb0', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-die-frau-schliesst-die-tuer.mp3'),
  ('de-a1-listen-der-mann-wartet-am-bahnhof', '32ea9419-252e-43c7-9a42-78d8c44a40cb', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-der-mann-wartet-am-bahnhof.mp3'),
  ('de-a1-listen-ich-fahre-mit-dem-bus', 'f19c3075-bcf2-4f84-8bc1-27669903a6db', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-ich-fahre-mit-dem-bus.mp3'),
  ('de-a1-listen-du-gehst-nach-hause', 'fdde7cbc-baa9-4835-a1ff-78ea4511d439', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-du-gehst-nach-hause.mp3'),
  ('de-a1-listen-heute-regnet-es', '65a3ff5c-9957-4bf9-bdd1-82931accbeec', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-heute-regnet-es.mp3'),
  ('de-a1-listen-morgen-scheint-die-sonne', 'd8fdc261-208d-41a8-b258-4bfb16b99095', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-morgen-scheint-die-sonne.mp3'),
  ('de-a1-listen-das-buch-liegt-auf-dem-tisch', '05395dae-446b-4e16-b0c6-6f4c0df8907d', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-das-buch-liegt-auf-dem-tisch.mp3'),
  ('de-a1-listen-die-kinder-spielen-im-garten', 'd3d84fc2-6792-4e6a-b452-2e67949687bb', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-die-kinder-spielen-im-garten.mp3'),
  ('de-a1-listen-um-acht-uhr-beginnt-die-schule', '9dcab919-0c83-4997-94da-fa8f14977aab', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-um-acht-uhr-beginnt-die-schule.mp3'),
  ('de-a1-listen-am-abend-sehe-ich-fern', '0b2bde9f-75bc-4067-a788-805480c0b9b7', 'https://pqnfiqczcxnwaenylysb.supabase.co/storage/v1/object/public/language-cards/audio/de-a1/basics-listening-sentences-listening-20260718/de-a1-listen-am-abend-sehe-ich-fern.mp3')
)
update language_cards_cards card
set image_id = assets.image_id::uuid,
    audio_url = assets.audio_url
from assets
where card.slug = assets.slug
  and card.context = 'de-a1-listening-sentences'
  and card.card_type = 'sentence';

update language_cards_cards quiz
set audio_url = source.audio_url
from language_cards_cards source
where quiz.context = 'de-a1-listening-sentences'
  and quiz.card_type = 'sentence_quiz'
  and source.slug = quiz.data->>'source_card_slug'
  and source.card_type = 'sentence';

commit;
