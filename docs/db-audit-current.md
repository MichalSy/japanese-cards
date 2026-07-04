# Japanese Cards DB Audit

Generated: 2026-07-04T18:04:07.953Z

## Tables
| Table | Status | Rows / Error |
| --- | --- | --- |
| language_cards_languages | exists | 3 |
| language_cards_tracks | exists | 11 |
| language_cards_track_translations | exists | 22 |
| language_cards_track_categories | exists | 19 |
| language_cards_categories | exists | 19 |
| language_cards_category_translations | exists | 38 |
| language_cards_learning_courses | exists | 7 |
| language_cards_learning_course_translations | exists | 14 |
| language_cards_learning_lessons | exists | 60 |
| language_cards_learning_lesson_translations | exists | 120 |
| language_cards_learning_lesson_cards | exists | 806 |
| language_cards_practice_groups | exists | 21 |
| language_cards_practice_group_translations | exists | 42 |
| language_cards_practice_group_cards | exists | 202 |
| language_cards_cards | exists | 792 |
| language_cards_card_translations | exists | 456 |
| language_cards_user_settings | exists | 5 |
| language_cards_user_card_progress | exists | 350 |
| language_cards_category_snapshots | exists | 4 |
| language_cards_user_sessions | exists | 62 |

## Languages
| ID | Name EN | UI | Learn | Active | Sort |
| --- | --- | --- | --- | --- | --- |
| de | German | true | true | true | 1 |
| en | English | true | false | true | 2 |
| ja | Japanese | false | true | true | 3 |

## Tracks
| Language | Slug | System | Level | Status | Sort |
| --- | --- | --- | --- | --- | --- |
| ja | jlpt-n5 | jlpt | N5 | active | 1 |
| de | de-a1 | cefr | A1 | active | 1 |
| ja | jlpt-n4 | jlpt | N4 | planned | 2 |
| de | de-a2 | cefr | A2 | planned | 2 |
| de | de-b1 | cefr | B1 | planned | 3 |
| ja | jlpt-n3 | jlpt | N3 | planned | 3 |
| ja | jlpt-n2 | jlpt | N2 | planned | 4 |
| de | de-b2 | cefr | B2 | planned | 4 |
| ja | jlpt-n1 | jlpt | N1 | planned | 5 |
| de | de-c1 | cefr | C1 | planned | 5 |
| de | de-c2 | cefr | C2 | planned | 6 |

## Categories
| Language | Slug | Card Type | is_active | status | Sort | Show All | Game Modes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| de | de-a1-start | vocabulary | true | active | 1 | false | swipe |
| ja | hiragana | character | true | active | 1 | true | swipe, multiChoice, flashcard, typing |
| de | de-a1-people | vocabulary | true | active | 2 | false | swipe |
| ja | katakana | character | true | active | 2 | true | swipe, multiChoice, flashcard, typing |
| de | de-a1-numbers-time | vocabulary | true | active | 3 | false | swipe |
| de | de-a1-home-city | vocabulary | false | planned | 4 | false |  |
| de | de-a1-food-shopping | vocabulary | false | planned | 5 | false |  |
| ja | first-words | vocabulary | true | active | 5 | false |  |
| de | de-a1-daily-life | vocabulary | false | planned | 6 | false |  |
| de | de-a1-grammar | grammar | false | planned | 7 | false |  |
| de | de-a1-dialogues | phrase | false | planned | 8 | false |  |
| ja | n5-vocabulary | vocabulary | true | active | 104 | false |  |
| ja | n5-numbers-time | vocabulary | false | planned | 105 | false |  |
| ja | n5-particles | grammar | false | planned | 106 | false |  |
| ja | n5-verbs | grammar | false | planned | 107 | false |  |
| ja | n5-adjectives | grammar | false | planned | 108 | false |  |
| ja | n5-grammar | grammar | false | planned | 109 | false |  |
| ja | n5-kanji | character | false | planned | 110 | false |  |
| ja | n5-phrases | phrase | false | planned | 111 | false |  |

## Track → Categories
| Track | Category | Sort | Override |
| --- | --- | --- | --- |
| jlpt-n5 | hiragana | 1 |  |
| de-a1 | de-a1-start | 1 |  |
| jlpt-n5 | katakana | 2 |  |
| de-a1 | de-a1-people | 2 |  |
| de-a1 | de-a1-numbers-time | 3 |  |
| jlpt-n5 | first-words | 3 |  |
| jlpt-n5 | n5-vocabulary | 4 |  |
| de-a1 | de-a1-home-city | 4 |  |
| de-a1 | de-a1-food-shopping | 5 |  |
| jlpt-n5 | n5-numbers-time | 5 |  |
| de-a1 | de-a1-daily-life | 6 |  |
| jlpt-n5 | n5-particles | 6 |  |
| jlpt-n5 | n5-verbs | 7 |  |
| de-a1 | de-a1-grammar | 7 |  |
| de-a1 | de-a1-dialogues | 8 |  |
| jlpt-n5 | n5-adjectives | 8 |  |
| jlpt-n5 | n5-grammar | 9 |  |
| jlpt-n5 | n5-kanji | 10 |  |
| jlpt-n5 | n5-phrases | 11 |  |

## Courses by Category
| Category | Courses |
| --- | --- |
| de-a1-numbers-time | 1 |
| de-a1-people | 1 |
| de-a1-start | 1 |
| first-words | 1 |
| hiragana | 1 |
| katakana | 1 |
| n5-vocabulary | 1 |

## Lessons by Course
| Course | Lessons |
| --- | --- |
| de-a1-numbers-time-basics | 3 |
| de-a1-people-basics | 3 |
| de-a1-start-basics | 3 |
| first-words-basics | 7 |
| hiragana-basics | 19 |
| katakana-basics | 15 |
| n5-vocabulary-basics | 10 |

## Practice Groups by Category
| Category | Practice Groups |
| --- | --- |
| de-a1-numbers-time | 3 |
| de-a1-people | 3 |
| de-a1-start | 3 |
| hiragana | 6 |
| katakana | 6 |

## Cards by Type / Active
| Type:Active | Cards |
| --- | --- |
| character:active | 147 |
| info:active | 58 |
| quiz_4_option:active | 359 |
| vocabulary:active | 228 |

## Orphan Checks
| Check | Count |
| --- | --- |
| Learning lesson links pointing to missing lesson/card | 0 |
| Practice group links pointing to missing group/card | 0 |
| Lessons without cards | 0 |
| Practice groups without cards | 0 |
| Active practice groups without cards | 0 |
