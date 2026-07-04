# Japanese Cards DB Audit

Generated: 2026-07-04T16:57:47.225Z

## Tables
| Table | Status | Rows / Error |
| --- | --- | --- |
| language_cards_languages | exists | 3 |
| language_cards_tracks | exists | 11 |
| language_cards_track_translations | exists | 22 |
| language_cards_track_categories | exists | 11 |
| language_cards_categories | exists | 13 |
| language_cards_category_translations | exists | 26 |
| language_cards_learning_courses | exists | 4 |
| language_cards_learning_course_translations | exists | 8 |
| language_cards_learning_lessons | exists | 51 |
| language_cards_learning_lesson_translations | exists | 102 |
| language_cards_learning_lesson_cards | exists | 703 |
| language_cards_practice_groups | exists | 14 |
| language_cards_practice_group_translations | exists | 28 |
| language_cards_practice_group_cards | exists | 153 |
| language_cards_cards | exists | 695 |
| language_cards_card_translations | exists | 368 |
| language_cards_user_settings | exists | 5 |
| language_cards_user_card_progress | exists | 340 |
| language_cards_category_snapshots | exists | 4 |
| language_cards_user_sessions | exists | 62 |
| language_cards_category_collections | missing | PGRST205 |
| language_cards_category_collection_translations | missing | PGRST205 |
| language_cards_groups | missing | PGRST205 |
| language_cards_group_translations | missing | PGRST205 |
| language_cards_courses | missing | PGRST205 |
| language_cards_course_lessons | missing | PGRST205 |
| language_cards_course_lesson_cards | missing | PGRST205 |

## Languages
| ID | Name EN | UI | Learn | Active | Sort |
| --- | --- | --- | --- | --- | --- |
| de | German | true | false | true | 1 |
| en | English | true | false | true | 2 |
| ja | Japanese | false | true | true | 3 |

## Tracks
| Language | Slug | System | Level | Status | Sort |
| --- | --- | --- | --- | --- | --- |
| ja | jlpt-n5 | jlpt | N5 | active | 1 |
| de | de-a1 | cefr | A1 | planned | 1 |
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
| ja | hiragana | character | true | active | 1 | true | swipe, multiChoice, flashcard, typing |
| ja | katakana | character | true | active | 2 | true | swipe, multiChoice, flashcard, typing |
| ja | words | vocabulary | false | deprecated | 3 | true | multiChoice, flashcard, typing |
| ja | sentences | phrase | false | deprecated | 4 | true | multiChoice, typing |
| ja | first-words | vocabulary | true | active | 5 | false |  |
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
| jlpt-n5 | katakana | 2 |  |
| jlpt-n5 | first-words | 3 |  |
| jlpt-n5 | n5-vocabulary | 4 |  |
| jlpt-n5 | n5-numbers-time | 5 |  |
| jlpt-n5 | n5-particles | 6 |  |
| jlpt-n5 | n5-verbs | 7 |  |
| jlpt-n5 | n5-adjectives | 8 |  |
| jlpt-n5 | n5-grammar | 9 |  |
| jlpt-n5 | n5-kanji | 10 |  |
| jlpt-n5 | n5-phrases | 11 |  |

## Courses by Category
| Category | Courses |
| --- | --- |
| first-words | 1 |
| hiragana | 1 |
| katakana | 1 |
| n5-vocabulary | 1 |

## Lessons by Course
| Course | Lessons |
| --- | --- |
| first-words-basics | 7 |
| hiragana-basics | 19 |
| katakana-basics | 15 |
| n5-vocabulary-basics | 10 |

## Practice Groups by Category
| Category | Practice Groups |
| --- | --- |
| hiragana | 6 |
| katakana | 6 |
| sentences | 1 |
| words | 1 |

## Cards by Type / Active
| Type:Active | Cards |
| --- | --- |
| character:active | 147 |
| info:active | 55 |
| phrase:active | 3 |
| quiz_4_option:active | 309 |
| vocabulary:active | 181 |

## Orphan Checks
| Check | Count |
| --- | --- |
| Learning lesson links pointing to missing lesson/card | 0 |
| Practice group links pointing to missing group/card | 0 |
| Lessons without cards | 0 |
| Practice groups without cards | 1 |
