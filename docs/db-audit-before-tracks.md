# Japanese Cards DB Audit

Generated: 2026-07-04T16:34:20.053Z

## Tables
| Table | Status | Rows / Error |
| --- | --- | --- |
| language_cards_languages | exists | 3 |
| language_cards_tracks | missing | PGRST205 |
| language_cards_track_translations | missing | PGRST205 |
| language_cards_track_categories | missing | PGRST205 |
| language_cards_categories | exists | 6 |
| language_cards_category_translations | exists | 12 |
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
Tracks query error: PGRST205

## Categories
| Language | Slug | Card Type | is_active | status | Sort | Show All | Game Modes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ja | hiragana | character | true | (missing) | 1 | true | swipe, multiChoice, flashcard, typing |
| ja | katakana | character | true | (missing) | 2 | true | swipe, multiChoice, flashcard, typing |
| ja | words | vocabulary | false | (missing) | 3 | true | multiChoice, flashcard, typing |
| ja | sentences | phrase | false | (missing) | 4 | true | multiChoice, typing |
| ja | first-words | vocabulary | true | (missing) | 5 | false |  |
| ja | n5-vocabulary | vocabulary | true | (missing) | 104 | false |  |

## Track → Categories
Track categories query error: PGRST205

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
